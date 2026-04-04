import { useAppContext } from '../../context/AppContext';
import { formatCurrency, getTotalIncome, getTotalExpenses, getBalance, getSavingsRate } from '../../utils/helpers';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import './SummaryCards.css';

export default function SummaryCards() {
  const { state } = useAppContext();
  const { transactions } = state;

  const totalBalance = getBalance(transactions);
  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const savingsRate = getSavingsRate(transactions);

  const cards = [
    {
      id: 'total-balance',
      label: 'Total Balance',
      value: formatCurrency(totalBalance),
      icon: Wallet,
      trend: totalBalance >= 0 ? '+' : '',
      trendValue: `${savingsRate}% savings rate`,
      trendPositive: totalBalance >= 0,
      gradient: 'card--primary',
    },
    {
      id: 'total-income',
      label: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      trend: '+',
      trendValue: 'All time',
      trendPositive: true,
      gradient: 'card--success',
    },
    {
      id: 'total-expenses',
      label: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      trend: '',
      trendValue: 'All time',
      trendPositive: false,
      gradient: 'card--danger',
    },
    {
      id: 'savings-rate',
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      icon: PiggyBank,
      trend: savingsRate > 20 ? 'Healthy' : 'Low',
      trendValue: savingsRate > 20 ? 'Above target' : 'Below target',
      trendPositive: savingsRate > 20,
      gradient: 'card--accent',
    },
  ];

  return (
    <div className="summary-cards" id="summary-cards">
      {cards.map((card, index) => (
        <div
          className={`summary-card ${card.gradient}`}
          key={card.id}
          id={card.id}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="summary-card__header">
            <span className="summary-card__label">{card.label}</span>
            <div className="summary-card__icon">
              <card.icon size={20} />
            </div>
          </div>
          <div className="summary-card__value">{card.value}</div>
          <div className={`summary-card__trend ${card.trendPositive ? 'trend--positive' : 'trend--negative'}`}>
            <span className="summary-card__trend-text">{card.trendValue}</span>
          </div>
          <div className="summary-card__glow" />
        </div>
      ))}
    </div>
  );
}
