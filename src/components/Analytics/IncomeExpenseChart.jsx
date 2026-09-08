import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import formatCurrency from "../../utils/formatCurrency";
import { getIncomeExpenseTotals } from "../../utils/chartData";

export default function IncomeExpenseChart({ transactions }) {
  const { income, expenses } = getIncomeExpenseTotals(transactions);

  const chartData = [
    {
      name: "Income",
      amount: income,
    },
    {
      name: "Expenses",
      amount: expenses,
    },
  ];

  return (
    <section className="analytics">
      <div className="analytics-header">
        <div>
          <h2>Income vs Expenses</h2>
          <p>Overview of your financial activity</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="analytics-empty">
          No transactions yet. Add a transaction to see your income and
          expenses.
        </p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={formatCurrency}
                width={90}
              />

              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
                }}
              />

              <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={80}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      entry.name === "Income" ? "var(--green)" : "var(--red)"
                    }
                  />
                ))}

                <LabelList
                  dataKey="amount"
                  position="top"
                  formatter={(value) =>
                    value === 0 ? "" : formatCurrency(value)
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
