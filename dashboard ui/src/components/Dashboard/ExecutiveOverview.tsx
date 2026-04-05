import { useAppContext } from '../../context/AppContext';
import {
  formatCurrency,
  getBalance,
  getMonthlyData,
  getSavingsRate,
  getTotalExpenses,
  getTotalIncome,
} from '../../utils/helpers';
import { ArrowUpRight, BadgeDollarSign, CircleDollarSign, Goal, ShieldCheck } from 'lucide-react';
import './Dashboard.css';

export default function ExecutiveOverview() {
  const { state, dispatch } = useAppContext();
  const monthlyData = getMonthlyData(state.transactions);
  const totalIncome = getTotalIncome(state.transactions);
  const totalExpenses = getTotalExpenses(state.transactions);
  const balance = getBalance(state.transactions);
  const savingsRate = getSavingsRate(state.transactions);
  const latestMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  const netFlow = latestMonth ? latestMonth.income - latestMonth.expense : balance;
  const netFlowDelta = previousMonth ? netFlow - (previousMonth.income - previousMonth.expense) : netFlow;
  const expenseShare = totalIncome > 0 ? Math.min(100, Math.round((totalExpenses / totalIncome) * 100)) : 0;

  const highlightMetrics = [
    {
      id: 'cash-position',
      label: 'Cash Position',
      value: formatCurrency(balance),
      icon: CircleDollarSign,
    },
    {
      id: 'income-run-rate',
      label: 'Income Run Rate',
      value: formatCurrency(latestMonth?.income ?? totalIncome),
      icon: BadgeDollarSign,
    },
    {
      id: 'protection-band',
      label: 'Protection Band',
      value: `${Math.max(0, savingsRate)}%`,
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="executive-overview" id="executive-overview">
      <div className="executive-overview__content">
        <div className="executive-overview__eyebrow">
          <span className="executive-overview__pill">Executive overview</span>
          <span className="executive-overview__pill executive-overview__pill--soft">Live portfolio posture</span>
        </div>
        <div className="executive-overview__headline">
          <div>
            <h2>Capital is compounding faster than spending pressure.</h2>
            <p>
              Net flow is at <strong>{formatCurrency(netFlow)}</strong> this period, with savings pacing at{' '}
              <strong>{savingsRate}%</strong> and expense load sitting near <strong>{expenseShare}%</strong> of income.
            </p>
          </div>
          <button
            className="executive-overview__cta"
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'insights' })}
          >
            Open Insights
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="executive-overview__metrics">
          {highlightMetrics.map((metric) => (
            <div className="executive-overview__metric" key={metric.id}>
              <div className="executive-overview__metric-icon">
                <metric.icon size={18} />
              </div>
              <span className="executive-overview__metric-label">{metric.label}</span>
              <strong className="executive-overview__metric-value">{metric.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="executive-overview__panel">
        <div className="executive-overview__panel-header">
          <div>
            <span className="executive-overview__panel-label">This month</span>
            <strong className="executive-overview__panel-value">{formatCurrency(netFlow)}</strong>
          </div>
          <div className={`executive-overview__delta ${netFlowDelta >= 0 ? 'executive-overview__delta--positive' : 'executive-overview__delta--negative'}`}>
            {netFlowDelta >= 0 ? '+' : ''}
            {formatCurrency(netFlowDelta)} vs last month
          </div>
        </div>

        <div className="executive-overview__goal">
          <div className="executive-overview__goal-copy">
            <Goal size={18} />
            <div>
              <span>Efficiency target</span>
              <strong>{Math.min(100, Math.max(savingsRate, 0))}% of 30% goal reached</strong>
            </div>
          </div>
          <div className="executive-overview__progress">
            <div
              className="executive-overview__progress-bar"
              style={{ width: `${Math.min(100, Math.round((Math.max(savingsRate, 0) / 30) * 100))}%` }}
            />
          </div>
        </div>

        <div className="executive-overview__summary">
          <div>
            <span>Income</span>
            <strong>{formatCurrency(latestMonth?.income ?? totalIncome)}</strong>
          </div>
          <div>
            <span>Expenses</span>
            <strong>{formatCurrency(latestMonth?.expense ?? totalExpenses)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
