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
          <p>
            📄 <br />
            <br />
            No transactions yet!.
            <br />
            <br /> Start by adding your first transaction.
          </p>
        ) : transactions.length === 0 ? (
          <p>
            🔍 <br />
            <br />
            No transactions found.
            <br />
            <br />
            Try another search term.
          </p>
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
