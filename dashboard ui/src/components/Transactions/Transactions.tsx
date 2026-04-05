import { useAppContext } from '../../context/AppContext';
import { filterTransactions, formatCurrency, formatDate, exportToCSV, exportToJSON } from '../../utils/helpers';
import TransactionFilters from './TransactionFilters';
import TransactionForm from './TransactionForm';
import { Trash2, Edit3, ArrowUpRight, ArrowDownRight, Plus, Download, FileJson, AlertCircle } from 'lucide-react';
import './Transactions.css';

export default function Transactions() {
  const { state, dispatch } = useAppContext();
  const filtered = filterTransactions(state.transactions, state.filters);
  const isAdmin = state.role === 'admin';

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  const handleEdit = (transaction: typeof state.transactions[0]) => {
    dispatch({ type: 'SET_EDITING_TRANSACTION', payload: transaction });
  };

  return (
    <div className="transactions" id="transactions-view">
      <div className="transactions__header">
        <div>
          <h2 className="transactions__title">Transactions</h2>
          <p className="transactions__subtitle">{filtered.length} transactions found</p>
        </div>
        <div className="transactions__actions">
          <div className="transactions__export">
            <button className="btn btn--outline" onClick={() => exportToCSV(filtered)} title="Export CSV">
              <Download size={16} /> CSV
            </button>
            <button className="btn btn--outline" onClick={() => exportToJSON(filtered)} title="Export JSON">
              <FileJson size={16} /> JSON
            </button>
          </div>
          {isAdmin && (
            <button
              className="btn btn--primary"
              id="add-transaction-btn"
              onClick={() => {
                dispatch({ type: 'SET_EDITING_TRANSACTION', payload: null });
                dispatch({ type: 'SET_FORM_OPEN', payload: true });
              }}
            >
              <Plus size={16} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      <TransactionFilters />

      {state.isFormOpen && isAdmin && <TransactionForm />}

      <div className="transactions__table-wrapper">
        {filtered.length === 0 ? (
          <div className="transactions__empty" id="empty-state">
            <AlertCircle size={48} />
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or add a new transaction.</p>
          </div>
        ) : (
          <>
            <table className="transactions__table" id="transactions-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="transactions__row">
                    <td>
                      <div className="transactions__cell-main">
                        <div className={`transactions__type-icon transactions__type-icon--${t.type}`}>
                          {t.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        </div>
                        <div>
                          <span className="transactions__desc">{t.description}</span>
                          <span className="transactions__type-label">{t.type}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="transactions__category">{t.category}</span>
                    </td>
                    <td>
                      <span className="transactions__date">{formatDate(t.date)}</span>
                    </td>
                    <td>
                      <span className={`transactions__amount transactions__amount--${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td>
                      <span className={`transactions__status transactions__status--${t.status}`}>
                        {t.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="transactions__actions-cell">
                          <button
                            className="transactions__action-btn"
                            onClick={() => handleEdit(t)}
                            title="Edit"
                            aria-label={`Edit ${t.description}`}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className="transactions__action-btn transactions__action-btn--delete"
                            onClick={() => handleDelete(t.id)}
                            title="Delete"
                            aria-label={`Delete ${t.description}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="transactions__mobile-list">
              {filtered.map((t) => (
                <article className="transactions__mobile-card" key={`${t.id}-mobile`}>
                  <div className="transactions__mobile-top">
                    <div className="transactions__cell-main">
                      <div className={`transactions__type-icon transactions__type-icon--${t.type}`}>
                        {t.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      </div>
                      <div>
                        <span className="transactions__desc">{t.description}</span>
                        <span className="transactions__type-label">{t.type}</span>
                      </div>
                    </div>
                    <div className="transactions__mobile-amount-wrap">
                      <span className="transactions__mobile-label">Amount</span>
                      <span className={`transactions__amount transactions__amount--${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="transactions__mobile-meta">
                    <div className="transactions__mobile-meta-item">
                      <span className="transactions__mobile-label">Category</span>
                      <span className="transactions__category">{t.category}</span>
                    </div>
                    <div className="transactions__mobile-meta-item">
                      <span className="transactions__mobile-label">Date</span>
                      <span className="transactions__date">{formatDate(t.date)}</span>
                    </div>
                    <div className="transactions__mobile-meta-item">
                      <span className="transactions__mobile-label">Status</span>
                      <span className={`transactions__status transactions__status--${t.status}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="transactions__mobile-actions">
                      <button
                        className="transactions__action-btn"
                        onClick={() => handleEdit(t)}
                        title="Edit"
                        aria-label={`Edit ${t.description}`}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="transactions__action-btn transactions__action-btn--delete"
                        onClick={() => handleDelete(t.id)}
                        title="Delete"
                        aria-label={`Delete ${t.description}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
