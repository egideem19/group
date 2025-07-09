import React, { useState, useEffect } from "react";

interface AdminDashboardProps {
  onSectionChange?: (section: string) => void;
}
import {
  MessageCircle,
  UserPlus,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  Activity,
  Star,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardStats } from "../utils/storage";
import { DashboardStats } from "../types/admin";

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSectionChange }) => {
  const { auth } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState("today");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const dashboardStats = getDashboardStats();
    const analyticsData = getAnalytics();
    setStats(dashboardStats);
    setAnalytics(analyticsData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "processed":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "contact":
        return MessageCircle;
      case "join_us":
        return UserPlus;
      default:
        return Activity;
    }
  };

  const statsCards = [
    {
      title: "Messages Contact",
      value: stats?.totalContactMessages || 0,
      pending: stats?.pendingContactMessages || 0,
      icon: MessageCircle,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      change: "+12%",
      isUp: true,
    },
    {
      title: "Candidatures",
      value: stats?.totalJoinUsApplications || 0,
      pending: stats?.pendingJoinUsApplications || 0,
      icon: UserPlus,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      change: "+8%",
      isUp: true,
    },
    {
      title: "Utilisateurs",
      value: stats?.totalUsers || 0,
      pending: 0,
      icon: Users,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      change: "+2%",
      isUp: true,
    },
    {
      title: "Taux de Traitement",
      value: stats
        ? Math.round(
            ((stats.totalContactMessages +
              stats.totalJoinUsApplications -
              stats.pendingContactMessages -
              stats.pendingJoinUsApplications) /
              Math.max(
                stats.totalContactMessages + stats.totalJoinUsApplications,
                1,
              )) *
              100,
          )
        : 0,
      pending: 0,
      icon: TrendingUp,
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
      change: "+5%",
      isUp: true,
      isPercentage: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-8 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-2">
              Bienvenue, {auth.user?.name}! 👋
            </h1>
            <p className="text-lg opacity-90">
              Voici un aperçu de l'activité de votre plateforme aujourd'hui
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-black/20 rounded-xl p-4">
              <Calendar size={48} className="opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.iconBg} p-3 rounded-xl`}>
                <card.icon className={card.iconColor} size={24} />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm font-medium ${
                  card.isUp ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.isUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span>{card.change}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-gray-600 text-sm font-medium">
                {card.title}
              </h3>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-black text-gray-900">
                  {card.value}
                  {card.isPercentage ? "%" : ""}
                </span>
                {card.pending > 0 && (
                  <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    {card.pending} en attente
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="mr-2 text-blue-500" size={24} />
              Activité Récente
            </h3>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>

          <div className="space-y-4">
            {stats?.recentActivity.slice(0, 5).map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "contact"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-purple-500/10 text-purple-500"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="mr-2 text-yellow-500" size={24} />
            Actions Rapides
          </h3>

          <div className="space-y-4">
            <button
              onClick={() => onSectionChange?.("contacts")}
              className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageCircle
                    className="text-blue-500 group-hover:scale-110 transition-transform duration-300"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Messages Non Lus
                    </p>
                    <p className="text-sm text-gray-600">
                      {stats?.pendingContactMessages || 0} messages en attente
                    </p>
                  </div>
                </div>
                <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {stats?.pendingContactMessages || 0}
                </div>
              </div>
            </button>

            <button
              onClick={() => onSectionChange?.("join-us")}
              className="w-full p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserPlus
                    className="text-purple-500 group-hover:scale-110 transition-transform duration-300"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Nouvelles Candidatures
                    </p>
                    <p className="text-sm text-gray-600">
                      {stats?.pendingJoinUsApplications || 0} candidatures en
                      attente
                    </p>
                  </div>
                </div>
                <div className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {stats?.pendingJoinUsApplications || 0}
                </div>
              </div>
            </button>

            {auth.user?.role === "admin" && (
              <button
                onClick={() => onSectionChange?.("users")}
                className="w-full p-4 text-left bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <Users
                    className="text-green-500 group-hover:scale-110 transition-transform duration-300"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Gestion Utilisateurs
                    </p>
                    <p className="text-sm text-gray-600">
                      Créer ou gérer les comptes
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Activity className="mr-2 text-green-500" size={24} />
          Aperçu des Statuts
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <Clock className="text-yellow-500" size={32} />
            </div>
            <h4 className="font-bold text-2xl text-yellow-700">
              {(stats?.pendingContactMessages || 0) +
                (stats?.pendingJoinUsApplications || 0)}
            </h4>
            <p className="text-yellow-600 font-medium">En Attente</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h4 className="font-bold text-2xl text-green-700">
              {(stats?.totalContactMessages || 0) +
                (stats?.totalJoinUsApplications || 0) -
                (stats?.pendingContactMessages || 0) -
                (stats?.pendingJoinUsApplications || 0)}
            </h4>
            <p className="text-green-600 font-medium">Traités</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-2">
              <BarChart3 className="text-gray-500" size={32} />
            </div>
            <h4 className="font-bold text-2xl text-gray-700">
              {(stats?.totalContactMessages || 0) +
                (stats?.totalJoinUsApplications || 0)}
            </h4>
            <p className="text-gray-600 font-medium">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
