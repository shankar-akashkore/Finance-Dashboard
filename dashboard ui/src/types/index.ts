export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Food & Dining'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Rent'
  | 'Subscriptions'
  | 'Other';

export type Role = 'viewer' | 'admin';

export type Theme = 'dark' | 'light';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  status: 'completed' | 'pending' | 'failed';
}

export interface Filters {
  search: string;
  type: TransactionType | 'all';
  category: Category | 'all';
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: 'date' | 'amount' | 'category';
  sortOrder: 'asc' | 'desc';
}

export interface AppState {
  transactions: Transaction[];
  filters: Filters;
  role: Role;
  theme: Theme;
  activeView: 'dashboard' | 'transactions' | 'insights';
  editingTransaction: Transaction | null;
  isFormOpen: boolean;
}

export type AppAction =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<Filters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_ROLE'; payload: Role }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_ACTIVE_VIEW'; payload: AppState['activeView'] }
  | { type: 'SET_EDITING_TRANSACTION'; payload: Transaction | null }
  | { type: 'SET_FORM_OPEN'; payload: boolean };

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}
