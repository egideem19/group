import { User, ContactMessage, JoinUsApplication } from "../types/admin";

// Import Supabase functions
import {
  getStoredUsers as getSupabaseUsers,
  saveUser as saveSupabaseUser,
  getUserByCredentials as getSupabaseUserByCredentials,
  generateUserId as generateSupabaseUserId,
  getContactMessages as getSupabaseContactMessages,
  saveContactMessage as saveSupabaseContactMessage,
  addContactMessage as addSupabaseContactMessage,
  getJoinUsApplications as getSupabaseJoinUsApplications,
  saveJoinUsApplication as saveSupabaseJoinUsApplication,
  addJoinUsApplication as addSupabaseJoinUsApplication,
  getDashboardStats as getSupabaseDashboardStats,
  testSupabaseConnection,
} from './supabaseStorage';

// Check if Supabase is available
const useSupabase = async (): Promise<boolean> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('📦 Using localStorage fallback (Supabase not configured)');
    return false;
  }
  
  const isConnected = await testSupabaseConnection();
  if (isConnected) {
    console.log('🚀 Using Supabase database');
    return true;
  } else {
    console.log('📦 Using localStorage fallback (Supabase connection failed)');
    return false;
  }
};

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

// Users - with Supabase integration
export const getStoredUsers = async (): Promise<User[]> => {
  if (await useSupabase()) {
    return getSupabaseUsers();
  }
  
  initializeStorage();
  const users = localStorage.getItem("admin_users");
  return users ? JSON.parse(users) : [DEFAULT_ADMIN];
};

export const saveUser = async (user: User): Promise<void> => {
  if (await useSupabase()) {
    return saveSupabaseUser(user);
  }
  
  const users = await getStoredUsers();
  const existingIndex = users.findIndex((u) => u.id === user.id);

  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }

  localStorage.setItem("admin_users", JSON.stringify(users));
};

export const getUserByCredentials = async (
  username: string,
  password: string,
): Promise<User | null> => {
  if (await useSupabase()) {
    return getSupabaseUserByCredentials(username, password);
  }
  
  const users = await getStoredUsers();
  return (
    users.find(
      (user) => user.username === username && user.password === password,
    ) || null
  );
};

export const generateUserId = (): string => {
  // Use crypto.randomUUID if available, fallback to timestamp-based
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "user-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
};

// Contact Messages - with Supabase integration
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  if (await useSupabase()) {
    return getSupabaseContactMessages();
  }
  
  initializeStorage();
  const messages = localStorage.getItem("contact_messages");
  return messages ? JSON.parse(messages) : [];
};

export const saveContactMessage = async (message: ContactMessage): Promise<void> => {
  if (await useSupabase()) {
    return saveSupabaseContactMessage(message);
  }
  
  const messages = await getContactMessages();
  const existingIndex = messages.findIndex((m) => m.id === message.id);

  if (existingIndex >= 0) {
    messages[existingIndex] = message;
  } else {
    messages.push(message);
  }

  localStorage.setItem("contact_messages", JSON.stringify(messages));
};

export const addContactMessage = async (
  data: Omit<ContactMessage, "id" | "submittedAt" | "status">,
): Promise<ContactMessage> => {
  if (await useSupabase()) {
    return addSupabaseContactMessage(data);
  }
  
  const message: ContactMessage = {
    id: "contact-" + Date.now(),
    ...data,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  await saveContactMessage(message);
  return message;
};

// Join Us Applications - with Supabase integration
export const getJoinUsApplications = async (): Promise<JoinUsApplication[]> => {
  if (await useSupabase()) {
    return getSupabaseJoinUsApplications();
  }
  
  initializeStorage();
  const applications = localStorage.getItem("join_us_applications");
  return applications ? JSON.parse(applications) : [];
};

export const saveJoinUsApplication = async (application: JoinUsApplication): Promise<void> => {
  if (await useSupabase()) {
    return saveSupabaseJoinUsApplication(application);
  }
  
  const applications = await getJoinUsApplications();
  const existingIndex = applications.findIndex((a) => a.id === application.id);

  if (existingIndex >= 0) {
    applications[existingIndex] = application;
  } else {
    applications.push(application);
  }

  localStorage.setItem("join_us_applications", JSON.stringify(applications));
};

export const addJoinUsApplication = async (
  data: Omit<JoinUsApplication, "id" | "submittedAt" | "status">,
): Promise<JoinUsApplication> => {
  if (await useSupabase()) {
    return addSupabaseJoinUsApplication(data);
  }
  
  const application: JoinUsApplication = {
    id: "joinus-" + Date.now(),
    ...data,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  await saveJoinUsApplication(application);
  return application;
};

// Dashboard Stats - with Supabase integration
export const getDashboardStats = async () => {
  if (await useSupabase()) {
    return getSupabaseDashboardStats();
  }
  
  const contacts = await getContactMessages();
  const joinUs = await getJoinUsApplications();
  const users = await getStoredUsers();

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
