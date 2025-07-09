import { getContactMessages, getJoinUsApplications } from "./storage";
import { ContactMessage, JoinUsApplication } from "../types/admin";

interface DateStats {
  date: string;
  contacts: number;
  joinUs: number;
  total: number;
}

interface DomainStats {
  domain: string;
  count: number;
  percentage: number;
}

interface StatusStats {
  pending: number;
  processed: number;
  rejected: number;
  total: number;
}

export const getAnalytics = () => {
  const contacts = getContactMessages();
  const joinUs = getJoinUsApplications();

  // Stats par statut pour les contacts
  const contactStats: StatusStats = {
    pending: contacts.filter((c) => c.status === "pending").length,
    processed: contacts.filter((c) => c.status === "processed").length,
    rejected: contacts.filter((c) => c.status === "rejected").length,
    total: contacts.length,
  };

  // Stats par statut pour les candidatures
  const joinUsStats: StatusStats = {
    pending: joinUs.filter((j) => j.status === "pending").length,
    processed: joinUs.filter((j) => j.status === "processed").length,
    rejected: joinUs.filter((j) => j.status === "rejected").length,
    total: joinUs.length,
  };

  // Stats par domaine pour les candidatures
  const domainCounts: { [key: string]: number } = {};
  joinUs.forEach((app) => {
    domainCounts[app.domain] = (domainCounts[app.domain] || 0) + 1;
  });

  const domainStats: DomainStats[] = Object.entries(domainCounts)
    .map(([domain, count]) => ({
      domain,
      count,
      percentage: Math.round((count / joinUs.length) * 100) || 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Stats par jour (derniers 7 jours)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const dailyStats: DateStats[] = last7Days.map((date) => {
    const contactsForDay = contacts.filter(
      (c) => c.submittedAt.split("T")[0] === date,
    ).length;

    const joinUsForDay = joinUs.filter(
      (j) => j.submittedAt.split("T")[0] === date,
    ).length;

    return {
      date,
      contacts: contactsForDay,
      joinUs: joinUsForDay,
      total: contactsForDay + joinUsForDay,
    };
  });

  // Taux de conversion
  const conversionRate = {
    contacts:
      contactStats.total > 0
        ? Math.round((contactStats.processed / contactStats.total) * 100)
        : 0,
    joinUs:
      joinUsStats.total > 0
        ? Math.round((joinUsStats.processed / joinUsStats.total) * 100)
        : 0,
  };

  // Temps de réponse moyen (simulation)
  const averageResponseTime = {
    contacts: "2.3 heures",
    joinUs: "4.7 heures",
  };

  // Tendance (simulation basée sur les données)
  const calculateTrend = (data: any[]) => {
    if (data.length < 2) return 0;
    const recent = data
      .slice(-3)
      .reduce((sum, item) => sum + (item.total || item.count || 0), 0);
    const previous = data
      .slice(-6, -3)
      .reduce((sum, item) => sum + (item.total || item.count || 0), 0);
    return previous > 0
      ? Math.round(((recent - previous) / previous) * 100)
      : 0;
  };

  return {
    contactStats,
    joinUsStats,
    domainStats,
    dailyStats,
    conversionRate,
    averageResponseTime,
    trends: {
      contacts: calculateTrend(dailyStats),
      joinUs: calculateTrend(dailyStats),
      overall: calculateTrend(dailyStats),
    },
    highlights: {
      mostActiveDomain: domainStats[0]?.domain || "Aucun",
      busiestDay: dailyStats.reduce(
        (max, day) => (day.total > max.total ? day : max),
        dailyStats[0],
      ),
      totalSubmissions: contactStats.total + joinUsStats.total,
      pendingTotal: contactStats.pending + joinUsStats.pending,
    },
  };
};

export const exportAnalytics = () => {
  const analytics = getAnalytics();
  const data = {
    generatedAt: new Date().toISOString(),
    summary: analytics.highlights,
    contactStats: analytics.contactStats,
    joinUsStats: analytics.joinUsStats,
    domainBreakdown: analytics.domainStats,
    dailyActivity: analytics.dailyStats,
    conversionRates: analytics.conversionRate,
    trends: analytics.trends,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
};
