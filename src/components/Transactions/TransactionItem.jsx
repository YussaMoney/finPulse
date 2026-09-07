import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import categories from "../../data/categories";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function TransactionItem({
  transaction,
  transactionVariants,
  deleteTransaction,
  handleEdit,
}) {
  const categoryMap = Object.fromEntries(
    categories.map((category) => [category.title, category.icon]),
  );
  return (
    <motion.li
      layout
      variants={transactionVariants}
      whileHover={{
        y: -4,
        transition: { duration: 0.18 },
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0, x: 30 }}
      key={transaction.id}
      className={`transaction-item ${
        transaction.amount > 0 ? "income" : "expense"
      }`}
    >
      <div className="transaction-info">
        <div
          className={`transaction-category ${transaction.amount > 0 ? "trend-up" : "trend-down"}`}
        >
          {categoryMap[transaction.category]}
        </div>
        <div className="transaction-description">
          <h4 className="description-title">{transaction.description}</h4>
          {/* <p className="description-date">
            <i>{transaction.date ? transaction.date : "No Date"}</i>
          </p> */}
          <p className="description-meta">
            {transaction.category} • {transaction.date || "No Date"}
          </p>
        </div>
      </div>

      <div className="transaction-actions">
        <div className="transaction-amount">
          {transaction.amount > 0 ? "+" : "-"}₦
          {Math.abs(transaction.amount).toLocaleString()}
        </div>
        <button
          type="button"
          className="button edit-btn"
          title="Edit Transaction"
          onClick={() => handleEdit(transaction)}
        >
          <FontAwesomeIcon icon={faPen} size="xl" />
        </button>
        <button
          title="Delete Transaction"
          className="button delete-btn"
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to delete this transaction?",
            );
            if (confirmed) deleteTransaction(transaction.id);
          }}
        >
          <FontAwesomeIcon icon={faTrash} size="xl" />
        </button>
      </div>
    </motion.li>
  );
}
