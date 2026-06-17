import { AppData, Expense } from '../types/Expense';

const STORAGE_KEY = 'rent-tracker-data';

const DEFAULT_DATA: AppData = {
  expenses: [],
  roommates: 2,
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const data = JSON.parse(raw) as AppData;
    return {
      expenses: Array.isArray(data.expenses) ? data.expenses : [],
      roommates: typeof data.roommates === 'number' && data.roommates > 0 ? data.roommates : 2,
    };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addExpense(expenses: Expense[], expense: Expense): Expense[] {
  return [expense, ...expenses];
}

export function deleteExpense(expenses: Expense[], id: string): Expense[] {
  return expenses.filter(e => e.id !== id);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
