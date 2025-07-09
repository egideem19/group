export interface User {
  id: string;
  username: string;
  password: string;
  role: "admin" | "contact_manager" | "recruitment_manager";
  name: string;
  email: string;
  isFirstLogin: boolean;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "pending" | "processed" | "rejected";
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
}

export interface JoinUsApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  domain: string;
  presentation: string;
  portfolio?: string;
  status: "pending" | "processed" | "rejected";
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface DashboardStats {
  totalContactMessages: number;
  totalJoinUsApplications: number;
  pendingContactMessages: number;
  pendingJoinUsApplications: number;
  totalUsers: number;
  recentActivity: Array<{
    id: string;
    type: "contact" | "join_us" | "user_action";
    description: string;
    timestamp: string;
  }>;
}

export const ROLES = {
  admin: {
    name: "Administrateur",
    permissions: ["all"],
  },
  contact_manager: {
    name: "Gestionnaire de Contact",
    permissions: ["view_contacts", "manage_contacts"],
  },
  recruitment_manager: {
    name: "Gestionnaire de Recrutement",
    permissions: ["view_recruitment", "manage_recruitment"],
  },
} as const;
