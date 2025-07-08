import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  Mail,
  User,
  Calendar,
  UserPlus,
  Phone,
  ExternalLink,
  ChevronDown,
  Download,
  RefreshCw,
  Briefcase,
} from "lucide-react";
import { JoinUsApplication } from "../types/admin";
import { getJoinUsApplications, saveJoinUsApplication } from "../utils/storage";
import { useAuth } from "../contexts/AuthContext";

const JoinUsManager: React.FC = () => {
  const [applications, setApplications] = useState<JoinUsApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    JoinUsApplication[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] =
    useState<JoinUsApplication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const { auth } = useAuth();

  const domains = [
    { value: "chanteur", label: "Chanteur" },
    { value: "acteur", label: "Acteur" },
    { value: "mannequin", label: "Mannequin" },
    { value: "musicien", label: "Musicien" },
    { value: "realisateur", label: "Réalisateur" },
    { value: "createur", label: "Créateur de contenu" },
  ];

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, domainFilter]);

  const loadApplications = () => {
    setIsLoading(true);
    setTimeout(() => {
      const joinUsApplications = getJoinUsApplications().sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      );
      setApplications(joinUsApplications);
      setIsLoading(false);
    }, 500);
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.presentation.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (domainFilter !== "all") {
      filtered = filtered.filter((app) => app.domain === domainFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = (
    appId: string,
    status: "processed" | "rejected",
    userNotes?: string,
  ) => {
    const updatedApplications = applications.map((app) => {
      if (app.id === appId) {
        const updatedApp = {
          ...app,
          status,
          processedAt: new Date().toISOString(),
          processedBy: auth.user?.name || "Unknown",
          notes: userNotes || app.notes,
        };
        saveJoinUsApplication(updatedApp);
        return updatedApp;
      }
      return app;
    });

    setApplications(updatedApplications);
    setSelectedApplication(null);
    setNotes("");
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            En attente
          </span>
        );
      case "processed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check size={12} className="mr-1" />
            Accepté
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X size={12} className="mr-1" />
            Rejeté
          </span>
        );
      default:
        return null;
    }
  };

  const getDomainLabel = (domain: string) => {
    const domainObj = domains.find((d) => d.value === domain);
    return domainObj ? domainObj.label : domain;
  };

  const exportToCsv = () => {
    const csvContent = [
      [
        "Nom",
        "Email",
        "Téléphone",
        "Domaine",
        "Présentation",
        "Portfolio",
        "Statut",
        "Date soumission",
        "Traité par",
        "Notes",
      ],
      ...filteredApplications.map((app) => [
        app.name,
        app.email,
        app.phone,
        getDomainLabel(app.domain),
        app.presentation.replace(/\n/g, " "),
        app.portfolio || "",
        app.status === "pending"
          ? "En attente"
          : app.status === "processed"
            ? "Accepté"
            : "Rejeté",
        formatDate(app.submittedAt),
        app.processedBy || "",
        app.notes || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candidatures-rejoignez-nous-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (selectedApplication) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <UserPlus className="mr-2" size={24} />
                Candidature - Rejoignez-nous
              </h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-white hover:text-gray-200 transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="font-semibold text-gray-900">
                      {selectedApplication.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-blue-600">
                      {selectedApplication.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-semibold text-gray-900">
                      {selectedApplication.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Briefcase className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Domaine d'expertise</p>
                    <p className="font-semibold text-purple-600">
                      {getDomainLabel(selectedApplication.domain)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Date de soumission</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedApplication.submittedAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Statut actuel</p>
                  {getStatusBadge(selectedApplication.status)}
                </div>
              </div>
            </div>

            {selectedApplication.processedBy && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Traité par</p>
                <p className="font-semibold text-gray-900">
                  {selectedApplication.processedBy}
                </p>
                <p className="text-sm text-gray-400">
                  {selectedApplication.processedAt &&
                    formatDate(selectedApplication.processedAt)}
                </p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Présentation du candidat
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {selectedApplication.presentation}
                </p>
              </div>
            </div>

            {selectedApplication.portfolio && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Portfolio</h3>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <a
                    href={selectedApplication.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-300"
                  >
                    <ExternalLink className="mr-2" size={16} />
                    {selectedApplication.portfolio}
                  </a>
                </div>
              </div>
            )}

            {selectedApplication.notes && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Notes de traitement
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-gray-800">{selectedApplication.notes}</p>
                </div>
              </div>
            )}

            {selectedApplication.status === "pending" && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Actions de traitement
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (optionnel)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 resize-none"
                      placeholder="Ajoutez des notes sur le traitement de cette candidature..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        updateApplicationStatus(
                          selectedApplication.id,
                          "processed",
                          notes,
                        )
                      }
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                    >
                      <Check className="mr-2" size={20} />
                      Accepter la candidature
                    </button>

                    <button
                      onClick={() =>
                        updateApplicationStatus(
                          selectedApplication.id,
                          "rejected",
                          notes,
                        )
                      }
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center"
                    >
                      <X className="mr-2" size={20} />
                      Rejeter la candidature
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <UserPlus className="mr-3 text-purple-500" size={32} />
              Gestion des Candidatures - Rejoignez-nous
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredApplications.length} candidature
              {filteredApplications.length !== 1 ? "s" : ""} affiché
              {filteredApplications.length !== 1 ? "es" : "e"}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadApplications}
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
              onClick={exportToCsv}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300 flex items-center"
            >
              <Download className="mr-2" size={16} />
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, email, téléphone, domaine ou présentation..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 appearance-none bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processed">Acceptés</option>
                <option value="rejected">Rejetés</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>

            <div className="relative">
              <Briefcase
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 appearance-none bg-white"
              >
                <option value="all">Tous les domaines</option>
                {domains.map((domain) => (
                  <option key={domain.value} value={domain.value}>
                    {domain.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {applications.filter((a) => a.status === "pending").length}
              </h3>
              <p className="text-gray-600">En attente</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-xl">
              <Check className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {applications.filter((a) => a.status === "processed").length}
              </h3>
              <p className="text-gray-600">Acceptés</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-xl">
              <X className="text-red-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {applications.filter((a) => a.status === "rejected").length}
              </h3>
              <p className="text-gray-600">Rejetés</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-xl">
              <UserPlus className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {applications.length}
              </h3>
              <p className="text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-purple-500" size={32} />
            <span className="ml-3 text-gray-600">
              Chargement des candidatures...
            </span>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune candidature trouvée
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || domainFilter !== "all"
                ? "Aucune candidature ne correspond à vos critères de recherche."
                : "Aucune candidature n'a encore été reçue."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domaine
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.name}
                        </div>
                        <div
                          className="text-sm text-gray-500 max-w-xs truncate"
                          title={application.presentation}
                        >
                          {application.presentation}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {getDomainLabel(application.domain)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {application.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(application.submittedAt)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="text-purple-600 hover:text-purple-800 transition-colors duration-300 flex items-center ml-auto"
                      >
                        <Eye size={16} className="mr-1" />
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinUsManager;
