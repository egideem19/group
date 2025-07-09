import { useState, useEffect } from "react";
import { getContactMessages, getJoinUsApplications } from "../utils/storage";

interface Notification {
  id: string;
  type: "contact" | "join_us";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const generateNotifications = () => {
    const contacts = getContactMessages();
    const joinUs = getJoinUsApplications();

    const newNotifications: Notification[] = [];

    // Recent contacts (last 5)
    contacts.slice(-5).forEach((contact) => {
      if (contact.status === "pending") {
        newNotifications.push({
          id: `contact-${contact.id}`,
          type: "contact",
          title: "Nouveau message de contact",
          message: `${contact.name} a envoyé un message`,
          timestamp: contact.submittedAt,
          isRead: false,
        });
      }
    });

    // Recent join us applications (last 5)
    joinUs.slice(-5).forEach((app) => {
      if (app.status === "pending") {
        newNotifications.push({
          id: `joinus-${app.id}`,
          type: "join_us",
          title: "Nouvelle candidature",
          message: `${app.name} a soumis une candidature`,
          timestamp: app.submittedAt,
          isRead: false,
        });
      }
    });

    // Sort by timestamp (most recent first)
    newNotifications.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter((n) => !n.isRead).length);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
    setUnreadCount(0);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600)
      return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400)
      return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    return `Il y a ${Math.floor(diffInSeconds / 86400)} jour(s)`;
  };

  useEffect(() => {
    generateNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(generateNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getTimeAgo,
    refreshNotifications: generateNotifications,
  };
};
