import { useMemo } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, PieChart as PieIcon, Award } from "lucide-react";
import categories from "../data/categories";

export default function ReportsView({ transactions = [], currencySymbol = "₦" }) {
  const { income, expense, balance, savingsRate, topCategory, categoryData } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const catMap = {};

    transactions.forEach((t) => {
      const amt = Number(t.amount);
      if (amt > 0) inc += amt;
      else {
        const absVal = Math.abs(amt);
        exp += absVal;
        const cat = t.category || "Other";
        catMap[cat] = (catMap[cat] || 0) + absVal;
      }
    });

    const net = inc - exp;
    const sRate = inc > 0 ? Math.max(0, ((inc - exp) / inc) * 100) : 0;

    let topCatName = "None";
    let maxCatVal = 0;
    Object.entries(catMap).forEach(([cat, val]) => {
      if (val > maxCatVal) {
        maxCatVal = val;
        topCatName = cat;
      }
    });

    const categoryColorMap = Object.fromEntries(
      categories.map((c) => [c.title, c.color])
    );

    const chartData = Object.entries(catMap).map(([name, amount]) => ({
      name,
      amount,
      color: categoryColorMap[name] || "#94a3b8",
    }));

    return {
      income: inc,
      expense: exp,
      balance: net,
      savingsRate: sRate,
      topCategory: { name: topCatName, amount: maxCatVal },
      categoryData: chartData,
    };
  }, [transactions]);

  const barComparisonData = [
    { name: "Total Income", amount: income, type: "income" },
    { name: "Total Expenses", amount: expense, type: "expense" },
  ];

  return (
    <div className="reports-view">
      <div className="view-header">
        <div>
          <h2 className="view-title">Financial Reports & Insights</h2>
          <p className="view-subtitle">Comprehensive breakdown of performance and cash flow</p>
        </div>
      </div>

      <div className="reports-metrics-grid">
        <div className="glass-card metric-card teal-glow">
          <div className="metric-header">
            <span className="metric-label">Savings Rate</span>
            <TrendingUp size={18} className="teal-text" />
          </div>
          <h3 className="metric-value teal-text">{savingsRate.toFixed(1)}%</h3>
          <span className="metric-subtext">Net cash retained</span>
        </div>

        <div className="glass-card metric-card ruby-glow">
          <div className="metric-header">
            <span className="metric-label">Top Expense Category</span>
            <PieIcon size={18} className="ruby-text" />
          </div>
          <h3 className="metric-value ruby-text">{topCategory.name}</h3>
          <span className="metric-subtext">
            {currencySymbol}{topCategory.amount.toLocaleString()} total spent
          </span>
        </div>

        <div className="glass-card metric-card sapphire-glow">
          <div className="metric-header">
            <span className="metric-label">Net Balance</span>
            <Award size={18} className="sapphire-text" />
          </div>
          <h3 className="metric-value sapphire-text">
            {balance < 0 ? "-" : "+"}{currencySymbol}{Math.abs(balance).toLocaleString()}
          </h3>
          <span className="metric-subtext">Overall cash position</span>
        </div>
      </div>

      <div className="reports-charts-grid">
        <div className="glass-card chart-card">
          <div className="card-header">
            <h3 className="card-title">Cash Flow Comparison</h3>
            <span className="header-badge teal-glow">Income vs Expenses</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barComparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${currencySymbol}${val.toLocaleString()}`} />
                <Tooltip
                  formatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#f8fafc" }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {barComparisonData.map((entry) => (
                    <Cell key={entry.name} fill={entry.type === "income" ? "#2dd4bf" : "#f43f5e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card chart-card">
          <div className="card-header">
            <h3 className="card-title">Spending by Category</h3>
            <span className="header-badge ruby-glow">{categoryData.length} Categories</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${currencySymbol}${val}`} />
                <Tooltip
                  formatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#f8fafc" }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
