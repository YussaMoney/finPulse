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
import { convertAmount } from "./utils/convertCurrency";
import * as transactionsApi from "./api/transactions";
import toast from "react-hot-toast";
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
      toast.success(
        `Switched to ${nextTheme === "dark" ? "Dark Mode 🌙" : "Light Mode ☀️"}`,
        { id: "theme-toast" }
      );
      return nextTheme;
    });
  }

  async function changeCurrency(newSymbol) {
    if (newSymbol === currencySymbol) return;

    try {
      const updated = await Promise.all(
        transactions.map((t) =>
          transactionsApi.updateTransaction(t._id, {
            description: t.description,
            category: t.category,
            amount: convertAmount(t.amount, currencySymbol, newSymbol),
          })
        )
      );

      setTransactions(updated);
      setCurrencySymbol(newSymbol);
      toast.success(`Currency converted to ${newSymbol}`, {
        id: "currency-toast",
      });
    } catch (err) {
      toast.error(err.message || "Failed to convert currency.", {
        id: "currency-error",
      });
    }
  }

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    transactionsApi
      .getTransactions()
      .then(setTransactions)
      .catch((err) => {
        toast.error(err.message || "Failed to load transactions", {
          id: "load-error",
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("finpulse_currency", currencySymbol);
  }, [currencySymbol]);

  function resetForm() {
    setDescription("");
    setAmount("");
    setCategory("Other");
    setEditingTransaction(null);
  }

  async function addTransaction(signedAmount) {
    if (!description.trim()) {
      toast.error("Please enter a description.", { id: "tx-error" });
      return;
    }

    try {
      const newTransaction = await transactionsApi.createTransaction({
        description: formatDescription(description),
        amount: signedAmount,
        category,
      });

      setTransactions((prev) => [newTransaction, ...prev]);
      toast.success("Transaction added successfully!", { id: "tx-success" });
      resetForm();
      setIsDrawerOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to add transaction.", { id: "tx-error" });
    }
  }

  async function updateTransaction(signedAmount) {
    if (!editingTransaction) return;

    try {
      const updated = await transactionsApi.updateTransaction(editingTransaction._id, {
        description: formatDescription(description),
        amount: signedAmount,
        category,
      });

      setTransactions((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
      toast.success("Transaction updated successfully!", { id: "tx-success" });
      resetForm();
      setIsDrawerOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to update transaction.", { id: "tx-error" });
    }
  }

  async function deleteTransaction(id) {
    try {
      await transactionsApi.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      toast.success("Transaction deleted successfully!", { id: "tx-success" });
    } catch (err) {
      toast.error(err.message || "Failed to delete transaction.", { id: "tx-error" });
    }
  }

  function handleEdit(transaction) {
    setDescription(transaction.description);
    setAmount(Math.abs(transaction.amount).toString());
    setCategory(transaction.category || "Other");
    setEditingTransaction(transaction);
    setIsDrawerOpen(true);
  }

  async function loadSampleData() {
    try {
      await Promise.all(transactions.map((t) => transactionsApi.deleteTransaction(t._id)));
      const created = await Promise.all(
        sampleTransactions.map((t) =>
          transactionsApi.createTransaction({
            description: t.description,
            amount: t.amount,
            category: t.category,
          })
        )
      );
      setTransactions(created);
      toast.success("Loaded sample transactions!", { id: "data-toast" });
    } catch (err) {
      toast.error(err.message || "Failed to load sample data.", { id: "data-error" });
    }
  }

  async function clearAllTransactions() {
    try {
      await Promise.all(transactions.map((t) => transactionsApi.deleteTransaction(t._id)));
      setTransactions([]);
      toast.success("All transactions cleared.", { id: "data-toast" });
    } catch (err) {
      toast.error(err.message || "Failed to clear transactions.", { id: "data-error" });
    }
  }

  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  }, [transactions]);

  return (
    <div className="app-shell" data-theme={theme}>
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
            <p className="sub-heading">
              Real-time wealth tracking & expense control
            </p>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
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
          {isLoading ? (
            <p className="sub-heading">Loading transactions…</p>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <>
                  <TopRowCards
                    transactions={transactions}
                    currencySymbol={currencySymbol}
                  />

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
                <ReportsView
                  transactions={transactions}
                  currencySymbol={currencySymbol}
                />
              )}

              {activeTab === "settings" && (
                <SettingsView
                  currencySymbol={currencySymbol}
                  changeCurrency={changeCurrency}
                  loadSampleData={loadSampleData}
                  clearAllTransactions={clearAllTransactions}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              )}
            </>
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
