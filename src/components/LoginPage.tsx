import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  Shield,
  Sparkles,
  LogIn,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { login, changePassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(username, password);

    if (result.success) {
      if (result.requiresPasswordChange) {
        setRequiresPasswordChange(true);
      } else {
        onLoginSuccess();
      }
    } else {
      setError(result.error || "Erreur de connexion");
    }

    setIsLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    const result = await changePassword(newPassword);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || "Erreur lors du changement de mot de passe");
    }

    setIsLoading(false);
  };

  if (requiresPasswordChange) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-yellow-400/5"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Shield className="text-black" size={32} />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">
                Changement de Mot de Passe
              </h1>
              <p className="text-gray-300">
                Pour votre sécurité, veuillez définir un nouveau mot de passe
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 text-red-200 text-center animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer le mot de passe"
                  required
                  className="w-full pl-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                ) : (
                  <>
                    Confirmer
                    <ArrowRight
                      className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      size={20}
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Le mot de passe doit contenir au moins 6 caractères
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-yellow-400/5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl animate-ping"></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="bg-yellow-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <LogIn className="text-black" size={40} />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 flex items-center justify-center">
              <Sparkles className="text-yellow-400 mr-2" size={32} />
              Connexion Admin
            </h1>
            <p className="text-gray-300 text-lg">
              Accédez au panneau d'administration
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 text-red-200 text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-300"
                size={20}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur"
                required
                className="w-full pl-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-300"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group shadow-2xl hover:shadow-yellow-400/25"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
              ) : (
                <>
                  Se Connecter
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    size={20}
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
              <p className="text-yellow-300 text-sm font-semibold mb-2">
                Identifiants par défaut :
              </p>
              <div className="text-gray-300 text-sm space-y-1">
                <p>
                  Utilisateur :{" "}
                  <span className="text-yellow-400 font-mono">admin</span>
                </p>
                <p>
                  Mot de passe :{" "}
                  <span className="text-yellow-400 font-mono">Admin123</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            ABA Creative Group © 2025 - Panneau d'Administration
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
