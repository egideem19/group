// Système de monitoring en temps réel pour la production
import { database } from "./database";

interface MonitoringData {
  timestamp: string;
  action: string;
  details: any;
  userAgent?: string;
  ip?: string;
  sessionId: string;
}

class RealTimeMonitor {
  private sessionId: string;
  private eventBuffer: MonitoringData[] = [];
  private isOnline = navigator.onLine;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
    this.startPeriodicFlush();
  }

  private generateSessionId(): string {
    return (
      "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
    );
  }

  private setupEventListeners(): void {
    // Monitor online/offline status
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.logEvent("system", { type: "connection_restored" });
      this.flushEvents();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.logEvent("system", { type: "connection_lost" });
    });

    // Monitor page visibility
    document.addEventListener("visibilitychange", () => {
      this.logEvent("page", {
        type: "visibility_change",
        visible: !document.hidden,
      });
    });

    // Monitor errors
    window.addEventListener("error", (event) => {
      this.logEvent("error", {
        type: "javascript_error",
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
      });
    });

    // Monitor unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.logEvent("error", {
        type: "unhandled_promise_rejection",
        reason: event.reason,
      });
    });
  }

  logEvent(action: string, details: any): void {
    const event: MonitoringData = {
      timestamp: new Date().toISOString(),
      action,
      details,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
    };

    this.eventBuffer.push(event);

    // If buffer is getting large, flush immediately
    if (this.eventBuffer.length >= 50) {
      this.flushEvents();
    }
  }

  // Log specific admin actions
  logAdminAction(action: string, userId: string, details: any): void {
    this.logEvent("admin_action", {
      action,
      userId,
      ...details,
    });
  }

  // Log form submissions
  logFormSubmission(formType: "contact" | "join_us", formData: any): void {
    this.logEvent("form_submission", {
      formType,
      fields: Object.keys(formData),
      hasEmail: !!formData.email,
      hasPhone: !!formData.phone,
    });
  }

  // Log authentication events
  logAuthEvent(
    event: "login" | "logout" | "failed_login",
    userId?: string,
  ): void {
    this.logEvent("auth", {
      event,
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  private async flushEvents(): Promise<void> {
    if (this.eventBuffer.length === 0 || !this.isOnline) return;

    const eventsToFlush = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      // Store in IndexedDB for local monitoring
      await this.storeEventsLocally(eventsToFlush);

      // In production, you could send to external monitoring service
      // await this.sendToMonitoringService(eventsToFlush);
    } catch (error) {
      console.error("Failed to flush monitoring events:", error);
      // Put events back in buffer
      this.eventBuffer.unshift(...eventsToFlush);
    }
  }

  private async storeEventsLocally(events: MonitoringData[]): Promise<void> {
    // Store monitoring data locally for analysis
    const existingLogs = JSON.parse(
      localStorage.getItem("aba_monitoring_logs") || "[]",
    );
    const updatedLogs = [...existingLogs, ...events];

    // Keep only last 1000 events to prevent storage overflow
    const trimmedLogs = updatedLogs.slice(-1000);
    localStorage.setItem("aba_monitoring_logs", JSON.stringify(trimmedLogs));
  }

  private startPeriodicFlush(): void {
    // Flush events every 30 seconds
    setInterval(() => {
      this.flushEvents();
    }, 30000);

    // Flush on page unload
    window.addEventListener("beforeunload", () => {
      this.flushEvents();
    });
  }

  // Get monitoring statistics
  getStats(): any {
    const logs = JSON.parse(
      localStorage.getItem("aba_monitoring_logs") || "[]",
    );

    const stats = {
      totalEvents: logs.length,
      sessions: [...new Set(logs.map((log: MonitoringData) => log.sessionId))]
        .length,
      errorCount: logs.filter((log: MonitoringData) => log.action === "error")
        .length,
      formSubmissions: logs.filter(
        (log: MonitoringData) => log.action === "form_submission",
      ).length,
      adminActions: logs.filter(
        (log: MonitoringData) => log.action === "admin_action",
      ).length,
      lastActivity: logs.length > 0 ? logs[logs.length - 1].timestamp : null,
    };

    return stats;
  }

  // Get recent activity for dashboard
  getRecentActivity(limit = 10): MonitoringData[] {
    const logs = JSON.parse(
      localStorage.getItem("aba_monitoring_logs") || "[]",
    );
    return logs.slice(-limit).reverse();
  }

  // Clear old logs
  clearLogs(): void {
    localStorage.removeItem("aba_monitoring_logs");
    this.logEvent("system", { type: "logs_cleared" });
  }

  // Export logs for analysis
  exportLogs(): void {
    const logs = JSON.parse(
      localStorage.getItem("aba_monitoring_logs") || "[]",
    );
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aba-monitoring-logs-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
export const monitor = new RealTimeMonitor();

// Helper functions for easy usage
export const logAdminAction = (action: string, userId: string, details: any) =>
  monitor.logAdminAction(action, userId, details);

export const logFormSubmission = (
  formType: "contact" | "join_us",
  formData: any,
) => monitor.logFormSubmission(formType, formData);

export const logAuthEvent = (
  event: "login" | "logout" | "failed_login",
  userId?: string,
) => monitor.logAuthEvent(event, userId);

// Initialize monitoring
console.log("🔍 Real-time monitoring initialized");
