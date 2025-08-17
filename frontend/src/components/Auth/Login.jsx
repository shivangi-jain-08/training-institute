import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login, register, loading, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, [isRegistering]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (!result.success) {
      // Error is handled by context
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const result = await register({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
    });

    if (!result.success) {
      // Error is handled by context
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isRegistering) {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-secondary-950 dark:via-secondary-900 dark:to-primary-950/20 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-primary-300 dark:from-primary-800/30 dark:to-primary-700/30 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-300 to-primary-400 dark:from-primary-700/30 dark:to-primary-600/30 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="card p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-large">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
              Institute Manager
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 mt-2">
              {isRegistering
                ? "Create your account"
                : "Welcome back! Please sign in"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300 rounded-xl animate-slide-down">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          {!isRegistering ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field pl-12"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-field pl-12 pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center h-12 text-base"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={registerData.name}
                      onChange={handleInputChange}
                      className="input-field pl-12"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleInputChange}
                      className="input-field pl-12"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={registerData.password}
                      onChange={handleInputChange}
                      className="input-field pl-12"
                      placeholder="Create a password"
                      required
                      minLength="6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleInputChange}
                      className="input-field pl-12"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center h-12 text-base"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          {/* Toggle Form */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
