import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { generateId } from '../../utils/helpers';
import type { Category, TransactionType, Transaction } from '../../types';
import { X, Save } from 'lucide-react';
import './Transactions.css';

const categories: Category[] = [
  'Salary', 'Freelance', 'Investment', 'Food & Dining', 'Transport',
  'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare',
  'Education', 'Travel', 'Rent', 'Subscriptions', 'Other',
];

export default function TransactionForm() {
  const { state, dispatch } = useAppContext();
  const editing = state.editingTransaction;

  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense' as TransactionType,
    category: 'Food & Dining' as Category,
    date: new Date().toISOString().split('T')[0],
    status: 'completed' as Transaction['status'],
  });

  useEffect(() => {
    if (editing) {
      setForm({
        description: editing.description,
        amount: editing.amount.toString(),
        type: editing.type,
        category: editing.category,
        date: editing.date,
        status: editing.status,
      });
    }
  }, [editing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;

    const transaction: Transaction = {
      id: editing?.id || generateId(),
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      status: form.status,
    };

    if (editing) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    }
  };

  const handleClose = () => {
    dispatch({ type: 'SET_FORM_OPEN', payload: false });
    dispatch({ type: 'SET_EDITING_TRANSACTION', payload: null });
  };

  return (
    <div className="transaction-form-overlay" onClick={handleClose}>
      <form
        className="transaction-form"
        id="transaction-form"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="transaction-form__header">
          <h3>{editing ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <button type="button" className="transaction-form__close" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <div className="transaction-form__body">
          <div className="transaction-form__field">
            <label htmlFor="form-description">Description</label>
            <input
              id="form-description"
              type="text"
              placeholder="Enter description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="transaction-form__row">
            <div className="transaction-form__field">
              <label htmlFor="form-amount">Amount ($)</label>
              <input
                id="form-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div className="transaction-form__field">
              <label htmlFor="form-date">Date</label>
              <input
                id="form-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="transaction-form__row">
            <div className="transaction-form__field">
              <label htmlFor="form-type">Type</label>
              <select
                id="form-type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="transaction-form__field">
              <label htmlFor="form-category">Category</label>
              <select
                id="form-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="transaction-form__field">
            <label htmlFor="form-status">Status</label>
            <select
              id="form-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Transaction['status'] })}
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="transaction-form__footer">
          <button type="button" className="btn btn--outline" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            <Save size={16} /> {editing ? 'Update' : 'Add'} Transaction
          </button>
        </div>
      </form>
    </div>
  );
}
