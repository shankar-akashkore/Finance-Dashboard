import { useAppContext } from '../../context/AppContext';
import { formatCurrency, formatDateShort } from '../../utils/helpers';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './Charts.css';

export default function RecentTransactions() {
  const { state, dispatch } = useAppContext();

  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <div className="chart-container" id="recent-transactions">
      <div className="chart-container__header">
        <div>
          <h3 className="chart-container__title">Recent Transactions</h3>
          <p className="chart-container__subtitle">Latest activity</p>
        </div>
        <button
          className="view-all-btn"
          onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'transactions' })}
        >
          View All
        </button>
      </div>
      <div className="recent-list">
        {recent.length === 0 ? (
          <div className="chart-empty">No transactions yet</div>
        ) : (
          recent.map((t) => (
            <div className="recent-item" key={t.id}>
              <div className={`recent-item__icon recent-item__icon--${t.type}`}>
                {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
              </div>
              <div className="recent-item__info">
                <span className="recent-item__desc">{t.description}</span>
                <span className="recent-item__category">{t.category}</span>
              </div>
              <div className="recent-item__right">
                <span className={`recent-item__amount recent-item__amount--${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
                <span className="recent-item__date">{formatDateShort(t.date)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
