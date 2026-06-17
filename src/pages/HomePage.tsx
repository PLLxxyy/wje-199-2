import React, { useState, useMemo } from 'react';
import { CATEGORIES, getCategoryById } from '../types/Expense';
import { Expense } from '../types/Expense';

interface HomePageProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  monthTotal: number;
  categoryTotals: Record<string, number>;
  expenses: Expense[];
  roommates: number;
  budgets: Record<string, number>;
  onAddClick: () => void;
  onDelete: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  year, month, onPrevMonth, onNextMonth,
  monthTotal, categoryTotals, expenses,
  roommates, budgets, onAddClick, onDelete,
}) => {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [showSplit, setShowSplit] = useState(false);

  const monthLabel = `${year}年${month}月`;

  const categoryItems = useMemo(() => {
    return CATEGORIES
      .map(cat => {
        const total = categoryTotals[cat.id] || 0;
        const budget = budgets[cat.id] || 0;
        const percent = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
        const isOver = budget > 0 && total > budget;
        return {
          ...cat,
          total,
          budget,
          percent,
          isOver,
          count: expenses.filter(e => e.category === cat.id).length,
        };
      })
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [categoryTotals, expenses, budgets]);

  const overBudgetItems = useMemo(() => {
    return categoryItems.filter(item => item.isOver);
  }, [categoryItems]);

  const perPerson = roommates > 0 ? monthTotal / roommates : 0;

  const groupedExpenses = useMemo(() => {
    if (!expandedCat) return [];
    return expenses
      .filter(e => e.category === expandedCat)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  }, [expenses, expandedCat]);

  const formatAmount = (v: number) => v.toFixed(v % 1 === 0 ? 0 : 2);

  return (
    <div className="page">
      <div className="page-inner">
        {/* Month total card */}
        <div className="total-card">
          <div className="month-nav">
            <button className="month-nav-btn" onClick={onPrevMonth}>&lt;</button>
            <span className="month-label">{monthLabel}</span>
            <button className="month-nav-btn" onClick={onNextMonth}>&gt;</button>
          </div>
          <div className="total-label">本月总支出</div>
          <div className="total-amount">
            <span className="yuan">¥</span>
            {formatAmount(monthTotal)}
          </div>
        </div>

        {/* Category breakdown */}
        {categoryItems.length > 0 ? (
          <>
            {overBudgetItems.length > 0 && (
              <div className="over-budget-alert">
                <div className="over-budget-title">
                  <span className="over-budget-icon">⚠️</span>
                  <span>本月超支提醒</span>
                </div>
                <div className="over-budget-list">
                  {overBudgetItems.map(item => (
                    <div key={item.id} className="over-budget-item">
                      <span>{item.icon} {item.name}</span>
                      <span className="over-budget-amount">超 ¥{formatAmount(item.total - item.budget)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="section-title">分类明细</div>
            <div className="cat-card">
              {categoryItems.map(item => (
                <React.Fragment key={item.id}>
                  <div
                    className={`cat-item ${item.isOver ? 'cat-item-over' : ''}`}
                    onClick={() => setExpandedCat(expandedCat === item.id ? null : item.id)}
                  >
                    <div
                      className="cat-icon"
                      style={{ background: item.color + '18' }}
                    >
                      {item.icon}
                    </div>
                    <div className="cat-info">
                      <div className="cat-name-row">
                        <span className="cat-name">{item.name}</span>
                        {item.isOver && <span className="cat-over-badge">超支</span>}
                      </div>
                      <div className="cat-count">{item.count}笔 · 预算 ¥{formatAmount(item.budget)}</div>
                      {item.budget > 0 && (
                        <div className="cat-progress-bar">
                          <div
                            className="cat-progress-fill"
                            style={{
                              width: `${item.percent}%`,
                              background: item.isOver ? 'var(--danger)' : item.color,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="cat-amount-wrap">
                      <div className={`cat-amount ${item.isOver ? 'cat-amount-over' : ''}`}>
                        ¥{formatAmount(item.total)}
                      </div>
                      {item.budget > 0 && (
                        <div className="cat-budget-info">
                          {item.isOver
                            ? `超支 ¥${formatAmount(item.total - item.budget)}`
                            : `剩余 ¥${formatAmount(item.budget - item.total)}`}
                        </div>
                      )}
                    </div>
                  </div>
                  {expandedCat === item.id && groupedExpenses.length > 0 && (
                    <>
                      {groupedExpenses.map(exp => (
                        <div className="expense-row" key={exp.id}>
                          <span className="expense-date">{exp.date.slice(5)}</span>
                          <span className="expense-note">{exp.note || '-'}</span>
                          <span className="expense-amount">¥{formatAmount(exp.amount)}</span>
                          <button
                            className="expense-delete"
                            onClick={(e) => { e.stopPropagation(); onDelete(exp.id); }}
                            title="删除"
                          >✕</button>
                        </div>
                      ))}
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        ) : (
          <div className="cat-card">
            <div className="cat-empty">
              暂无记录，点击右上角 + 开始记账
            </div>
          </div>
        )}

        {/* Cost split section */}
        {monthTotal > 0 && (
          <>
            <div style={{ height: 16 }} />
            <div className="split-card">
              <div className="split-header">
                <span className="split-title">合租分摊</span>
                <span className="split-badge">{roommates}人合租</span>
              </div>
              <div className="split-amount">
                <span className="yuan">¥</span>
                {formatAmount(perPerson)}
              </div>
              <div className="split-desc">每人应付 (共{roommates}人均摊)</div>
              <button className="split-toggle" onClick={() => setShowSplit(!showSplit)}>
                {showSplit ? '收起明细' : '查看分类明细'}
              </button>
              {showSplit && (
                <div style={{ marginTop: 8 }}>
                  {categoryItems.map(item => (
                    <div className="split-detail-row" key={item.id}>
                      <span>{item.icon} {item.name}</span>
                      <span className="split-detail-amount">
                        ¥{formatAmount(item.total / roommates)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
