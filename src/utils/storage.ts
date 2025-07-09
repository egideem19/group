import { User, ContactMessage, JoinUsApplication } from "../types/admin";

// Import and re-export the new database system
export * from "./database";

// Default admin user
const DEFAULT_ADMIN: User = {
  id: "admin-1",
  username: "admin",
  password: "Admin123",
  role: "admin",
  name: "Administrateur Principal",
  email: "admin@abacreativegroup.com",
  isFirstLogin: true,
  isActive: true,
  createdAt: new Date().toISOString(),
};

// Initialize storage
const initializeStorage = () => {
  const users = localStorage.getItem("admin_users");
  if (!users) {
    localStorage.setItem("admin_users", JSON.stringify([DEFAULT_ADMIN]));
  }

  const contacts = localStorage.getItem("contact_messages");
  if (!contacts) {
    localStorage.setItem("contact_messages", JSON.stringify([]));
  }

  const joinUs = localStorage.getItem("join_us_applications");
  if (!joinUs) {
    localStorage.setItem("join_us_applications", JSON.stringify([]));
  }
};

// Users
export const getStoredUsers = (): User[] => {
  initializeStorage();
  const users = localStorage.getItem("admin_users");
  return users ? JSON.parse(users) : [DEFAULT_ADMIN];
};

export const saveUser = (user: User): void => {
  const users = getStoredUsers();
  const existingIndex = users.findIndex((u) => u.id === user.id);

  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }

  localStorage.setItem("admin_users", JSON.stringify(users));
};

export const getUserByCredentials = (
  username: string,
  password: string,
): User | null => {
  const users = getStoredUsers();
  return (
    users.find(
      (user) => user.username === username && user.password === password,
    ) || null
  );
};

export const generateUserId = (): string => {
  return "user-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
};

// Contact Messages
export const getContactMessages = (): ContactMessage[] => {
  initializeStorage();
  const messages = localStorage.getItem("contact_messages");
  return messages ? JSON.parse(messages) : [];
};

export const saveContactMessage = (message: ContactMessage): void => {
  const messages = getContactMessages();
  const existingIndex = messages.findIndex((m) => m.id === message.id);

  if (existingIndex >= 0) {
    messages[existingIndex] = message;
  } else {
    messages.push(message);
  }

  localStorage.setItem("contact_messages", JSON.stringify(messages));
};

export const addContactMessage = (
  data: Omit<ContactMessage, "id" | "submittedAt" | "status">,
): ContactMessage => {
  const message: ContactMessage = {
    id: "contact-" + Date.now(),
    ...data,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  saveContactMessage(message);
  return message;
};

// Join Us Applications
export const getJoinUsApplications = (): JoinUsApplication[] => {
  initializeStorage();
  const applications = localStorage.getItem("join_us_applications");
  return applications ? JSON.parse(applications) : [];
};

export const saveJoinUsApplication = (application: JoinUsApplication): void => {
  const applications = getJoinUsApplications();
  const existingIndex = applications.findIndex((a) => a.id === application.id);

  if (existingIndex >= 0) {
    applications[existingIndex] = application;
  } else {
    applications.push(application);
  }

  localStorage.setItem("join_us_applications", JSON.stringify(applications));
};

export const addJoinUsApplication = (
  data: Omit<JoinUsApplication, "id" | "submittedAt" | "status">,
): JoinUsApplication => {
  const application: JoinUsApplication = {
    id: "joinus-" + Date.now(),
    ...data,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  saveJoinUsApplication(application);
  return application;
};

// Dashboard Stats
export const getDashboardStats = () => {
  const contacts = getContactMessages();
  const joinUs = getJoinUsApplications();
  const users = getStoredUsers();

  const recentActivity = [
    ...contacts.slice(-5).map((contact) => ({
      id: contact.id,
      type: "contact" as const,
      description: `Nouveau message de ${contact.name}`,
      timestamp: contact.submittedAt,
    })),
    ...joinUs.slice(-5).map((app) => ({
      id: app.id,
      type: "join_us" as const,
      description: `Nouvelle candidature de ${app.name}`,
      timestamp: app.submittedAt,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 10);

  return {
    totalContactMessages: contacts.length,
    totalJoinUsApplications: joinUs.length,
    pendingContactMessages: contacts.filter((c) => c.status === "pending")
      .length,
    pendingJoinUsApplications: joinUs.filter((j) => j.status === "pending")
      .length,
    totalUsers: users.length,
    recentActivity,
  };
};
