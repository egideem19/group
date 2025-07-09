import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  X,
  ChevronDown,
} from "lucide-react";

interface SearchFilters {
  searchTerm: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  domain?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  showDomainFilter?: boolean;
  domains?: string[];
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onFiltersChange,
  showDomainFilter = false,
  domains = [],
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    status: "all",
    dateRange: {
      start: "",
      end: "",
    },
    domain: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (type: "start" | "end", value: string) => {
    const newDateRange = { ...filters.dateRange, [type]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      searchTerm: "",
      status: "all",
      dateRange: { start: "", end: "" },
      domain: "all",
      sortBy: "date",
      sortOrder: "desc",
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.status !== "all" ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    (showDomainFilter && filters.domain !== "all");

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
      {/* Recherche principale */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            placeholder="Rechercher par nom, email, sujet ou contenu..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-lg"
          />
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-3 border rounded-lg flex items-center space-x-2 transition-all duration-300 ${
            showAdvanced
              ? "bg-blue-500 text-white border-blue-500"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Filter size={20} />
          <span>Filtres</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-300 flex items-center space-x-2"
          >
            <X size={16} />
            <span>Effacer</span>
          </button>
        )}
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4 space-y-4 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processed">Traités/Acceptés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>

            {/* Domaine (pour candidatures) */}
            {showDomainFilter && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domaine
                </label>
                <select
                  value={filters.domain}
                  onChange={(e) => handleFilterChange("domain", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                >
                  <option value="all">Tous les domaines</option>
                  {domains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Tri */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trier par
              </label>
              <div className="flex space-x-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                >
                  <option value="date">Date</option>
                  <option value="name">Nom</option>
                  <option value="status">Statut</option>
                </select>
                <button
                  onClick={() =>
                    handleFilterChange(
                      "sortOrder",
                      filters.sortOrder === "asc" ? "desc" : "asc",
                    )
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                  title={
                    filters.sortOrder === "asc" ? "Croissant" : "Décroissant"
                  }
                >
                  {filters.sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          {/* Plage de dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    handleDateRangeChange("start", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <span className="text-gray-500">à</span>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateRangeChange("end", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Résumé des filtres actifs */}
          {hasActiveFilters && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-2">
                Filtres actifs :
              </h4>
              <div className="flex flex-wrap gap-2">
                {filters.searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Recherche: "{filters.searchTerm}"
                  </span>
                )}
                {filters.status !== "all" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Statut: {filters.status}
                  </span>
                )}
                {showDomainFilter && filters.domain !== "all" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Domaine: {filters.domain}
                  </span>
                )}
                {(filters.dateRange.start || filters.dateRange.end) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Période: {filters.dateRange.start || "..."} -{" "}
                    {filters.dateRange.end || "..."}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
