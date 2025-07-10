import React, { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import { testSupabaseConnection } from '../utils/supabaseStorage';

const SupabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await testSupabaseConnection();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isConfigured = supabaseUrl && supabaseKey;

  if (!isConfigured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="text-yellow-600 mr-3" size={20} />
          <div>
            <h3 className="font-semibold text-yellow-800">Supabase non configuré</h3>
            <p className="text-sm text-yellow-700">
              Utilisation du stockage local. Configurez Supabase pour la production.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Database className="text-gray-600 mr-3 animate-pulse" size={20} />
          <div>
            <h3 className="font-semibold text-gray-800">Vérification de la connexion...</h3>
            <p className="text-sm text-gray-600">Test de la connexion Supabase en cours</p>
          </div>
        </div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="text-green-600 mr-3" size={20} />
            <div>
              <h3 className="font-semibold text-green-800">Supabase connecté</h3>
              <p className="text-sm text-green-700">
                Base de données en ligne et opérationnelle
              </p>
            </div>
          </div>
          <Wifi className="text-green-600" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="text-red-600 mr-3" size={20} />
          <div>
            <h3 className="font-semibold text-red-800">Connexion Supabase échouée</h3>
            <p className="text-sm text-red-700">
              Utilisation du stockage local en secours
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <WifiOff className="text-red-600" size={24} />
          <button
            onClick={checkConnection}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupabaseStatus;