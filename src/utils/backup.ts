import {
  getStoredUsers,
  getContactMessages,
  getJoinUsApplications,
} from "./storage";
import { getAnalytics } from "./analytics";

interface BackupData {
  version: string;
  timestamp: string;
  data: {
    users: any[];
    contactMessages: any[];
    joinUsApplications: any[];
    analytics: any;
  };
  metadata: {
    totalRecords: number;
    backupSize: string;
    generatedBy: string;
  };
}

export const createFullBackup = (): BackupData => {
  const users = getStoredUsers();
  const contacts = getContactMessages();
  const joinUs = getJoinUsApplications();
  const analytics = getAnalytics();

  const backupData: BackupData = {
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    data: {
      users,
      contactMessages: contacts,
      joinUsApplications: joinUs,
      analytics,
    },
    metadata: {
      totalRecords: users.length + contacts.length + joinUs.length,
      backupSize: "0 KB", // Will be calculated
      generatedBy: "ABA Creative Group Admin System",
    },
  };

  // Calculate approximate size
  const dataString = JSON.stringify(backupData);
  const sizeInBytes = new Blob([dataString]).size;
  const sizeInKB = Math.round((sizeInBytes / 1024) * 100) / 100;
  backupData.metadata.backupSize = `${sizeInKB} KB`;

  return backupData;
};

export const exportBackup = (format: "json" | "csv" = "json") => {
  const backup = createFullBackup();
  const timestamp = new Date().toISOString().split("T")[0];

  if (format === "json") {
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    downloadFile(blob, `aba-backup-${timestamp}.json`);
  } else if (format === "csv") {
    const csvData = convertToCSV(backup);
    const blob = new Blob([csvData], { type: "text/csv" });
    downloadFile(blob, `aba-backup-${timestamp}.csv`);
  }
};

const convertToCSV = (backup: BackupData): string => {
  const lines: string[] = [];

  // Header with metadata
  lines.push("# ABA Creative Group - Backup Export");
  lines.push(`# Generated: ${backup.timestamp}`);
  lines.push(`# Total Records: ${backup.metadata.totalRecords}`);
  lines.push(`# Version: ${backup.version}`);
  lines.push("");

  // Users section
  lines.push("=== USERS ===");
  lines.push("ID,Username,Name,Email,Role,Active,Created,Last Login");
  backup.data.users.forEach((user) => {
    lines.push(
      `"${user.id}","${user.username}","${user.name}","${user.email}","${user.role}","${user.isActive}","${user.createdAt}","${user.lastLogin || "Never"}"`,
    );
  });
  lines.push("");

  // Contact Messages section
  lines.push("=== CONTACT MESSAGES ===");
  lines.push(
    "ID,Name,Email,Subject,Message,Status,Submitted,Processed By,Notes",
  );
  backup.data.contactMessages.forEach((msg) => {
    const message = (msg.message || "").replace(/"/g, '""').replace(/\n/g, " ");
    const notes = (msg.notes || "").replace(/"/g, '""').replace(/\n/g, " ");
    lines.push(
      `"${msg.id}","${msg.name}","${msg.email}","${msg.subject}","${message}","${msg.status}","${msg.submittedAt}","${msg.processedBy || ""}","${notes}"`,
    );
  });
  lines.push("");

  // Join Us Applications section
  lines.push("=== JOIN US APPLICATIONS ===");
  lines.push(
    "ID,Name,Email,Phone,Domain,Presentation,Portfolio,Status,Submitted,Processed By,Notes",
  );
  backup.data.joinUsApplications.forEach((app) => {
    const presentation = (app.presentation || "")
      .replace(/"/g, '""')
      .replace(/\n/g, " ");
    const notes = (app.notes || "").replace(/"/g, '""').replace(/\n/g, " ");
    lines.push(
      `"${app.id}","${app.name}","${app.email}","${app.phone}","${app.domain}","${presentation}","${app.portfolio || ""}","${app.status}","${app.submittedAt}","${app.processedBy || ""}","${notes}"`,
    );
  });

  return lines.join("\n");
};

const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const restoreFromBackup = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup: BackupData = JSON.parse(content);

        // Validate backup structure
        if (!backup.data || !backup.version) {
          throw new Error("Format de backup invalide");
        }

        // Confirm restoration
        const confirmRestore = window.confirm(
          `Restaurer la sauvegarde du ${new Date(backup.timestamp).toLocaleDateString()} ?\n\n` +
            `Cette opération remplacera toutes les données actuelles :\n` +
            `- ${backup.data.users.length} utilisateurs\n` +
            `- ${backup.data.contactMessages.length} messages de contact\n` +
            `- ${backup.data.joinUsApplications.length} candidatures\n\n` +
            `Cette action est irréversible !`,
        );

        if (!confirmRestore) {
          resolve(false);
          return;
        }

        // Restore data
        localStorage.setItem("admin_users", JSON.stringify(backup.data.users));
        localStorage.setItem(
          "contact_messages",
          JSON.stringify(backup.data.contactMessages),
        );
        localStorage.setItem(
          "join_us_applications",
          JSON.stringify(backup.data.joinUsApplications),
        );

        alert("Sauvegarde restaurée avec succès ! La page va se recharger.");
        window.location.reload();

        resolve(true);
      } catch (error) {
        reject(
          new Error(
            "Erreur lors de la restauration : " + (error as Error).message,
          ),
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Erreur lors de la lecture du fichier"));
    };

    reader.readAsText(file);
  });
};

// Auto-backup functionality
export const setupAutoBackup = () => {
  const AUTO_BACKUP_KEY = "auto_backup_enabled";
  const LAST_BACKUP_KEY = "last_auto_backup";

  const isEnabled = localStorage.getItem(AUTO_BACKUP_KEY) === "true";

  if (isEnabled) {
    const lastBackup = localStorage.getItem(LAST_BACKUP_KEY);
    const now = new Date();
    const lastBackupDate = lastBackup ? new Date(lastBackup) : null;

    // Auto-backup every 7 days
    if (
      !lastBackupDate ||
      now.getTime() - lastBackupDate.getTime() > 7 * 24 * 60 * 60 * 1000
    ) {
      const backup = createFullBackup();
      localStorage.setItem("auto_backup_data", JSON.stringify(backup));
      localStorage.setItem(LAST_BACKUP_KEY, now.toISOString());

      console.log("🔄 Sauvegarde automatique créée");
    }
  }
};

export const enableAutoBackup = (enabled: boolean) => {
  localStorage.setItem("auto_backup_enabled", enabled.toString());
  if (enabled) {
    setupAutoBackup();
  }
};

export const getLastAutoBackup = () => {
  const backup = localStorage.getItem("auto_backup_data");
  return backup ? JSON.parse(backup) : null;
};
