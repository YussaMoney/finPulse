import StatCard from "./StatCard";
// import { ReceiptText, TrendingDown, TrendingUp, Wallet } from "lucide-react";

export default function DashboardStat({
  income,
  expense,
  balance,
  totalTransaction,
}) {
  return (
    <section className="dashboard-stat">
      <StatCard title="Income" value={income} icon="📈" />

      <StatCard title="Expense" value={expense} icon="📉" />

      <StatCard title="Balance" value={balance} icon="💰" />

      <StatCard title="Transactions" value={totalTransaction} icon="📄" />
    </section>
  );
}
