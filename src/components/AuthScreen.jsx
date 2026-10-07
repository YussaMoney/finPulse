import { useState } from "react";
import { Wallet, Sparkles, Mail, Lock, User, Eye, EyeOff, Sun, Moon } from "lucide-react";
import * as authApi from "../api/auth";

const MIN_PASSWORD_LENGTH = 8;

export default function AuthScreen({ onAuthenticated, theme, toggleTheme, notice }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === "register";

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    if (isRegister && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (isRegister && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const result = isRegister
        ? await authApi.register({ name, email, password })
        : await authApi.login({ email, password });
      onAuthenticated(result);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-shell" data-theme={theme}>
      <button
        type="button"
        className="theme-toggle-btn auth-theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle Light and Dark Mode"
      >
        {theme === "dark" ? (
          <Sun className="theme-btn-icon sun-icon" />
        ) : (
          <Moon className="theme-btn-icon moon-icon" />
        )}
      </button>

      <div className="glass-card auth-card">
        <div className="auth-brand">
          <div className="brand-logo">
            <Wallet className="logo-icon" />
            <Sparkles className="sparkle-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">FINPULSE</span>
            <span className="brand-subtitle">PORTFOLIO</span>
          </div>
        </div>

        <h1 className="auth-title">{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="auth-subtitle">
          {isRegister
            ? "Track your income and spending in one private dashboard."
            : "Sign in to see your finance dashboard."}
        </p>

        {notice && !error && <p className="auth-notice">{notice}</p>}

        <div className="type-switcher auth-switcher" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={!isRegister}
            className={`type-btn ${!isRegister ? "active-income" : ""}`}
            onClick={() => switchMode("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegister}
            className={`type-btn ${isRegister ? "active-income" : ""}`}
            onClick={() => switchMode("register")}
          >
            Create account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <div className="form-group">
              <label className="input-label" htmlFor="auth-name">
                Name
              </label>
              <div className="input-field-wrapper">
                <User className="field-icon" />
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Yusuf Azeez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="styled-input"
                  maxLength={60}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="input-label" htmlFor="auth-email">
              Email
            </label>
            <div className="input-field-wrapper">
              <Mail className="field-icon" />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="styled-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="auth-password">
              Password
            </label>
            <div className="input-field-wrapper">
              <Lock className="field-icon" />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder={isRegister ? `At least ${MIN_PASSWORD_LENGTH} characters` : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="styled-input password-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="submit-gradient-btn teal-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isRegister
                ? "Creating account…"
                : "Signing in…"
              : isRegister
                ? "Create account"
                : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
