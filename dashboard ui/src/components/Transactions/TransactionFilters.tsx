import { useAppContext } from '../../context/AppContext';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Category } from '../../types';
import './Transactions.css';

const categories: Category[] = [
  'Salary', 'Freelance', 'Investment', 'Food & Dining', 'Transport',
  'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare',
  'Education', 'Travel', 'Rent', 'Subscriptions', 'Other',
];

export default function TransactionFilters() {
  const { state, dispatch } = useAppContext();
  const { filters } = state;

  const hasActiveFilters =
    filters.search || filters.type !== 'all' || filters.category !== 'all' ||
    filters.dateRange.start || filters.dateRange.end;

  return (
    <div className="filters" id="transaction-filters">
      <div className="filters__row">
        <div className="filters__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { search: e.target.value } })}
            className="filters__input"
            id="search-input"
          />
          {filters.search && (
            <button className="filters__clear-input" onClick={() => dispatch({ type: 'SET_FILTERS', payload: { search: '' } })}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filters__group">
          <SlidersHorizontal size={16} />

          <select
            className="filters__select"
            value={filters.type}
            onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { type: e.target.value as 'all' | 'income' | 'expense' } })}
            id="filter-type"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            className="filters__select"
            value={filters.category}
            onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { category: e.target.value as Category | 'all' } })}
            id="filter-category"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="filters__select"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as ['date' | 'amount' | 'category', 'asc' | 'desc'];
              dispatch({ type: 'SET_FILTERS', payload: { sortBy, sortOrder } });
            }}
            id="filter-sort"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="category-asc">Category A-Z</option>
            <option value="category-desc">Category Z-A</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            className="btn btn--outline btn--small"
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
            id="reset-filters"
          >
            <X size={14} /> Reset
          </button>
        )}
      </div>

      <div className="filters__dates">
        <input
          type="date"
          className="filters__date-input"
          value={filters.dateRange.start}
          onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { dateRange: { ...filters.dateRange, start: e.target.value } } })}
          placeholder="From"
          id="filter-date-start"
        />
        <span className="filters__date-separator">to</span>
        <input
          type="date"
          className="filters__date-input"
          value={filters.dateRange.end}
          onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { dateRange: { ...filters.dateRange, end: e.target.value } } })}
          placeholder="To"
          id="filter-date-end"
        />
      </div>
    </div>
  );
}
