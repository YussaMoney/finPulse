import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, Filter, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import categories from "../data/categories";

export default function RecentTransactionsTable({
  transactions = [],
  deleteTransaction,
  handleEdit,
  currencySymbol = "₦",
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const categoryMap = useMemo(() => {
    return Object.fromEntries(
      categories.map((c) => [c.title, { icon: c.icon, color: c.color }])
    );
  }, []);

  const processedTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();

    let list = transactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(term);
      const matchesCategory =
        selectedCategory === "All" || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "Newest":
        list.sort((a, b) => new Date(b.date || b.id) - new Date(a.date || a.id));
        break;
      case "Oldest":
        list.sort((a, b) => new Date(a.date || a.id) - new Date(b.date || b.id));
        break;
      case "Highest":
        list.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
        break;
      case "Lowest":
        list.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
        break;
      case "A-Z":
        list.sort((a, b) => a.description.localeCompare(b.description));
        break;
      case "Z-A":
        list.sort((a, b) => b.description.localeCompare(a.description));
        break;
      default:
        break;
    }

    return list;
  }, [transactions, search, selectedCategory, sortBy]);

  const totalPages = Math.ceil(processedTransactions.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return processedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedTransactions, safePage]);

  function handlePrevPage() {
    if (safePage > 1) setCurrentPage((prev) => prev - 1);
  }

  function handleNextPage() {
    if (safePage < totalPages) setCurrentPage((prev) => prev + 1);
  }

  return (
    <div className="glass-card main-area-card transactions-table-card">
      <div className="card-header transactions-header">
        <div>
          <h3 className="card-title">Recent Transactions</h3>
          <p className="card-subtitle">Activity log & financial entries</p>
        </div>

        <div className="table-toolbar">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="select-dropdown">
            <Filter className="dropdown-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.title} value={c.title}>
                  {c.icon} {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="select-dropdown">
            <ArrowUpDown className="dropdown-icon" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Highest">Highest Amount</option>
              <option value="Lowest">Lowest Amount</option>
              <option value="A-Z">A - Z</option>
              <option value="Z-A">Z - A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th className="text-right">Amount</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="table-empty-state">
                    <span className="empty-emoji">🔍</span>
                    <p className="empty-title">No transactions found</p>
                    <span className="empty-desc">
                      Try adjusting your search criteria or add a new transaction.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {paginatedTransactions.map((t) => {
                  const isIncome = Number(t.amount) > 0;
                  const catMeta = categoryMap[t.category] || {
                    icon: "📦",
                    color: "#94a3b8",
                  };

                  return (
                    <motion.tr
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="table-row"
                    >
                      <td className="col-date">{t.date || "Today"}</td>

                      <td className="col-category">
                        <div
                          className="category-tile"
                          style={{
                            backgroundColor: `${catMeta.color}15`,
                            borderColor: `${catMeta.color}30`,
                          }}
                        >
                          <span className="cat-emoji">{catMeta.icon}</span>
                          <span className="cat-name">{t.category || "Other"}</span>
                        </div>
                      </td>

                      <td className="col-description">
                        <span className="desc-text" title={t.description}>
                          {t.description}
                        </span>
                      </td>

                      <td className="col-amount text-right">
                        <span className={`amount-text ${isIncome ? "income-text" : "expense-text"}`}>
                          {isIncome ? "+" : "−"}
                          {currencySymbol}
                          {Math.abs(t.amount).toLocaleString()}
                        </span>
                      </td>

                      <td className="col-actions text-center">
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="action-btn edit-action"
                            title="Edit Transaction"
                            onClick={() => handleEdit(t)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="action-btn delete-action"
                            title="Delete Transaction"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete transaction "${t.description}"?`
                                )
                              ) {
                                deleteTransaction(t.id);
                              }
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <div className="pagination-info">
          Showing{" "}
          <span className="highlight-num">
            {processedTransactions.length === 0
              ? 0
              : (safePage - 1) * ITEMS_PER_PAGE + 1}
          </span>{" "}
          to{" "}
          <span className="highlight-num">
            {Math.min(safePage * ITEMS_PER_PAGE, processedTransactions.length)}
          </span>{" "}
          of <span className="highlight-num">{processedTransactions.length}</span> entries
        </div>

        <div className="pagination-controls">
          <button
            type="button"
            className="pagination-btn"
            disabled={safePage <= 1}
            onClick={handlePrevPage}
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>

          <span className="page-indicator">
            Page {safePage} of {totalPages}
          </span>

          <button
            type="button"
            className="pagination-btn"
            disabled={safePage >= totalPages}
            onClick={handleNextPage}
            aria-label="Next Page"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
