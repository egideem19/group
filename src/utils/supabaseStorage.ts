import { supabase } from '../lib/supabase';
import { User, ContactMessage, JoinUsApplication } from '../types/admin';

// Fonctions utilitaires pour la conversion des données
const convertSupabaseUser = (user: any): User => ({
  id: user.id,
  username: user.username,
  password: user.password,
  role: user.role,
  name: user.name,
  email: user.email,
  isFirstLogin: user.is_first_login,
  isActive: user.is_active,
  createdAt: user.created_at,
  lastLogin: user.last_login,
});

const convertUserToSupabase = (user: User) => ({
  id: user.id,
  username: user.username,
  password: user.password,
  role: user.role,
  name: user.name,
  email: user.email,
  is_first_login: user.isFirstLogin,
  is_active: user.isActive,
  created_at: user.createdAt,
  last_login: user.lastLogin,
});

const convertSupabaseContactMessage = (message: any): ContactMessage => ({
  id: message.id,
  name: message.name,
  email: message.email,
  subject: message.subject,
  message: message.message,
  status: message.status,
  submittedAt: message.submitted_at,
  processedAt: message.processed_at,
  processedBy: message.processed_by,
  notes: message.notes,
});

const convertContactMessageToSupabase = (message: ContactMessage) => ({
  id: message.id,
  name: message.name,
  email: message.email,
  subject: message.subject,
  message: message.message,
  status: message.status,
  submitted_at: message.submittedAt,
  processed_at: message.processedAt,
  processed_by: message.processedBy,
  notes: message.notes,
});

const convertSupabaseJoinUsApplication = (app: any): JoinUsApplication => ({
  id: app.id,
  name: app.name,
  email: app.email,
  phone: app.phone,
  domain: app.domain,
  presentation: app.presentation,
  portfolio: app.portfolio,
  status: app.status,
  submittedAt: app.submitted_at,
  processedAt: app.processed_at,
  processedBy: app.processed_by,
  notes: app.notes,
});

const convertJoinUsApplicationToSupabase = (app: JoinUsApplication) => ({
  id: app.id,
  name: app.name,
  email: app.email,
  phone: app.phone,
  domain: app.domain,
  presentation: app.presentation,
  portfolio: app.portfolio,
  status: app.status,
  submitted_at: app.submittedAt,
  processed_at: app.processedAt,
  processed_by: app.processedBy,
  notes: app.notes,
});

// Fonctions pour les utilisateurs
export const getStoredUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }

    return data?.map(convertSupabaseUser) || [];
  } catch (error) {
    console.error('Erreur Supabase:', error);
    return [];
  }
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    const supabaseUser = convertUserToSupabase(user);
    const { error } = await supabase
      .from('admin_users')
      .upsert(supabaseUser);

    if (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur Supabase:', error);
    throw error;
  }
};

export const getUserByCredentials = async (
  username: string,
  password: string
): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      return null;
    }

    return convertSupabaseUser(data[0]);
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    return null;
  }
};

export const generateUserId = (): string => {
  return crypto.randomUUID();
};

// Fonctions pour les messages de contact
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      return [];
    }

    return data?.map(convertSupabaseContactMessage) || [];
  } catch (error) {
    console.error('Erreur Supabase:', error);
    return [];
  }
};

export const saveContactMessage = async (message: ContactMessage): Promise<void> => {
  try {
    const supabaseMessage = convertContactMessageToSupabase(message);
    const { error } = await supabase
      .from('contact_messages')
      .upsert(supabaseMessage);

    if (error) {
      console.error('Erreur lors de la sauvegarde du message:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur Supabase:', error);
    throw error;
  }
};

export const addContactMessage = async (
  data: Omit<ContactMessage, 'id' | 'submittedAt' | 'status'>
): Promise<ContactMessage> => {
  try {
    const message: ContactMessage = {
      id: crypto.randomUUID(),
      ...data,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const supabaseMessage = convertContactMessageToSupabase(message);
    const { error } = await supabase
      .from('contact_messages')
      .insert(supabaseMessage);

    if (error) {
      console.error('Erreur lors de l\'ajout du message:', error);
      throw error;
    }

    return message;
  } catch (error) {
    console.error('Erreur Supabase:', error);
    throw error;
  }
};

// Fonctions pour les candidatures "Rejoignez-nous"
export const getJoinUsApplications = async (): Promise<JoinUsApplication[]> => {
  try {
    const { data, error } = await supabase
      .from('join_us_applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
      return [];
    }

    return data?.map(convertSupabaseJoinUsApplication) || [];
  } catch (error) {
    console.error('Erreur Supabase:', error);
    return [];
  }
};

export const saveJoinUsApplication = async (application: JoinUsApplication): Promise<void> => {
  try {
    const supabaseApplication = convertJoinUsApplicationToSupabase(application);
    const { error } = await supabase
      .from('join_us_applications')
      .upsert(supabaseApplication);

    if (error) {
      console.error('Erreur lors de la sauvegarde de la candidature:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur Supabase:', error);
    throw error;
  }
};

export const addJoinUsApplication = async (
  data: Omit<JoinUsApplication, 'id' | 'submittedAt' | 'status'>
): Promise<JoinUsApplication> => {
  try {
    const application: JoinUsApplication = {
      id: crypto.randomUUID(),
      ...data,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const supabaseApplication = convertJoinUsApplicationToSupabase(application);
    const { error } = await supabase
      .from('join_us_applications')
      .insert(supabaseApplication);

    if (error) {
      console.error('Erreur lors de l\'ajout de la candidature:', error);
      throw error;
    }

    return application;
  } catch (error) {
    console.error('Erreur Supabase:', error);
    throw error;
  }
};

// Statistiques du tableau de bord
export const getDashboardStats = async () => {
  try {
    const [contacts, joinUs, users] = await Promise.all([
      getContactMessages(),
      getJoinUsApplications(),
      getStoredUsers(),
    ]);

    const recentActivity = [
      ...contacts.slice(-5).map((contact) => ({
        id: contact.id,
        type: 'contact' as const,
        description: `Nouveau message de ${contact.name}`,
        timestamp: contact.submittedAt,
      })),
      ...joinUs.slice(-5).map((app) => ({
        id: app.id,
        type: 'join_us' as const,
        description: `Nouvelle candidature de ${app.name}`,
        timestamp: app.submittedAt,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);

    return {
      totalContactMessages: contacts.length,
      totalJoinUsApplications: joinUs.length,
      pendingContactMessages: contacts.filter((c) => c.status === 'pending').length,
      pendingJoinUsApplications: joinUs.filter((j) => j.status === 'pending').length,
      totalUsers: users.length,
      recentActivity,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return {
      totalContactMessages: 0,
      totalJoinUsApplications: 0,
      pendingContactMessages: 0,
      pendingJoinUsApplications: 0,
      totalUsers: 0,
      recentActivity: [],
    };
  }
};

// Test de connexion Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);

    return !error;
  } catch (error) {
    console.error('Erreur de connexion Supabase:', error);
    return false;
  }
};