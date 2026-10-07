import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Sun, Moon, LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import TopRowCards from "./TopRowCards";
import ExpenseCategoryDonut from "./ExpenseCategoryDonut";
import RecentTransactionsTable from "./RecentTransactionsTable";
import TransactionDrawer from "./TransactionDrawer";
import ReportsView from "./ReportsView";
import SettingsView from "./SettingsView";
import formatDescription from "../utils/formatDescription";
import * as transactionsApi from "../api/transactions";

export default function Dashboard({ user, onUserChange, onLogout, theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const currencySymbol = user.currency;
  const firstName = user.name.split(" ")[0];

  const fetchTransactions = useCallback(() => {
    return transactionsApi
      .getTransactions()
      .then((data) => {
        setTransactions(data);
        setLoadError("");
      })
      .catch((err) => setLoadError(err.message || "Failed to load transactions."))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  function retryLoad() {
    setIsLoading(true);
    fetchTransactions();
  }

  async function changeCurrency(newSymbol) {
    if (newSymbol === currencySymbol) return;

    try {
      const result = await transactionsApi.convertCurrency(newSymbol);
      setTransactions(result.transactions);
      onUserChange(result.user);
      toast.success(`Currency converted to ${newSymbol}`, { id: "currency-toast" });
    } catch (err) {
      toast.error(err.message || "Failed to convert currency.", { id: "currency-error" });
    }
  }

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

      setTransactions((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
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
      setTransactions(await transactionsApi.loadSampleTransactions());
      toast.success("Loaded sample transactions!", { id: "data-toast" });
    } catch (err) {
      toast.error(err.message || "Failed to load sample data.", { id: "data-error" });
    }
  }

  async function clearAllTransactions() {
    try {
      await transactionsApi.clearTransactions();
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
            <p className="sub-heading">Welcome back, {firstName}. Here's your money at a glance.</p>
          </div>

          <div className="header-actions">
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

            <button
              type="button"
              className="theme-toggle-btn logout-btn"
              onClick={onLogout}
              title={`Sign out (${user.email})`}
            >
              <LogOut className="theme-btn-icon" />
              <span className="theme-btn-text">Sign out</span>
            </button>
          </div>
        </header>

        <main className="dashboard-body">
          {isLoading ? (
            <p className="sub-heading">Loading transactions…</p>
          ) : loadError ? (
            <div className="glass-card load-error-card">
              <p className="load-error-title">We couldn't load your transactions.</p>
              <p className="sub-heading">{loadError}</p>
              <button type="button" className="theme-toggle-btn" onClick={retryLoad}>
                Try again
              </button>
            </div>
          ) : (
            <>
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
