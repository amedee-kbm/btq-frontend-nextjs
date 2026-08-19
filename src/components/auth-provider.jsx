"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const { createContext, useContext, useState, useEffect } = require("react");
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  loginRequiredRedirect: () => {},
});

const LOGIN_REDIRECT_URL = "/";
const LOGOUT_REDIRECT_URL = "/";
const LOGIN_REQUIRED_URL = "/login";
const LOCAL_STORAGE_KEY = "is-logged-in";
const LOCAL_USER_KEY = "user";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedAuthStatus = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedAuthStatus) {
      const storedAuthStatusInt = parseInt(storedAuthStatus, 10);
      setIsAuthenticated(storedAuthStatusInt === 1);
    }

    const storedUser = localStorage.getItem(LOCAL_USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(LOCAL_USER_KEY);
      }
    }
  }, []);

  const login = async () => {
    setIsAuthenticated(true);
    localStorage.setItem(LOCAL_STORAGE_KEY, "1");

    try {
      const response = await fetch("/api/me", { credentials: "include" });

      if (!response.ok) {
        localStorage.removeItem(LOCAL_USER_KEY);
        setUser(null);
        return;
      }

      const fetchedUser = await response.json();
      setUser(fetchedUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(fetchedUser));
    } catch {
      localStorage.removeItem(LOCAL_USER_KEY);
      setUser(null);
    }

    const nextUrl = searchParams.get("next");
    const invalidNextUrl = ["/login", "/logout"];
    const nextUrlValid =
      nextUrl && nextUrl.startsWith("/") && !invalidNextUrl.includes(nextUrl);

    if (nextUrlValid) {
      router.replace(nextUrl);
      return;
    }

    router.replace(LOGIN_REDIRECT_URL);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.setItem(LOCAL_STORAGE_KEY, "0");
    localStorage.removeItem(LOCAL_USER_KEY);
    router.replace(LOGOUT_REDIRECT_URL);
  };

  const loginRequiredRedirect = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.setItem(LOCAL_STORAGE_KEY, "0");
    localStorage.removeItem(LOCAL_USER_KEY);

    let loginWithNextUrl = `${LOGIN_REQUIRED_URL}?next=${pathname}`;
    if (LOGIN_REQUIRED_URL === pathname) {
      loginWithNextUrl = `${LOGIN_REQUIRED_URL}`;
    }

    router.replace(loginWithNextUrl);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loginRequiredRedirect, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
