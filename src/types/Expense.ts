export interface Expense {
  id: string;
  category: string;
  amount: number;
  note: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'rent',     name: '房租',   icon: '🏠', color: '#FF6B35' },
  { id: 'water',    name: '水费',   icon: '💧', color: '#2196F3' },
  { id: 'electric', name: '电费',   icon: '⚡', color: '#FFC107' },
  { id: 'gas',      name: '燃气',   icon: '🔥', color: '#F44336' },
  { id: 'internet', name: '网费',   icon: '📶', color: '#9C27B0' },
  { id: 'property', name: '物业费', icon: '🏢', color: '#607D8B' },
  { id: 'other',    name: '其他',   icon: '📦', color: '#795548' },
];

export function getCategoryById(id: string): Category {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export interface AppData {
  expenses: Expense[];
  roommates: number;
}

export function getMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
