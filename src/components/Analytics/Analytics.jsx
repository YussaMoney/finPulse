import IncomeExpenseChart from "./IncomeExpenseChart";
import ExpenseCategoryChart from "./ExpenseCategoryChart";

export default function Analytics({ transactions }) {
  return (
    <section className="analytics-section">
      <IncomeExpenseChart transactions={transactions} />

      <ExpenseCategoryChart transactions={transactions} />
    </section>
  );
}
