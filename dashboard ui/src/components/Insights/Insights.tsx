import { useAppContext } from '../../context/AppContext';
import {
  formatCurrency,
  getCategorySpending,
  getMonthlyData,
  getHighestSpendingCategory,
  getMonthOverMonthChange,
  getAverageTransactionAmount,
  getTotalIncome,
  getTotalExpenses,
  getSavingsRate,
} from '../../utils/helpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  BarChart3,
  PiggyBank,
} from 'lucide-react';
import './Insights.css';

export default function Insights() {
  const { state } = useAppContext();
  const { transactions } = state;

  const monthlyData = getMonthlyData(transactions);
  const categorySpending = getCategorySpending(transactions);
  const highestCategory = getHighestSpendingCategory(transactions);
  const monthChange = getMonthOverMonthChange(transactions);
  const avgIncome = getAverageTransactionAmount(transactions, 'income');
  const avgExpense = getAverageTransactionAmount(transactions, 'expense');
  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const savingsRate = getSavingsRate(transactions);

  const lowestSpendingMonth = monthlyData.length > 0
    ? monthlyData.reduce((min, m) => (m.expense < min.expense ? m : min), monthlyData[0])
    : null;

  const highestIncomeMonth = monthlyData.length > 0
    ? monthlyData.reduce((max, m) => (m.income > max.income ? m : max), monthlyData[0])
    : null;

  const incomeCategories = transactions
    .filter((t) => t.type === 'income' && t.status !== 'failed')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topIncomeSource = Object.entries(incomeCategories).sort((a, b) => b[1] - a[1])[0];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip__label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="chart-tooltip__value" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="insights" id="insights-view">
      <div className="insights__header">
        <h2 className="insights__title">Financial Insights</h2>
        <p className="insights__subtitle">Key observations from your financial data</p>
      </div>

      {/* Key Metrics Row */}
      <div className="insights__metrics">
        <div className="insight-metric" style={{ animationDelay: '0s' }}>
          <div className="insight-metric__icon insight-metric__icon--primary">
            <Target size={20} />
          </div>
          <div className="insight-metric__content">
            <span className="insight-metric__label">Avg Income</span>
            <span className="insight-metric__value">{formatCurrency(avgIncome)}</span>
            <span className="insight-metric__note">per transaction</span>
          </div>
        </div>

        <div className="insight-metric" style={{ animationDelay: '0.1s' }}>
          <div className="insight-metric__icon insight-metric__icon--danger">
            <Zap size={20} />
          </div>
          <div className="insight-metric__content">
            <span className="insight-metric__label">Avg Expense</span>
            <span className="insight-metric__value">{formatCurrency(avgExpense)}</span>
            <span className="insight-metric__note">per transaction</span>
          </div>
        </div>

        <div className="insight-metric" style={{ animationDelay: '0.2s' }}>
          <div className="insight-metric__icon insight-metric__icon--success">
            <PiggyBank size={20} />
          </div>
          <div className="insight-metric__content">
            <span className="insight-metric__label">Savings Rate</span>
            <span className="insight-metric__value">{savingsRate}%</span>
            <span className="insight-metric__note">{savingsRate > 20 ? 'Above target' : 'Below 20% target'}</span>
          </div>
        </div>

        <div className="insight-metric" style={{ animationDelay: '0.3s' }}>
          <div className="insight-metric__icon insight-metric__icon--accent">
            <BarChart3 size={20} />
          </div>
          <div className="insight-metric__content">
            <span className="insight-metric__label">Income/Expense</span>
            <span className="insight-metric__value">{totalExpenses > 0 ? (totalIncome / totalExpenses).toFixed(1) : '∞'}x</span>
            <span className="insight-metric__note">ratio</span>
          </div>
        </div>
      </div>

      {/* Monthly Comparison Chart */}
      <div className="insights__chart">
        <div className="insights__chart-header">
          <h3>Monthly Comparison</h3>
          <p>Income vs Expenses by month</p>
        </div>
        <div className="insights__chart-body">
          {monthlyData.length === 0 ? (
            <div className="chart-empty">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Bar dataKey="income" name="Income" fill="#00b894" radius={[6, 6, 0, 0]} barSize={28} />
                <Bar dataKey="expense" name="Expenses" fill="#ff6b6b" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Insight Cards */}
      <div className="insights__cards">
        {/* Highest Spending Category */}
        <div className="insight-card insight-card--alert" id="insight-highest-spending">
          <div className="insight-card__icon">
            <AlertTriangle size={22} />
          </div>
          <div className="insight-card__content">
            <h4>Highest Spending Category</h4>
            {highestCategory ? (
              <>
                <p className="insight-card__highlight">{highestCategory.category}</p>
                <p className="insight-card__detail">
                  You spent <strong>{formatCurrency(highestCategory.amount)}</strong> on {highestCategory.category}.
                  Consider reviewing these expenses.
                </p>
              </>
            ) : (
              <p className="insight-card__detail">No expense data available.</p>
            )}
          </div>
        </div>

        {/* Top Income Source */}
        <div className="insight-card insight-card--success" id="insight-income-source">
          <div className="insight-card__icon">
            <Award size={22} />
          </div>
          <div className="insight-card__content">
            <h4>Top Income Source</h4>
            {topIncomeSource ? (
              <>
                <p className="insight-card__highlight">{topIncomeSource[0]}</p>
                <p className="insight-card__detail">
                  Your primary income source is <strong>{topIncomeSource[0]}</strong> at{' '}
                  <strong>{formatCurrency(topIncomeSource[1])}</strong>.
                </p>
              </>
            ) : (
              <p className="insight-card__detail">No income data available.</p>
            )}
          </div>
        </div>

        {/* Month over Month Change */}
        <div className="insight-card insight-card--info" id="insight-month-change">
          <div className="insight-card__icon">
            {monthChange.expense < 0 ? <TrendingDown size={22} /> : <TrendingUp size={22} />}
          </div>
          <div className="insight-card__content">
            <h4>Month-over-Month Change</h4>
            <div className="insight-card__stats">
              <div className={`insight-card__stat ${monthChange.income >= 0 ? 'stat--positive' : 'stat--negative'}`}>
                {monthChange.income >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>Income: {monthChange.income > 0 ? '+' : ''}{monthChange.income}%</span>
              </div>
              <div className={`insight-card__stat ${monthChange.expense <= 0 ? 'stat--positive' : 'stat--negative'}`}>
                {monthChange.expense <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                <span>Expenses: {monthChange.expense > 0 ? '+' : ''}{monthChange.expense}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best Month */}
        <div className="insight-card insight-card--primary" id="insight-best-month">
          <div className="insight-card__icon">
            <TrendingUp size={22} />
          </div>
          <div className="insight-card__content">
            <h4>Best Performing Month</h4>
            {highestIncomeMonth ? (
              <>
                <p className="insight-card__highlight">{highestIncomeMonth.month}</p>
                <p className="insight-card__detail">
                  Highest income of <strong>{formatCurrency(highestIncomeMonth.income)}</strong>.{' '}
                  {lowestSpendingMonth && (
                    <>Lowest spending was in <strong>{lowestSpendingMonth.month}</strong> at{' '}
                    {formatCurrency(lowestSpendingMonth.expense)}.</>
                  )}
                </p>
              </>
            ) : (
              <p className="insight-card__detail">Not enough data.</p>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="insights__breakdown">
        <h3>Expense Category Breakdown</h3>
        <div className="breakdown-list">
          {categorySpending.map((cat, index) => (
            <div className="breakdown-item" key={cat.category} style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="breakdown-item__left">
                <div className="breakdown-item__color" style={{ background: cat.color }} />
                <span className="breakdown-item__name">{cat.category}</span>
              </div>
              <div className="breakdown-item__right">
                <div className="breakdown-item__bar-wrapper">
                  <div
                    className="breakdown-item__bar"
                    style={{ width: `${cat.percentage}%`, background: cat.color }}
                  />
                </div>
                <span className="breakdown-item__amount">{formatCurrency(cat.amount)}</span>
                <span className="breakdown-item__pct">{cat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
