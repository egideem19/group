import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  ShieldX,
  User,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Settings,
} from "lucide-react";
import { User as UserType, ROLES } from "../types/admin";
import { getStoredUsers, saveUser, generateUserId } from "../utils/storage";
import { useAuth } from "../contexts/AuthContext";

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    role: "contact_manager" as UserType["role"],
  });

  const { auth } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = () => {
    setIsLoading(true);
    setTimeout(() => {
      const allUsers = getStoredUsers();
      setUsers(allUsers);
      setIsLoading(false);
    }, 300);
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredUsers(filtered);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      name: "",
      email: "",
      role: "contact_manager",
    });
  };

  const handleCreateUser = () => {
    if (
      !formData.username ||
      !formData.password ||
      !formData.name ||
      !formData.email
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Check if username already exists
    if (users.find((u) => u.username === formData.username)) {
      alert("Ce nom d'utilisateur existe déjà");
      return;
    }

    // Check if email already exists
    if (users.find((u) => u.email === formData.email)) {
      alert("Cette adresse email est déjà utilisée");
      return;
    }

    const newUser: UserType = {
      id: generateUserId(),
      ...formData,
      isFirstLogin: true,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    setUsers([...users, newUser]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    const updatedUser = {
      ...selectedUser,
      ...formData,
    };

    saveUser(updatedUser);
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setShowEditModal(false);
    setSelectedUser(null);
    resetForm();
  };

  const toggleUserStatus = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user || user.id === auth.user?.id) return; // Can't deactivate yourself

    const updatedUser = { ...user, isActive: !user.isActive };
    saveUser(updatedUser);
    setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
  };

  const resetUserPassword = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newPassword = "TempPass123";
    const updatedUser = {
      ...user,
      password: newPassword,
      isFirstLogin: true,
    };

    saveUser(updatedUser);
    setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));

    alert(
      `Mot de passe réinitialisé pour ${user.name}.\nNouveau mot de passe: ${newPassword}`,
    );
  };

  const openEditModal = (user: UserType) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadge = (role: UserType["role"]) => {
    const roleConfig = ROLES[role];
    let colorClass = "";

    switch (role) {
      case "admin":
        colorClass = "bg-red-100 text-red-800";
        break;
      case "contact_manager":
        colorClass = "bg-blue-100 text-blue-800";
        break;
      case "recruitment_manager":
        colorClass = "bg-purple-100 text-purple-800";
        break;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {roleConfig.name}
      </span>
    );
  };

  const getRoleIcon = (role: UserType["role"]) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="text-red-500" size={16} />;
      case "contact_manager":
        return <Shield className="text-blue-500" size={16} />;
      case "recruitment_manager":
        return <Shield className="text-purple-500" size={16} />;
      default:
        return <User className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="mr-3 text-orange-500" size={32} />
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredUsers.length} utilisateur
              {filteredUsers.length !== 1 ? "s" : ""} affiché
              {filteredUsers.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadUsers}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center"
            >
              <RefreshCw
                className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
                size={16}
              />
              Actualiser
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center"
            >
              <Plus className="mr-2" size={16} />
              Nouvel Utilisateur
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, nom d'utilisateur ou email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-xl">
              <ShieldCheck className="text-red-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "admin").length}
              </h3>
              <p className="text-gray-600">Administrateurs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Shield className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "contact_manager").length}
              </h3>
              <p className="text-gray-600">Gest. Contact</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Shield className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "recruitment_manager").length}
              </h3>
              <p className="text-gray-600">Gest. Recrutement</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-xl">
              <UserCheck className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.isActive).length}
              </h3>
              <p className="text-gray-600">Actifs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-orange-500" size={32} />
            <span className="ml-3 text-gray-600">
              Chargement des utilisateurs...
            </span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Aucun utilisateur ne correspond à votre recherche."
                : "Aucun utilisateur n'a encore été créé."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé le
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-orange-600 font-semibold text-sm">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {user.name}
                            {user.id === auth.user?.id && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Vous
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getRoleIcon(user.role)}
                        <div className="ml-2">{getRoleBadge(user.role)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          {user.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <UserX size={12} className="mr-1" />
                              Suspendu
                            </span>
                          )}
                        </div>
                        {user.isFirstLogin && (
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <AlertTriangle size={12} className="mr-1" />
                              Première connexion
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.lastLogin ? formatDate(user.lastLogin) : "Jamais"}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        {user.id !== auth.user?.id && (
                          <>
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`transition-colors duration-300 ${
                                user.isActive
                                  ? "text-red-600 hover:text-red-800"
                                  : "text-green-600 hover:text-green-800"
                              }`}
                              title={user.isActive ? "Suspendre" : "Activer"}
                            >
                              {user.isActive ? (
                                <UserX size={16} />
                              ) : (
                                <UserCheck size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => resetUserPassword(user.id)}
                              className="text-orange-600 hover:text-orange-800 transition-colors duration-300"
                              title="Réinitialiser le mot de passe"
                            >
                              <RefreshCw size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Plus className="mr-2 text-orange-500" size={24} />
              Créer un Nouvel Utilisateur
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateUser();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe temporaire *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserType["role"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                  required
                >
                  <option value="contact_manager">
                    Gestionnaire de Contact
                  </option>
                  <option value="recruitment_manager">
                    Gestionnaire de Recrutement
                  </option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Edit className="mr-2 text-blue-500" size={24} />
              Modifier l'Utilisateur
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditUser();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserType["role"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  required
                  disabled={selectedUser.id === auth.user?.id} // Can't change your own role
                >
                  <option value="contact_manager">
                    Gestionnaire de Contact
                  </option>
                  <option value="recruitment_manager">
                    Gestionnaire de Recrutement
                  </option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
