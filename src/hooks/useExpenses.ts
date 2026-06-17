import { useState, useCallback, useEffect } from 'react';
import { Expense, AppData, getMonthKey, DEFAULT_BUDGETS } from '../types/Expense';
import { loadData, saveData, addExpense, deleteExpense, generateId, setBudget } from '../utils/storage';

export function useExpenses() {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const add = useCallback((category: string, amount: number, note: string, date: string) => {
    const expense: Expense = {
      id: generateId(),
      category,
      amount,
      note,
      date,
      createdAt: Date.now(),
    };
    setData(prev => ({
      ...prev,
      expenses: addExpense(prev.expenses, expense),
    }));
  }, []);

  const remove = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      expenses: deleteExpense(prev.expenses, id),
    }));
  }, []);

  const setRoommates = useCallback((count: number) => {
    setData(prev => ({
      ...prev,
      roommates: count,
    }));
  }, []);

  const setCategoryBudget = useCallback((categoryId: string, amount: number) => {
    setData(prev => ({
      ...prev,
      budgets: setBudget(prev.budgets, categoryId, amount),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setData({ expenses: [], roommates: 2, budgets: { ...DEFAULT_BUDGETS } });
  }, []);

  const getMonthExpenses = useCallback((year: number, month: number): Expense[] => {
    const key = getMonthKey(year, month);
    return data.expenses.filter(e => e.date.startsWith(key));
  }, [data.expenses]);

  const getMonthTotal = useCallback((year: number, month: number): number => {
    return getMonthExpenses(year, month).reduce((sum, e) => sum + e.amount, 0);
  }, [getMonthExpenses]);

  const getCategoryTotal = useCallback((year: number, month: number): Record<string, number> => {
    const expenses = getMonthExpenses(year, month);
    const result: Record<string, number> = {};
    for (const e of expenses) {
      result[e.category] = (result[e.category] || 0) + e.amount;
    }
    return result;
  }, [getMonthExpenses]);

  const getYearTotal = useCallback((year: number): number => {
    return data.expenses
      .filter(e => e.date.startsWith(String(year)))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [data.expenses]);

  const getMonthlyTotals = useCallback((year: number): number[] => {
    const totals = new Array(12).fill(0);
    data.expenses
      .filter(e => e.date.startsWith(String(year)))
      .forEach(e => {
        const month = parseInt(e.date.split('-')[1], 10) - 1;
        totals[month] += e.amount;
      });
    return totals;
  }, [data.expenses]);

  return {
    data,
    add,
    remove,
    setRoommates,
    setCategoryBudget,
    clearAll,
    getMonthExpenses,
    getMonthTotal,
    getCategoryTotal,
    getYearTotal,
    getMonthlyTotals,
  };
}
