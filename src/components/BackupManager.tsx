import React, { useState, useRef } from "react";
import {
  Download,
  Upload,
  RefreshCw,
  Shield,
  Calendar,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  Settings,
  Database,
} from "lucide-react";
import {
  exportBackup,
  restoreFromBackup,
  getLastAutoBackup,
  enableAutoBackup,
  setupAutoBackup,
} from "../utils/backup";

const BackupManager: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(
    localStorage.getItem("auto_backup_enabled") === "true",
  );
  const [lastBackup, setLastBackup] = useState(getLastAutoBackup());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async (format: "json" | "csv") => {
    setIsExporting(true);
    try {
      exportBackup(format);
      setTimeout(() => setIsExporting(false), 2000);
    } catch (error) {
      alert("Erreur lors de l'export : " + (error as Error).message);
      setIsExporting(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    try {
      const success = await restoreFromBackup(file);
      if (success) {
        // Page will reload automatically
      }
    } catch (error) {
      alert("Erreur lors de la restauration : " + (error as Error).message);
    } finally {
      setIsRestoring(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAutoBackupToggle = (enabled: boolean) => {
    setAutoBackupEnabled(enabled);
    enableAutoBackup(enabled);
    if (enabled) {
      setupAutoBackup();
      setLastBackup(getLastAutoBackup());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBackupStats = () => {
    const users = JSON.parse(localStorage.getItem("admin_users") || "[]");
    const contacts = JSON.parse(
      localStorage.getItem("contact_messages") || "[]",
    );
    const joinUs = JSON.parse(
      localStorage.getItem("join_us_applications") || "[]",
    );

    return {
      users: users.length,
      contacts: contacts.length,
      joinUs: joinUs.length,
      total: users.length + contacts.length + joinUs.length,
    };
  };

  const stats = getBackupStats();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Database className="mr-3 text-blue-500" size={32} />
              Gestion des Sauvegardes
            </h2>
            <p className="text-gray-600 mt-1">
              Sauvegardez et restaurez vos données en toute sécurité
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.users}
            </div>
            <div className="text-sm text-blue-800">Utilisateurs</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.contacts}
            </div>
            <div className="text-sm text-green-800">Messages</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.joinUs}
            </div>
            <div className="text-sm text-purple-800">Candidatures</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.total}
            </div>
            <div className="text-sm text-yellow-800">Total</div>
          </div>
        </div>

        {/* Export Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Download className="mr-2 text-green-500" size={20} />
            Exporter les Données
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleExport("json")}
              disabled={isExporting}
              className="flex items-center justify-center px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isExporting ? (
                <RefreshCw className="animate-spin mr-2" size={20} />
              ) : (
                <Download
                  className="mr-2 group-hover:scale-110 transition-transform duration-300"
                  size={20}
                />
              )}
              Export JSON
              <div className="text-xs opacity-80 ml-2">(Complet)</div>
            </button>

            <button
              onClick={() => handleExport("csv")}
              disabled={isExporting}
              className="flex items-center justify-center px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isExporting ? (
                <RefreshCw className="animate-spin mr-2" size={20} />
              ) : (
                <Download
                  className="mr-2 group-hover:scale-110 transition-transform duration-300"
                  size={20}
                />
              )}
              Export CSV
              <div className="text-xs opacity-80 ml-2">(Excel)</div>
            </button>
          </div>
        </div>

        {/* Restore Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="mr-2 text-orange-500" size={20} />
            Restaurer les Données
          </h3>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle
                className="text-yellow-600 flex-shrink-0"
                size={20}
              />
              <div>
                <h4 className="font-medium text-yellow-800">Attention</h4>
                <p className="text-sm text-yellow-700">
                  La restauration remplacera toutes les données actuelles. Cette
                  action est irréversible.
                </p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleRestore}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isRestoring}
            className="flex items-center justify-center px-6 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isRestoring ? (
              <RefreshCw className="animate-spin mr-2" size={20} />
            ) : (
              <Upload
                className="mr-2 group-hover:scale-110 transition-transform duration-300"
                size={20}
              />
            )}
            Sélectionner un fichier de sauvegarde
          </button>
        </div>

        {/* Auto-backup Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="mr-2 text-purple-500" size={20} />
            Sauvegarde Automatique
          </h3>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">
                  Sauvegarde automatique hebdomadaire
                </h4>
                <p className="text-sm text-gray-600">
                  Crée automatiquement une sauvegarde chaque semaine
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoBackupEnabled}
                  onChange={(e) => handleAutoBackupToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {lastBackup && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <div>
                    <h5 className="font-medium text-gray-900">
                      Dernière sauvegarde automatique
                    </h5>
                    <p className="text-sm text-gray-600">
                      {formatDate(lastBackup.timestamp)} -{" "}
                      {lastBackup.metadata.totalRecords} enregistrements
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupManager;
