import type { Transaction, MonthlyData, CategorySpending, Filters } from '../types';
import { categoryColors } from '../data/mockData';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getMonthName = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const getTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'income' && t.status !== 'failed')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'expense' && t.status !== 'failed')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getBalance = (transactions: Transaction[]): number => {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
};

export const getSavingsRate = (transactions: Transaction[]): number => {
  const income = getTotalIncome(transactions);
  if (income === 0) return 0;
  const balance = getBalance(transactions);
  return Math.round((balance / income) * 100);
};

export const getMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
  const monthlyMap = new Map<string, { income: number; expense: number }>();

  transactions
    .filter((t) => t.status !== 'failed')
    .forEach((t) => {
      const month = getMonthName(t.date);
      const current = monthlyMap.get(month) || { income: 0, expense: 0 };
      if (t.type === 'income') {
        current.income += t.amount;
      } else {
        current.expense += t.amount;
      }
      monthlyMap.set(month, current);
    });

  const sortedEntries = Array.from(monthlyMap.entries()).sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateA.getTime() - dateB.getTime();
  });

  let runningBalance = 0;
  return sortedEntries.map(([month, data]) => {
    runningBalance += data.income - data.expense;
    return {
      month,
      income: Math.round(data.income),
      expense: Math.round(data.expense),
      balance: Math.round(runningBalance),
    };
  });
};

export const getCategorySpending = (transactions: Transaction[]): CategorySpending[] => {
  const categoryMap = new Map<string, number>();

  transactions
    .filter((t) => t.type === 'expense' && t.status !== 'failed')
    .forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

  const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round((amount / total) * 100),
      color: categoryColors[category] || '#b2bec3',
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const filterTransactions = (transactions: Transaction[], filters: Filters): Transaction[] => {
  let filtered = [...transactions];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower) ||
        t.amount.toString().includes(searchLower)
    );
  }

  // Type filter
  if (filters.type !== 'all') {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  // Category filter
  if (filters.category !== 'all') {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  // Date range filter
  if (filters.dateRange.start) {
    filtered = filtered.filter((t) => t.date >= filters.dateRange.start);
  }
  if (filters.dateRange.end) {
    filtered = filtered.filter((t) => t.date <= filters.dateRange.end);
  }

  // Sorting
  filtered.sort((a, b) => {
    let comparison = 0;
    switch (filters.sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
    }
    return filters.sortOrder === 'desc' ? -comparison : comparison;
  });

  return filtered;
};

export const generateId = (): string => {
  return 't' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
};

export const getHighestSpendingCategory = (transactions: Transaction[]): { category: string; amount: number } | null => {
  const spending = getCategorySpending(transactions);
  return spending.length > 0 ? { category: spending[0].category, amount: spending[0].amount } : null;
};

export const getMonthOverMonthChange = (transactions: Transaction[]): { income: number; expense: number } => {
  const monthly = getMonthlyData(transactions);
  if (monthly.length < 2) return { income: 0, expense: 0 };

  const current = monthly[monthly.length - 1];
  const previous = monthly[monthly.length - 2];

  const incomeChange = previous.income === 0 ? 0 : Math.round(((current.income - previous.income) / previous.income) * 100);
  const expenseChange = previous.expense === 0 ? 0 : Math.round(((current.expense - previous.expense) / previous.expense) * 100);

  return { income: incomeChange, expense: expenseChange };
};

export const getAverageTransactionAmount = (transactions: Transaction[], type: 'income' | 'expense'): number => {
  const filtered = transactions.filter((t) => t.type === type && t.status !== 'failed');
  if (filtered.length === 0) return 0;
  return Math.round(filtered.reduce((sum, t) => sum + t.amount, 0) / filtered.length);
};

export const exportToCSV = (transactions: Transaction[]): void => {
  const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Status'];
  const rows = transactions.map((t) => [t.date, t.description, t.amount.toString(), t.type, t.category, t.status]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csv, 'transactions.csv', 'text/csv');
};

export const exportToJSON = (transactions: Transaction[]): void => {
  const json = JSON.stringify(transactions, null, 2);
  downloadFile(json, 'transactions.json', 'application/json');
};

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
