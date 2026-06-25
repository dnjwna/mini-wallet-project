import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/register', payload);
      localStorage.setItem('auth_token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registrasi gagal. Coba lagi.';
      const fieldErrors = err.response?.data?.errors || null;
      setError(message);
      return { success: false, fieldErrors };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (loginIdentifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/login', { login: loginIdentifier, password });
      localStorage.setItem('auth_token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Coba lagi.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch {
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    error,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
