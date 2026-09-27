import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AnalyticsCard from "./AnalyticsCard";
import { getCategoryTotals } from "../../utils/chartData";
import formatCurrency from "../../utils/formatCurrency";

const CATEGORY_COLORS = [
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

export default function ExpenseCategoryChart({ transactions }) {
  const categoryTotals = getCategoryTotals(transactions);

  const chartData = Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    amount,
  }));

  return (
    <AnalyticsCard
      title="Income vs Expenses"
      description="Overview of your financial activity"
    >
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
                cy="45%"
                outerRadius="65%"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsCard>
  );
}
