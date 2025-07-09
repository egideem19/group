// Base de données interne robuste avec IndexedDB pour la production
import { User, ContactMessage, JoinUsApplication } from "../types/admin";

const DB_NAME = "ABACreativeGroupDB";
const DB_VERSION = 1;

// Stores
const STORES = {
  USERS: "users",
  CONTACT_MESSAGES: "contactMessages",
  JOIN_US_APPLICATIONS: "joinUsApplications",
  SETTINGS: "settings",
  SESSIONS: "sessions",
};

// Default admin user
const DEFAULT_ADMIN: User = {
  id: "admin-default",
  username: "admin",
  password: "Admin123",
  role: "admin",
  name: "Administrateur Principal",
  email: "admin@abacreativegroup.com",
  isFirstLogin: true,
  isActive: true,
  createdAt: new Date().toISOString(),
};

class ABADatabase {
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  // Initialize database
  async init(): Promise<void> {
    if (this.isInitialized && this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error("Database failed to open");
        // Fallback to localStorage
        this.initLocalStorageFallback();
        resolve();
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log("✅ ABA Database initialized successfully");
        this.setupDefaultData();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.createStores();
      };
    });
  }

  private createStores(): void {
    if (!this.db) return;

    // Users store
    if (!this.db.objectStoreNames.contains(STORES.USERS)) {
      const userStore = this.db.createObjectStore(STORES.USERS, {
        keyPath: "id",
      });
      userStore.createIndex("username", "username", { unique: true });
      userStore.createIndex("email", "email", { unique: true });
    }

    // Contact messages store
    if (!this.db.objectStoreNames.contains(STORES.CONTACT_MESSAGES)) {
      const contactStore = this.db.createObjectStore(STORES.CONTACT_MESSAGES, {
        keyPath: "id",
      });
      contactStore.createIndex("email", "email");
      contactStore.createIndex("status", "status");
      contactStore.createIndex("submittedAt", "submittedAt");
    }

    // Join us applications store
    if (!this.db.objectStoreNames.contains(STORES.JOIN_US_APPLICATIONS)) {
      const joinUsStore = this.db.createObjectStore(
        STORES.JOIN_US_APPLICATIONS,
        { keyPath: "id" },
      );
      joinUsStore.createIndex("email", "email");
      joinUsStore.createIndex("domain", "domain");
      joinUsStore.createIndex("status", "status");
      joinUsStore.createIndex("submittedAt", "submittedAt");
    }

    // Settings store
    if (!this.db.objectStoreNames.contains(STORES.SETTINGS)) {
      this.db.createObjectStore(STORES.SETTINGS, { keyPath: "key" });
    }

    // Sessions store
    if (!this.db.objectStoreNames.contains(STORES.SESSIONS)) {
      const sessionStore = this.db.createObjectStore(STORES.SESSIONS, {
        keyPath: "id",
      });
      sessionStore.createIndex("userId", "userId");
      sessionStore.createIndex("createdAt", "createdAt");
    }
  }

  private async setupDefaultData(): Promise<void> {
    // Check if admin user exists, if not create it
    const existingAdmin = await this.getUser(DEFAULT_ADMIN.id);
    if (!existingAdmin) {
      await this.addUser(DEFAULT_ADMIN);
      console.log("✅ Default admin user created");
    }

    // Set up default settings
    await this.setSetting("autoBackupEnabled", false);
    await this.setSetting("lastBackupDate", new Date().toISOString());
    await this.setSetting("version", "1.0.0");
  }

  private initLocalStorageFallback(): void {
    console.warn("⚠️ IndexedDB not available, using localStorage fallback");

    // Initialize localStorage with default data if not exists
    if (!localStorage.getItem("aba_users")) {
      localStorage.setItem("aba_users", JSON.stringify([DEFAULT_ADMIN]));
    }
    if (!localStorage.getItem("aba_contact_messages")) {
      localStorage.setItem("aba_contact_messages", JSON.stringify([]));
    }
    if (!localStorage.getItem("aba_join_us_applications")) {
      localStorage.setItem("aba_join_us_applications", JSON.stringify([]));
    }
  }

  // Generic database operations
  private async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], mode);
      const store = transaction.objectStore(storeName);
      const request = operation(store);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // User operations
  async addUser(user: User): Promise<void> {
    try {
      await this.performTransaction(STORES.USERS, "readwrite", (store) =>
        store.add(user),
      );
    } catch (error) {
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem("aba_users") || "[]");
      users.push(user);
      localStorage.setItem("aba_users", JSON.stringify(users));
    }
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const result = await this.performTransaction(
        STORES.USERS,
        "readonly",
        (store) => store.get(id),
      );
      return result || null;
    } catch (error) {
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem("aba_users") || "[]");
      return users.find((u: User) => u.id === id) || null;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const result = await this.performTransaction(
        STORES.USERS,
        "readonly",
        (store) => store.getAll(),
      );
      return result || [];
    } catch (error) {
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem("aba_users") || "[]");
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      await this.performTransaction(STORES.USERS, "readwrite", (store) =>
        store.put(user),
      );
    } catch (error) {
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem("aba_users") || "[]");
      const index = users.findIndex((u: User) => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        localStorage.setItem("aba_users", JSON.stringify(users));
      }
    }
  }

  async getUserByCredentials(
    username: string,
    password: string,
  ): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return (
        users.find(
          (user) => user.username === username && user.password === password,
        ) || null
      );
    } catch (error) {
      return null;
    }
  }

  // Contact message operations
  async addContactMessage(message: ContactMessage): Promise<void> {
    try {
      await this.performTransaction(
        STORES.CONTACT_MESSAGES,
        "readwrite",
        (store) => store.add(message),
      );
    } catch (error) {
      // Fallback to localStorage
      const messages = JSON.parse(
        localStorage.getItem("aba_contact_messages") || "[]",
      );
      messages.push(message);
      localStorage.setItem("aba_contact_messages", JSON.stringify(messages));
    }
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    try {
      const result = await this.performTransaction(
        STORES.CONTACT_MESSAGES,
        "readonly",
        (store) => store.getAll(),
      );
      return result || [];
    } catch (error) {
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem("aba_contact_messages") || "[]");
    }
  }

  async updateContactMessage(message: ContactMessage): Promise<void> {
    try {
      await this.performTransaction(
        STORES.CONTACT_MESSAGES,
        "readwrite",
        (store) => store.put(message),
      );
    } catch (error) {
      // Fallback to localStorage
      const messages = JSON.parse(
        localStorage.getItem("aba_contact_messages") || "[]",
      );
      const index = messages.findIndex(
        (m: ContactMessage) => m.id === message.id,
      );
      if (index !== -1) {
        messages[index] = message;
        localStorage.setItem("aba_contact_messages", JSON.stringify(messages));
      }
    }
  }

  // Join us application operations
  async addJoinUsApplication(application: JoinUsApplication): Promise<void> {
    try {
      await this.performTransaction(
        STORES.JOIN_US_APPLICATIONS,
        "readwrite",
        (store) => store.add(application),
      );
    } catch (error) {
      // Fallback to localStorage
      const applications = JSON.parse(
        localStorage.getItem("aba_join_us_applications") || "[]",
      );
      applications.push(application);
      localStorage.setItem(
        "aba_join_us_applications",
        JSON.stringify(applications),
      );
    }
  }

  async getAllJoinUsApplications(): Promise<JoinUsApplication[]> {
    try {
      const result = await this.performTransaction(
        STORES.JOIN_US_APPLICATIONS,
        "readonly",
        (store) => store.getAll(),
      );
      return result || [];
    } catch (error) {
      // Fallback to localStorage
      return JSON.parse(
        localStorage.getItem("aba_join_us_applications") || "[]",
      );
    }
  }

  async updateJoinUsApplication(application: JoinUsApplication): Promise<void> {
    try {
      await this.performTransaction(
        STORES.JOIN_US_APPLICATIONS,
        "readwrite",
        (store) => store.put(application),
      );
    } catch (error) {
      // Fallback to localStorage
      const applications = JSON.parse(
        localStorage.getItem("aba_join_us_applications") || "[]",
      );
      const index = applications.findIndex(
        (a: JoinUsApplication) => a.id === application.id,
      );
      if (index !== -1) {
        applications[index] = application;
        localStorage.setItem(
          "aba_join_us_applications",
          JSON.stringify(applications),
        );
      }
    }
  }

  // Settings operations
  async setSetting(key: string, value: any): Promise<void> {
    try {
      await this.performTransaction(STORES.SETTINGS, "readwrite", (store) =>
        store.put({ key, value, updatedAt: new Date().toISOString() }),
      );
    } catch (error) {
      localStorage.setItem(`aba_setting_${key}`, JSON.stringify(value));
    }
  }

  async getSetting(key: string): Promise<any> {
    try {
      const result = await this.performTransaction(
        STORES.SETTINGS,
        "readonly",
        (store) => store.get(key),
      );
      return result?.value;
    } catch (error) {
      const stored = localStorage.getItem(`aba_setting_${key}`);
      return stored ? JSON.parse(stored) : null;
    }
  }

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    if (!this.db) return;

    const storeNames = Object.values(STORES);
    const transaction = this.db.transaction(storeNames, "readwrite");

    storeNames.forEach((storeName) => {
      transaction.objectStore(storeName).clear();
    });

    // Also clear localStorage fallback
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("aba_")) {
        localStorage.removeItem(key);
      }
    });
  }

  // Get database statistics
  async getStats(): Promise<any> {
    const users = await this.getAllUsers();
    const contacts = await this.getAllContactMessages();
    const joinUs = await this.getAllJoinUsApplications();

    return {
      users: users.length,
      contactMessages: contacts.length,
      joinUsApplications: joinUs.length,
      totalRecords: users.length + contacts.length + joinUs.length,
      storageType: this.db ? "IndexedDB" : "localStorage",
      lastUpdate: new Date().toISOString(),
    };
  }
}

