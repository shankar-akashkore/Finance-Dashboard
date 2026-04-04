import { useAppContext } from '../../context/AppContext';
import { getCategorySpending, formatCurrency } from '../../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './Charts.css';

export default function SpendingBreakdown() {
  const { state } = useAppContext();
  const categoryData = getCategorySpending(state.transactions);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { category: string; amount: number; percentage: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip__label">{data.category}</p>
          <p className="chart-tooltip__value">{formatCurrency(data.amount)}</p>
          <p className="chart-tooltip__pct">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container" id="spending-breakdown">
      <div className="chart-container__header">
        <div>
          <h3 className="chart-container__title">Spending Breakdown</h3>
          <p className="chart-container__subtitle">Expenses by category</p>
        </div>
      </div>
      <div className="chart-container__body spending-layout">
        {categoryData.length === 0 ? (
          <div className="chart-empty">No expenses recorded</div>
        ) : (
          <>
            <div className="spending-chart">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="amount"
                    nameKey="category"
                    stroke="none"
                    animationBegin={0}
                    animationDuration={1200}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="spending-legend">
              {categoryData.slice(0, 6).map((item) => (
                <div className="spending-legend__item" key={item.category}>
                  <div className="spending-legend__color" style={{ background: item.color }} />
                  <div className="spending-legend__info">
                    <span className="spending-legend__name">{item.category}</span>
                    <span className="spending-legend__amount">{formatCurrency(item.amount)}</span>
                  </div>
                  <span className="spending-legend__pct">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
