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
  MessageSquare,
  FileText,
  ChevronDown,
  Download,
  RefreshCw,
} from "lucide-react";
import { ContactMessage } from "../types/admin";
import { getContactMessages, saveContactMessage } from "../utils/storage";
import { useAuth } from "../contexts/AuthContext";

const ContactMessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const { auth } = useAuth();

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter]);

  const loadMessages = () => {
    setIsLoading(true);
    setTimeout(() => {
      const contactMessages = getContactMessages().sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      );
      setMessages(contactMessages);
      setIsLoading(false);
    }, 500);
  };

  const filterMessages = () => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(
        (message) =>
          message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((message) => message.status === statusFilter);
    }

    setFilteredMessages(filtered);
  };

  const updateMessageStatus = (
    messageId: string,
    status: "processed" | "rejected",
    userNotes?: string,
  ) => {
    const updatedMessages = messages.map((message) => {
      if (message.id === messageId) {
        const updatedMessage = {
          ...message,
          status,
          processedAt: new Date().toISOString(),
          processedBy: auth.user?.name || "Unknown",
          notes: userNotes || message.notes,
        };
        saveContactMessage(updatedMessage);
        return updatedMessage;
      }
      return message;
    });

    setMessages(updatedMessages);
    setSelectedMessage(null);
    setNotes("");
    // Force reload to ensure consistency
    loadMessages();
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
            Traité
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

  const exportToCsv = () => {
    const csvContent = [
      [
        "Nom",
        "Email",
        "Sujet",
        "Message",
        "Statut",
        "Date soumission",
        "Traité par",
        "Notes",
      ],
      ...filteredMessages.map((msg) => [
        msg.name,
        msg.email,
        msg.subject,
        msg.message.replace(/\n/g, " "),
        msg.status === "pending"
          ? "En attente"
          : msg.status === "processed"
            ? "Traité"
            : "Rejeté",
        formatDate(msg.submittedAt),
        msg.processedBy || "",
        msg.notes || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `messages-contact-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (selectedMessage) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <MessageSquare className="mr-2" size={24} />
                Message de Contact
              </h2>
              <button
                onClick={() => setSelectedMessage(null)}
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
                      {selectedMessage.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-blue-600">
                      {selectedMessage.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Date de soumission</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedMessage.submittedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Statut actuel</p>
                  {getStatusBadge(selectedMessage.status)}
                </div>

                {selectedMessage.processedBy && (
                  <div>
                    <p className="text-sm text-gray-500">Traité par</p>
                    <p className="font-semibold text-gray-900">
                      {selectedMessage.processedBy}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedMessage.processedAt &&
                        formatDate(selectedMessage.processedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <FileText className="mr-2 text-gray-400" size={20} />
                Sujet
              </h3>
              <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                {selectedMessage.subject}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Message</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {selectedMessage.notes && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Notes de traitement
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-gray-800">{selectedMessage.notes}</p>
                </div>
              </div>
            )}

            {selectedMessage.status === "pending" && (
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 resize-none"
                      placeholder="Ajoutez des notes sur le traitement de ce message..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        updateMessageStatus(
                          selectedMessage.id,
                          "processed",
                          notes,
                        )
                      }
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                    >
                      <Check className="mr-2" size={20} />
                      Marquer comme traité
                    </button>

                    <button
                      onClick={() =>
                        updateMessageStatus(
                          selectedMessage.id,
                          "rejected",
                          notes,
                        )
                      }
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center"
                    >
                      <X className="mr-2" size={20} />
                      Rejeter
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
              <MessageSquare className="mr-3 text-blue-500" size={32} />
              Gestion des Messages de Contact
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredMessages.length} message
              {filteredMessages.length !== 1 ? "s" : ""} affiché
              {filteredMessages.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadMessages}
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
            >
              <Download className="mr-2" size={16} />
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, email, sujet ou message..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 appearance-none bg-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="processed">Traités</option>
              <option value="rejected">Rejetés</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {messages.filter((m) => m.status === "pending").length}
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
                {messages.filter((m) => m.status === "processed").length}
              </h3>
              <p className="text-gray-600">Traités</p>
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
                {messages.filter((m) => m.status === "rejected").length}
              </h3>
              <p className="text-gray-600">Rejetés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
            <span className="ml-3 text-gray-600">
              Chargement des messages...
            </span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun message trouvé
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Aucun message ne correspond à vos critères de recherche."
                : "Aucun message de contact n'a encore été reçu."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sujet
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
                {filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {message.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {message.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-gray-900 max-w-xs truncate"
                        title={message.subject}
                      >
                        {message.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(message.submittedAt)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(message.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedMessage(message)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center ml-auto"
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

export default ContactMessagesManager;
