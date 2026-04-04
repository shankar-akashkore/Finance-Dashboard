import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction, Filters } from '../types';
import { mockTransactions } from '../data/mockData';

const defaultFilters: Filters = {
  search: '',
  type: 'all',
  category: 'all',
  dateRange: { start: '', end: '' },
  sortBy: 'date',
  sortOrder: 'desc',
};

const initialState: AppState = {
  transactions: mockTransactions,
  filters: defaultFilters,
  role: 'admin',
  theme: 'dark',
  activeView: 'dashboard',
  editingTransaction: null,
  isFormOpen: false,
};

const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem('finDashState');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initialState, ...parsed, filters: defaultFilters, editingTransaction: null, isFormOpen: false };
    }
  } catch {
    // ignore parse errors
  }
  return initialState;
};

const saveState = (state: AppState): void => {
  try {
    const toSave = {
      transactions: state.transactions,
      role: state.role,
      theme: state.theme,
      activeView: state.activeView,
    };
    localStorage.setItem('finDashState', JSON.stringify(toSave));
  } catch {
    // ignore quota errors
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions], isFormOpen: false };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === action.payload.id ? action.payload : t)),
        editingTransaction: null,
        isFormOpen: false,
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return { ...state, filters: defaultFilters };

    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };

    case 'SET_EDITING_TRANSACTION':
      return { ...state, editingTransaction: action.payload, isFormOpen: action.payload !== null };

    case 'SET_FORM_OPEN':
      return { ...state, isFormOpen: action.payload, editingTransaction: action.payload ? state.editingTransaction : null };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state.transactions, state.role, state.theme, state.activeView]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
