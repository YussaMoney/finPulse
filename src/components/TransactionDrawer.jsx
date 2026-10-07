import { useState, useEffect } from "react";
import { Plus, X, ArrowUpRight, ArrowDownRight, Tag, AlignLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import categories from "../data/categories";

export default function TransactionDrawer({
  isOpen,
  setIsOpen,
  description,
  setDescription,
  amount,
  setAmount,
  category,
  setCategory,
  addTransaction,
  editingTransaction,
  updateTransaction,
  resetForm,
  currencySymbol = "₦",
}) {
  const [txType, setTxType] = useState("expense");

  useEffect(() => {
    if (editingTransaction) {
      if (Number(editingTransaction.amount) > 0) {
        setTxType("income");
        setAmount(Math.abs(editingTransaction.amount).toString());
      } else {
        setTxType("expense");
        setAmount(Math.abs(editingTransaction.amount).toString());
      }
    } else {
      setTxType("expense");
    }
  }, [editingTransaction, setAmount]);

  function handleSubmit(e) {
    e.preventDefault();
    const rawVal = parseFloat(amount);
    if (isNaN(rawVal) || rawVal <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    const finalAmount = txType === "income" ? Math.abs(rawVal) : -Math.abs(rawVal);

    if (editingTransaction) {
      updateTransaction(finalAmount);
    } else {
      addTransaction(finalAmount);
    }
  }

  function handleClose() {
    setIsOpen(false);
    if (editingTransaction) {
      resetForm();
    }
  }

  return (
    <>
      <button
        type="button"
        className="fab-button teal-glow"
        onClick={() => setIsOpen(true)}
        title="Add New Transaction"
        aria-label="Add New Transaction"
      >
        <Plus className="fab-icon" />
        <span className="fab-tooltip">Add Entry</span>
      </button>

      {!isOpen && (
        <button
          type="button"
          className="drawer-peek-tab"
          onClick={() => setIsOpen(true)}
          title="Quick Entry"
          aria-label="Quick Entry Tab"
        >
          <div className="peek-accent" />
          <Plus size={16} />
          <span className="peek-text">NEW ENTRY</span>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            <motion.aside
              className="drawer-container"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
            >
              <div className="drawer-header">
                <div className="header-title-group">
                  <div className="header-icon-box teal-glow">
                    <Sparkles size={18} className="teal-text" />
                  </div>
                  <div>
                    <h3 className="drawer-title">
                      {editingTransaction ? "Edit Transaction" : "New Transaction"}
                    </h3>
                    <p className="drawer-subtitle">
                      {editingTransaction
                        ? "Update details of your financial entry"
                        : "Log an income or expense transaction"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="drawer-close-btn"
                  onClick={handleClose}
                  aria-label="Close Drawer"
                >
                  <X size={18} />
                </button>
              </div>

              <form className="drawer-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="input-label">Transaction Type</label>
                  <div className="type-switcher">
                    <button
                      type="button"
                      className={`type-btn income-tab ${txType === "income" ? "active-income" : ""}`}
                      onClick={() => setTxType("income")}
                    >
                      <ArrowUpRight size={16} />
                      <span>Income (In)</span>
                    </button>
                    <button
                      type="button"
                      className={`type-btn expense-tab ${txType === "expense" ? "active-expense" : ""}`}
                      onClick={() => setTxType("expense")}
                    >
                      <ArrowDownRight size={16} />
                      <span>Expense (Out)</span>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label" htmlFor="tx-amount">
                    Amount ({currencySymbol})
                  </label>
                  <div className="input-field-wrapper">
                    <span className="field-prefix">{currencySymbol}</span>
                    <input
                      id="tx-amount"
                      type="number"
                      step="any"
                      min="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="styled-input amount-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label" htmlFor="tx-desc">
                    Description
                  </label>
                  <div className="input-field-wrapper">
                    <AlignLeft className="field-icon" />
                    <input
                      id="tx-desc"
                      type="text"
                      placeholder="e.g., Grocery Shopping, Freelance Pay"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      maxLength={120}
                      className="styled-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label" htmlFor="tx-category">
                    Category
                  </label>
                  <div className="input-field-wrapper">
                    <Tag className="field-icon" />
                    <select
                      id="tx-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="styled-input select-input"
                    >
                      {categories.map((c) => (
                        <option key={c.title} value={c.title}>
                          {c.icon} {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="drawer-footer">
                  <motion.button
                    type="submit"
                    className={`submit-gradient-btn ${txType === "income" ? "teal-submit" : "ruby-submit"}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{editingTransaction ? "Save Changes" : txType === "income" ? "Add Income Entry" : "Add Expense Entry"}</span>
                  </motion.button>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