// Create singleton instance
export const database = new ABADatabase();

// Initialize database on app start
database.init().catch(console.error);

// Export helper functions that match the existing API
export const getStoredUsers = () => database.getAllUsers();
export const saveUser = (user: User) => database.updateUser(user);
export const addUser = (user: User) => database.addUser(user);
export const getUserByCredentials = (username: string, password: string) =>
  database.getUserByCredentials(username, password);

export const getContactMessages = () => database.getAllContactMessages();
export const saveContactMessage = (message: ContactMessage) =>
  database.updateContactMessage(message);
export const addContactMessage = (
  data: Omit<ContactMessage, "id" | "submittedAt" | "status">,
) => {
  const message: ContactMessage = {
    id: "contact-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
    ...data,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  database.addContactMessage(message);
  return message;
};

export const getJoinUsApplications = () => database.getAllJoinUsApplications();
export const saveJoinUsApplication = (application: JoinUsApplication) =>
  database.updateJoinUsApplication(application);
export const addJoinUsApplication = (
  data: Omit<JoinUsApplication, "id" | "submittedAt" | "status">,
) => {
  const application: JoinUsApplication = {
    id: "joinus-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
    ...data,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  database.addJoinUsApplication(application);
  return application;
};

export const generateUserId = (): string => {
  return "user-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
};

// Dashboard stats compatible with existing code
export const getDashboardStats = async () => {
  const contacts = await database.getAllContactMessages();
  const joinUs = await database.getAllJoinUsApplications();
  const users = await database.getAllUsers();

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
