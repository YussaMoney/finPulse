import { motion, AnimatePresence } from "framer-motion";
import { listVariants, transactionVariants } from "../../data/variantsMotion";
import TransactionItem from "./TransactionItem";
export default function TransactionList({
  transactions,
  deleteTransaction,
  handleEdit,
  totalTransactions,
}) {
  return (
    <section className="box transaction-history">
      <div className="history-header">
        <div>
          <h2 className="history-title">Transaction History</h2>
          <p className="history-subtitle">
            Track every income and expense in one place.
          </p>
        </div>

        <div className="history-count">
          <span>{transactions.length}</span>
          <small>
            {transactions.length === 1 ? "Transaction" : "Transactions"}
          </small>
        </div>
      </div>
      <motion.ul
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="transaction-list"
      >
        {totalTransactions === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>

            <h3>No transactions yet</h3>

            <p>Start by adding your first transaction.</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>

            <h3>No transactions found</h3>

            <p>Try another search term or category.</p>
          </div>
        ) : (
          <AnimatePresence>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                handleEdit={handleEdit}
                deleteTransaction={deleteTransaction}
                transactionVariants={transactionVariants}
              />
            ))}
          </AnimatePresence>
        )}
      </motion.ul>
    </section>
  );
}
