import { LayoutDashboard, BarChart3, Settings, Wallet, Sparkles, Sun, Moon } from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  totalBalance = 0,
  currencySymbol = "₦",
  theme = "dark",
  toggleTheme,
}) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Wallet className="logo-icon" />
          <Sparkles className="sparkle-icon" />
        </div>
        <div className="brand-text">
          <span className="brand-title">FINPULSE</span>
          <span className="brand-subtitle">PORTFOLIO</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              aria-label={item.label}
            >
              <div className="nav-icon-container">
                <Icon className="nav-icon" />
              </div>
              <span className="nav-label">{item.label}</span>
              {isActive && <div className="active-glow-indicator" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status-card">
          <div className="status-header">
            <span className="status-dot green" />
            <span className="status-title">Live Vault</span>
          </div>
          <div className="status-balance">
            {currencySymbol}{Math.abs(totalBalance).toLocaleString()}
          </div>
          
          <button
            type="button"
            className="sidebar-theme-toggle"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            <span>{theme === "dark" ? "Light Theme" : "Dark Theme"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
