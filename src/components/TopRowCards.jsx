import { useMemo } from "react";
import { ArrowUpRight, ArrowDownRight, Receipt, Wallet, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

export default function TopRowCards({ transactions = [], currencySymbol = "₦" }) {
  const { income, expense, balance, sparklineData } = useMemo(() => {
    let inc = 0;
    let exp = 0;

    const sorted = [...transactions].sort(
      (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );

    let runningBalance = 0;
    const points = [];

    sorted.forEach((t, idx) => {
      const amt = Number(t.amount) || 0;
      if (amt > 0) inc += amt;
      else exp += Math.abs(amt);

      runningBalance += amt;
      points.push({ index: idx, balance: runningBalance });
    });

    if (points.length === 0) {
      points.push({ index: 0, balance: 0 });
      points.push({ index: 1, balance: 0 });
    }

    return {
      income: inc,
      expense: exp,
      balance: inc - exp,
      sparklineData: points,
    };
  }, [transactions]);

  return (
    <section className="top-row-cards">
      <div className="glass-card balance-card">
        <div className="card-top">
          <div className="card-header-info">
            <span className="card-label">Total Balance</span>
            <div className="card-value-group">
              <h2 className="card-value balance-value">
                {balance < 0 ? "-" : ""}
                {currencySymbol}
                {Math.abs(balance).toLocaleString()}
              </h2>
            </div>
          </div>
          <div className="card-icon-badge teal-glow">
            <Wallet className="card-icon teal" />
          </div>
        </div>

        <div className="sparkline-container">
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={sparklineData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="tealSparkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#2dd4bf"
                strokeWidth={2.5}
                fill="url(#tealSparkGradient)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card combined-flow-card">
        <div className="flow-panel income-panel">
          <div className="flow-header">
            <span className="flow-label">Total Income</span>
            <div className="flow-icon-circle income-circle">
              <ArrowUpRight className="flow-icon teal" />
            </div>
          </div>
          <h3 className="flow-value teal-text">
            +{currencySymbol}
            {income.toLocaleString()}
          </h3>
          <span className="flow-subtext">Money In</span>
        </div>

        <div className="panel-divider" />

        <div className="flow-panel expense-panel">
          <div className="flow-header">
            <span className="flow-label">Total Expenses</span>
            <div className="flow-icon-circle expense-circle">
              <ArrowDownRight className="flow-icon ruby" />
            </div>
          </div>
          <h3 className="flow-value ruby-text">
            −{currencySymbol}
            {expense.toLocaleString()}
          </h3>
          <span className="flow-subtext">Money Out</span>
        </div>
      </div>

      <div className="glass-card count-card sapphire-glow">
        <div className="card-top">
          <div className="card-header-info">
            <span className="card-label">Transaction Count</span>
            <h2 className="card-value sapphire-text">{transactions.length}</h2>
          </div>
          <div className="card-icon-badge sapphire-glow-badge">
            <Receipt className="card-icon sapphire" />
          </div>
        </div>
        <div className="count-footer">
          <div className="count-pill">
            <TrendingUp className="pill-icon" />
            <span>Active Record</span>
          </div>
          <span className="count-sublabel">Synced in realtime</span>
        </div>
      </div>
    </section>
  );
}
