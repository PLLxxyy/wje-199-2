import React, { useState, useCallback } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { TabBar } from './components/TabBar';
import { AddExpenseModal } from './components/AddExpenseModal';
import { HomePage } from './pages/HomePage';
import { StatsPage } from './pages/StatsPage';
import { YearlyPage } from './pages/YearlyPage';
import { SettingsPage } from './pages/SettingsPage';

const now = new Date();
const CURRENT_YEAR = now.getFullYear();
const CURRENT_MONTH = now.getMonth() + 1;

const App: React.FC = () => {
  const {
    data, add, remove, setRoommates, setCategoryBudget, clearAll,
    getMonthExpenses, getMonthTotal, getCategoryTotal,
    getYearTotal, getMonthlyTotals,
  } = useExpenses();

  const [tab, setTab] = useState('home');
  const [viewYear, setViewYear] = useState(CURRENT_YEAR);
  const [viewMonth, setViewMonth] = useState(CURRENT_MONTH);
  const [yearlyYear, setYearlyYear] = useState(CURRENT_YEAR);
  const [showAdd, setShowAdd] = useState(false);

  const handlePrevMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev <= 1) {
        setViewYear(y => y - 1);
        return 12;
      }
      return prev - 1;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev >= 12) {
        setViewYear(y => y + 1);
        return 1;
      }
      return prev + 1;
    });
  }, []);

  const handlePrevYear = useCallback(() => setYearlyYear(y => y - 1), []);
  const handleNextYear = useCallback(() => setYearlyYear(y => y + 1), []);

  const monthTotal = getMonthTotal(viewYear, viewMonth);
  const categoryTotals = getCategoryTotal(viewYear, viewMonth);
  const monthExpenses = getMonthExpenses(viewYear, viewMonth);
  const yearTotal = getYearTotal(yearlyYear);
  const monthlyTotals = getMonthlyTotals(yearlyYear);

  const headerTitle = () => {
    switch (tab) {
      case 'home': return '租房记账本';
      case 'stats': return '月度统计';
      case 'yearly': return '年度总览';
      case 'settings': return '设置';
      default: return '租房记账本';
    }
  };

  return (
    <div className="app">
      <div className="header">
        <span>{headerTitle()}</span>
        {tab === 'home' && (
          <button className="header-action" onClick={() => setShowAdd(true)}>+</button>
        )}
      </div>

      {tab === 'home' && (
        <HomePage
          year={viewYear}
          month={viewMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          monthTotal={monthTotal}
          categoryTotals={categoryTotals}
          expenses={monthExpenses}
          roommates={data.roommates}
          budgets={data.budgets}
          onAddClick={() => setShowAdd(true)}
          onDelete={remove}
        />
      )}

      {tab === 'stats' && (
        <StatsPage
          year={viewYear}
          month={viewMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          monthTotal={monthTotal}
          categoryTotals={categoryTotals}
          roommates={data.roommates}
        />
      )}

      {tab === 'yearly' && (
        <YearlyPage
          year={yearlyYear}
          onPrevYear={handlePrevYear}
          onNextYear={handleNextYear}
          yearTotal={yearTotal}
          monthlyTotals={monthlyTotals}
        />
      )}

      {tab === 'settings' && (
        <SettingsPage
          roommates={data.roommates}
          budgets={data.budgets}
          onSetRoommates={setRoommates}
          onSetBudget={setCategoryBudget}
          onClearAll={clearAll}
        />
      )}

      <TabBar active={tab} onChange={setTab} />

      {showAdd && (
        <AddExpenseModal
          onSubmit={add}
          onClose={() => setShowAdd(false)}
          categoryTotals={categoryTotals}
          budgets={data.budgets}
        />
      )}
    </div>
  );
};

export default App;
