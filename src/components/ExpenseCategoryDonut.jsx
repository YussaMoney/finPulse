import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import categories from "../data/categories";

export default function ExpenseCategoryDonut({ transactions = [], currencySymbol = "₦" }) {
  const { chartData, totalExpense } = useMemo(() => {
    const categoryTotals = {};
    let totalExp = 0;

    transactions.forEach((t) => {
      const amt = Number(t.amount);
      if (amt < 0) {
        const val = Math.abs(amt);
        const cat = t.category || "Other";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + val;
        totalExp += val;
      }
    });

    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.title, { icon: c.icon, color: c.color }])
    );

    const data = Object.entries(categoryTotals)
      .map(([name, amount]) => {
        const meta = categoryMap[name] || { icon: "📦", color: "#94a3b8" };
        const percentage = totalExp > 0 ? (amount / totalExp) * 100 : 0;
        return {
          name,
          amount,
          percentage,
          icon: meta.icon,
          color: meta.color,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return { chartData: data, totalExpense: totalExp };
  }, [transactions]);

  return (
    <div className="glass-card main-area-card donut-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Expense by Category</h3>
          <p className="card-subtitle">Distribution of total spending</p>
        </div>
        <div className="header-badge ruby-glow">
          {chartData.length} {chartData.length === 1 ? "Category" : "Categories"}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="empty-analytics-state">
          <div className="empty-icon-circle ruby-glow">💸</div>
          <p className="empty-text">No expense records found yet.</p>
          <span className="empty-subtext">Expenses will be grouped by category here.</span>
        </div>
      ) : (
        <div className="donut-content-wrapper">
          <div className="donut-chart-container">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <div className="tooltip-header">
                            <span>{data.icon}</span>
                            <strong>{data.name}</strong>
                          </div>
                          <div className="tooltip-value">
                            {currencySymbol}
                            {data.amount.toLocaleString()} ({data.percentage.toFixed(1)}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={98}
                  paddingAngle={5}
                  cornerRadius={6}
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      style={{
                        filter: `drop-shadow(0px 0px 6px ${entry.color}80)`,
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center-overlay">
              <span className="center-label">Spent</span>
              <span className="center-amount ruby-text">
                {currencySymbol}
                {totalExpense.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="category-legend-list">
            {chartData.map((item) => (
              <div key={item.name} className="legend-item">
                <div className="legend-left">
                  <div
                    className="category-icon-tile"
                    style={{
                      backgroundColor: `${item.color}18`,
                      borderColor: `${item.color}35`,
                    }}
                  >
                    <span>{item.icon}</span>
                  </div>
                  <div className="legend-info">
                    <span className="legend-name">{item.name}</span>
                    <div className="legend-bar-track">
                      <div
                        className="legend-bar-fill"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                          boxShadow: `0 0 8px ${item.color}`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="legend-right">
                  <span className="legend-amount">
                    {currencySymbol}
                    {item.amount.toLocaleString()}
                  </span>
                  <span className="legend-percentage" style={{ color: item.color }}>
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
