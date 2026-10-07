import { RefreshCw, Trash2, Moon, Sun, DollarSign } from "lucide-react";

export default function SettingsView({
  currencySymbol,
  changeCurrency,
  isConverting = false,
  loadSampleData,
  clearAllTransactions,
  theme = "dark",
  toggleTheme,
}) {
  const currencies = [
    { symbol: "₦", name: "Nigerian Naira (₦)" },
    { symbol: "$", name: "US Dollar ($)" },
    { symbol: "€", name: "Euro (€)" },
    { symbol: "£", name: "British Pound (£)" },
    { symbol: "₹", name: "Indian Rupee (₹)" },
  ];

  return (
    <div className="settings-view">
      <div className="view-header">
        <div>
          <h2 className="view-title">Dashboard Settings</h2>
          <p className="view-subtitle">
            Manage workspace preferences, currency conversion, and data management
          </p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="glass-card settings-card">
          <div className="card-header">
            <div className="setting-icon-wrapper teal-glow">
              <DollarSign size={18} className="teal-text" />
            </div>
            <div>
              <h3 className="card-title">Currency Symbol & Real Conversion</h3>
              <p className="card-subtitle">
                Switch currency and convert all entry values at real-life rates
              </p>
            </div>
          </div>
          <div className="setting-body">
            <div className="currency-selector">
              {currencies.map((c) => (
                <button
                  key={c.symbol}
                  type="button"
                  className={`currency-pill ${
                    currencySymbol === c.symbol ? "active-pill" : ""
                  }`}
                  onClick={() => changeCurrency(c.symbol)}
                  disabled={isConverting}
                  aria-busy={isConverting}
                >
                  <span className="symbol-badge">{c.symbol}</span>
                  <span className="symbol-name">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card settings-card">
          <div className="card-header">
            <div className="setting-icon-wrapper sapphire-glow">
              {theme === "dark" ? (
                <Moon size={18} className="sapphire-text" />
              ) : (
                <Sun size={18} className="teal-text" />
              )}
            </div>
            <div>
              <h3 className="card-title">Appearance Theme</h3>
              <p className="card-subtitle">
                Toggle between sleek Dark and crisp Light mode
              </p>
            </div>
          </div>
          <div className="setting-body">
            <div className="theme-toggle-pills">
              <button
                type="button"
                className={`theme-pill ${
                  theme === "dark" ? "active-theme" : ""
                }`}
                onClick={() => {
                  if (theme !== "dark") toggleTheme();
                }}
              >
                <Moon size={16} />
                <span>Dark Mode</span>
              </button>
              <button
                type="button"
                className={`theme-pill ${
                  theme === "light" ? "active-theme" : ""
                }`}
                onClick={() => {
                  if (theme !== "light") toggleTheme();
                }}
              >
                <Sun size={16} />
                <span>Light Mode</span>
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card settings-card">
          <div className="card-header">
            <div className="setting-icon-wrapper ruby-glow">
              <RefreshCw size={18} className="ruby-text" />
            </div>
            <div>
              <h3 className="card-title">Data Management</h3>
              <p className="card-subtitle">
                Reset or load pre-populated test data
              </p>
            </div>
          </div>
          <div className="setting-body button-group">
            <button
              type="button"
              className="settings-action-btn load-btn teal-glow"
              onClick={loadSampleData}
            >
              <RefreshCw size={16} />
              <span>Reset & Load Demo Data</span>
            </button>

            <button
              type="button"
              className="settings-action-btn clear-btn ruby-glow"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to clear ALL transactions?"
                  )
                ) {
                  clearAllTransactions();
                }
              }}
            >
              <Trash2 size={16} />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
