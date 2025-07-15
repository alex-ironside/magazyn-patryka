import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  loginWithEmail,
  logout,
  onAuthStateChange,
} from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await loginWithEmail(email, password);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Błąd logowania";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      setError(null);
      await logout();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Błąd wylogowania";
      setError(errorMessage);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout: logoutUser,
    isAuthenticated: !!user,
  };
};
