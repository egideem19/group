import React, { useState, useEffect } from "react";
import {
  Home,
  MessageCircle,
  Users,
  UserPlus,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { translations } from "../types/language";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentSection,
  onSectionChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("fr");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { auth, logout } = useAuth();

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.fr[key] || key;
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem("language", language);
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Tableau de Bord",
      icon: Home,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      permission: "all",
    },
    {
      id: "contacts",
      label: "Messages Contact",
      icon: MessageCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      permission:
        auth.user?.role === "admin" || auth.user?.role === "contact_manager",
    },
    {
      id: "join-us",
      label: "Gestion Candidatures",
      icon: UserPlus,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      permission:
        auth.user?.role === "admin" ||
        auth.user?.role === "recruitment_manager",
    },
    {
      id: "users",
      label: "Gestion Utilisateurs",
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      permission: auth.user?.role === "admin",
    },
  ].filter((item) => item.permission === "all" || item.permission === true);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".dropdown-container")) {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        } md:w-64 fixed md:relative h-full z-40`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-400 w-10 h-10 rounded-xl flex items-center justify-center">
              <Shield className="text-black" size={24} />
            </div>
            <div className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>
              <h1 className="font-black text-lg text-gray-900">ABA Admin</h1>
              <p className="text-sm text-gray-500">Panneau d'Administration</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-300 group ${
                    currentSection === item.id
                      ? `${item.bgColor} ${item.color} shadow-lg`
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    size={20}
                    className={`flex-shrink-0 ${currentSection === item.id ? item.color : "text-gray-400"} group-hover:scale-110 transition-transform duration-300`}
                  />
                  <span
                    className={`ml-3 font-medium ${isSidebarOpen ? "block" : "hidden"} md:block`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div
            className={`${isSidebarOpen ? "block" : "hidden"} md:block bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-4 text-black`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">
                  {auth.user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm">{auth.user?.name}</p>
                <p className="text-xs opacity-80">
                  {auth.user?.role === "admin"
                    ? "Administrateur"
                    : auth.user?.role === "contact_manager"
                      ? "Contact Manager"
                      : "Recruitment Manager"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {menuItems.find((item) => item.id === currentSection)
                    ?.label || "Tableau de Bord"}
                </h2>
                <p className="text-gray-500">Bienvenue, {auth.user?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />

              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 relative"
                >
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-300">
                        <div className="flex items-start space-x-3">
                          <div className="bg-blue-500 p-2 rounded-full">
                            <MessageCircle size={12} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Nouveau message de contact
                            </p>
                            <p className="text-xs text-gray-500">
                              Il y a 5 minutes
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors duration-300">
                        <div className="flex items-start space-x-3">
                          <div className="bg-purple-500 p-2 rounded-full">
                            <UserPlus size={12} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Nouvelle candidature reçue
                            </p>
                            <p className="text-xs text-gray-500">
                              Il y a 10 minutes
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm text-black">
                      {auth.user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <ChevronDown size={16} className="text-gray-600" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">
                        {auth.user?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {auth.user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => onSectionChange("profile")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-300 flex items-center"
                    >
                      <Settings size={16} className="mr-2 text-gray-400" />
                      Profil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-300 flex items-center text-red-600"
                    >
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
