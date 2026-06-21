import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginUser, registerUser } from '../services/api/auth.js';
import { TOKEN_KEY } from '../constants/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchCurrentUser(token);
        setUser(response.data.user);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [token]);

  async function login(email, password) {
    setError(null);
    const response = await loginUser({ email, password });
    const nextToken = response.data.token;

    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(response.data.user);
    return response.data.user;
  }

  async function register(name, email, password) {
    setError(null);
    const response = await registerUser({ name, email, password });
    const nextToken = response.data.token;

    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(response.data.user);
    return response.data.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setError(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      setError,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user && token),
    }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
