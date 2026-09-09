import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { getCategoryTotals } from "../../utils/chartData";
import formatCurrency from "../../utils/formatCurrency";

export default function ExpenseCategoryChart({ transactions }) {
  const categoryTotals = getCategoryTotals(transactions);

  const chartData = Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    amount,
  }));

  return (
    <section className="analytics">
      <div className="analytics-header">
        <div>
          <h2>Expenses by Category</h2>
          <p>See where your money is going</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <p className="analytics-empty">
          No expenses yet. Add an expense to see your spending breakdown.
        </p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={`hsl(${index * 60}, 70%, 50%)`}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
