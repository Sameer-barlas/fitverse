import { createContext, useState, useEffect, useCallback } from 'react';
import {
  fetchCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
} from '../api/authApi.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await fetchCurrentUser();
      setUser(data.user);
      setProfile(data.profile || null);
      return data;
    } catch {
      setUser(null);
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchCurrentUser()
      .then((data) => {
        if (mounted) {
          setUser(data.user);
          setProfile(data.profile || null);
        }
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (credentials) => {
    await loginUser(credentials);
    return refreshUser();
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    setUser(data.user);
    setProfile(null);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        setProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
