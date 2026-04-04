import { useAppContext } from '../../context/AppContext';
import { getMonthlyData } from '../../utils/helpers';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import './Charts.css';

export default function BalanceTrend() {
  const { state } = useAppContext();
  const monthlyData = getMonthlyData(state.transactions);

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
    <div className="chart-container" id="balance-trend">
      <div className="chart-container__header">
        <div>
          <h3 className="chart-container__title">Balance Trend</h3>
          <p className="chart-container__subtitle">Income vs Expenses over time</p>
        </div>
      </div>
      <div className="chart-container__body">
        {monthlyData.length === 0 ? (
          <div className="chart-empty">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00b894" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00b894" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#00b894"
                fill="url(#incomeGrad)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#00b894' }}
                activeDot={{ r: 6 }}
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ff6b6b"
                fill="url(#expenseGrad)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#ff6b6b' }}
                activeDot={{ r: 6 }}
                name="Expenses"
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#6c5ce7"
                fill="url(#balanceGrad)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#6c5ce7' }}
                activeDot={{ r: 6 }}
                name="Balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
