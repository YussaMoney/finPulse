import { useEffect, useState, useMemo } from "react";
import "../src/style.css";
import sampleTransactions from "./data/sampleTransactions";
import Sidebar from "./components/Sidebar";
import TopRowCards from "./components/TopRowCards";
import ExpenseCategoryDonut from "./components/ExpenseCategoryDonut";
import RecentTransactionsTable from "./components/RecentTransactionsTable";
import TransactionDrawer from "./components/TransactionDrawer";
import ReportsView from "./components/ReportsView";
import SettingsView from "./components/SettingsView";
import formatDescription from "./utils/formatDescription";
import formatDate from "./utils/formatDate";
import createTransaction from "./utils/createTransaction";
import toast, { Toaster } from "react-hot-toast";
import { Sun, Moon } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [currencySymbol, setCurrencySymbol] = useState(() => {
    return localStorage.getItem("finpulse_currency") || "₦";
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("finpulse_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("finpulse_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      toast.success(`Switched to ${nextTheme === "dark" ? "Dark Mode 🌙" : "Light Mode ☀️"}`);
      return nextTheme;
    });
  }

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
    return sampleTransactions;
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("finpulse_currency", currencySymbol);
  }, [currencySymbol]);

  function resetForm() {
    setDescription("");
    setAmount("");
    setCategory("Other");
    setEditingTransaction(null);
  }

  function addTransaction(signedAmount) {
    if (!description.trim()) {
      toast.error("Please enter a description.");
      return;
    }

    const date = formatDate();
    const newTransaction = createTransaction({
      date,
      description: formatDescription(description),
      amount: signedAmount,
      category,
    });

    setTransactions((prev) => [newTransaction, ...prev]);
    toast.success("Transaction added successfully!");
    resetForm();
    setIsDrawerOpen(false);
  }

  function updateTransaction(signedAmount) {
    if (!editingTransaction) return;

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === editingTransaction.id) {
          return {
            ...t,
            description: formatDescription(description),
            amount: signedAmount,
            category,
          };
        }
        return t;
      })
    );
    toast.success("Transaction updated successfully!");
    resetForm();
    setIsDrawerOpen(false);
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success("Transaction deleted successfully!");
  }

  function handleEdit(transaction) {
    setDescription(transaction.description);
    setAmount(Math.abs(transaction.amount).toString());
    setCategory(transaction.category || "Other");
    setEditingTransaction(transaction);
    setIsDrawerOpen(true);
  }

  function loadSampleData() {
    setTransactions(sampleTransactions);
  }

  function clearAllTransactions() {
    setTransactions([]);
  }

  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  }, [transactions]);

  return (
    <div className="app-shell" data-theme={theme}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === "dark" ? "#1e293b" : "#ffffff",
            color: theme === "dark" ? "#f8fafc" : "#0f172a",
            border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            borderRadius: "12px",
          },
        }}
      />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalBalance={totalBalance}
        currencySymbol={currencySymbol}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className="main-content-wrapper">
        <header className="dashboard-top-header">
          <div className="header-greeting">
            <h1 className="main-heading">Financial Overview</h1>
            <p className="sub-heading">Real-time wealth tracking & expense control</p>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Light and Dark Mode"
          >
            {theme === "dark" ? (
              <>
                <Sun className="theme-btn-icon sun-icon" />
                <span className="theme-btn-text">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="theme-btn-icon moon-icon" />
                <span className="theme-btn-text">Dark Mode</span>
              </>
            )}
          </button>
        </header>

        <main className="dashboard-body">
          {activeTab === "dashboard" && (
            <>
              <TopRowCards transactions={transactions} currencySymbol={currencySymbol} />

              <section className="main-split-area">
                <ExpenseCategoryDonut
                  transactions={transactions}
                  currencySymbol={currencySymbol}
                />
                <RecentTransactionsTable
                  transactions={transactions}
                  deleteTransaction={deleteTransaction}
                  handleEdit={handleEdit}
                  currencySymbol={currencySymbol}
                />
              </section>
            </>
          )}

          {activeTab === "reports" && (
            <ReportsView transactions={transactions} currencySymbol={currencySymbol} />
          )}

          {activeTab === "settings" && (
            <SettingsView
              currencySymbol={currencySymbol}
              setCurrencySymbol={setCurrencySymbol}
              loadSampleData={loadSampleData}
              clearAllTransactions={clearAllTransactions}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          )}
        </main>
      </div>

      <TransactionDrawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        description={description}
        setDescription={setDescription}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        addTransaction={addTransaction}
        editingTransaction={editingTransaction}
        updateTransaction={updateTransaction}
        resetForm={resetForm}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}

export default App;
