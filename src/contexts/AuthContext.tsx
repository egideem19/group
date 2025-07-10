import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "../types/admin";
import {
  getStoredUsers,
  saveUser,
  getUserByCredentials,
} from "../utils/storage";

interface AuthContextType {
  auth: AuthState;
  login: (
    username: string,
    password: string,
  ) => Promise<{
    success: boolean;
    requiresPasswordChange?: boolean;
    error?: string;
  }>;
  logout: () => void;
  changePassword: (
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    // Check if user is already logged in
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        if (parsedAuth.user && parsedAuth.isAuthenticated) {
          setAuth(parsedAuth);
        }
      } catch (error) {
        console.error("Error parsing saved auth:", error);
        localStorage.removeItem("auth");
      }
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<{
    success: boolean;
    requiresPasswordChange?: boolean;
    error?: string;
  }> => {
    try {
      const user = await getUserByCredentials(username, password);

      if (!user) {
        return {
          success: false,
          error: "Nom d'utilisateur ou mot de passe incorrect",
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          error: "Compte suspendu. Contactez l'administrateur.",
        };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      await saveUser(user);

      const newAuth = {
        isAuthenticated: true,
        user,
      };

      setAuth(newAuth);
      localStorage.setItem("auth", JSON.stringify(newAuth));

      return {
        success: true,
        requiresPasswordChange: user.isFirstLogin,
      };
    } catch (error) {
      return { success: false, error: "Erreur lors de la connexion" };
    }
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
    });
    localStorage.removeItem("auth");
  };

  const changePassword = async (
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!auth.user) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    try {
      const updatedUser = {
        ...auth.user,
        password: newPassword,
        isFirstLogin: false,
      };

      await saveUser(updatedUser);

      const newAuth = {
        ...auth,
        user: updatedUser,
      };

      setAuth(newAuth);
      localStorage.setItem("auth", JSON.stringify(newAuth));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Erreur lors du changement de mot de passe",
      };
    }
  };

  const updateUser = (user: User) => {
    const newAuth = {
      ...auth,
      user,
    };
    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        changePassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
