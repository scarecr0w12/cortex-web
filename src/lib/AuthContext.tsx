"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const stored = getStoredUser();
      if (stored) {
        setUser(stored);
        setLoading(false);
      } else {
        fetch("/api/auth/me", {
          headers: { authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then((d) => {
            if (!d.error && d.user) {
              setUser(d.user);
              localStorage.setItem("user", JSON.stringify(d.user));
            } else {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setUser(null);
            }
          })
          .catch(() => { setUser(null); })
          .finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, [pathname]);

  const login = useCallback((token: string, userData: AuthUser) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
