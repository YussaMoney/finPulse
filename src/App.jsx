import { useCallback, useEffect, useState } from "react";
import "../src/style.css";
import toast from "react-hot-toast";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import * as authApi from "./api/auth";
import { getToken, setToken, onUnauthorized } from "./api/client";

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("finpulse_theme") || "dark");
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(() => Boolean(getToken()));
  const [authNotice, setAuthNotice] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("finpulse_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      toast.success(`Switched to ${nextTheme === "dark" ? "Dark Mode 🌙" : "Light Mode ☀️"}`, {
        id: "theme-toast",
      });
      return nextTheme;
    });
  }

  const signOut = useCallback((notice = "") => {
    setToken(null);
    setUser(null);
    setAuthNotice(notice);
  }, []);

  useEffect(() => {
    onUnauthorized((message) => signOut(message || "Please sign in again."));
    return () => onUnauthorized(null);
  }, [signOut]);

  useEffect(() => {
    if (!getToken()) return;

    authApi
      .getCurrentUser()
      .then(({ user }) => setUser(user))
      .catch((err) => {
        // A 401 is handled by onUnauthorized; anything else (offline, server down)
        // keeps the token so the user isn't logged out by a temporary outage.
        setAuthNotice(err.message);
      })
      .finally(() => setIsCheckingSession(false));
  }, []);

  function handleAuthenticated({ token, user }) {
    setToken(token);
    setUser(user);
    setAuthNotice("");
    toast.success(`Welcome, ${user.name.split(" ")[0]}!`, { id: "auth-toast" });
  }

  function handleLogout() {
    signOut();
    toast.success("You've been signed out.", { id: "auth-toast" });
  }

  if (isCheckingSession) {
    return (
      <div className="auth-shell" data-theme={theme}>
        <p className="sub-heading">Loading your dashboard…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthScreen
        onAuthenticated={handleAuthenticated}
        theme={theme}
        toggleTheme={toggleTheme}
        notice={authNotice}
      />
    );
  }

  return (
    <Dashboard
      key={user.id}
      user={user}
      onUserChange={setUser}
      onLogout={handleLogout}
      theme={theme}
      toggleTheme={toggleTheme}
    />
  );
}

export default App;
