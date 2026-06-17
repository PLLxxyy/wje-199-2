import React, { useState, useMemo } from 'react';
import { CATEGORIES, getTodayStr, getCategoryById } from '../types/Expense';

interface AddExpenseModalProps {
  onSubmit: (category: string, amount: number, note: string, date: string) => void;
  onClose: () => void;
  getCategoryTotals: (year: number, month: number) => Record<string, number>;
  budgets: Record<string, number>;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  onSubmit, onClose, getCategoryTotals, budgets,
}) => {
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayStr());

  const amount = parseFloat(amountStr) || 0;
  const valid = amount > 0;

  const budgetInfo = useMemo(() => {
    const cat = getCategoryById(category);
    const budget = budgets[category] || 0;
    const [yearStr, monthStr] = date.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const categoryTotals = getCategoryTotals(year, month);
    const currentTotal = categoryTotals[category] || 0;
    const newTotal = currentTotal + amount;
    const isOver = budget > 0 && newTotal > budget;
    const percent = budget > 0 ? Math.min((newTotal / budget) * 100, 100) : 0;
    const remaining = budget > 0 ? budget - currentTotal : 0;
    return { cat, budget, month, currentTotal, newTotal, isOver, percent, remaining };
  }, [category, amount, date, getCategoryTotals, budgets]);

  const handleSubmit = () => {
    if (!valid) return;
    onSubmit(category, amount, note.trim(), date);
    onClose();
  };

  const formatAmount = (v: number) => v.toFixed(v % 1 === 0 ? 0 : 2);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-title">新增记录</div>

        <div className="form-row">
          <label className="form-label">选择类别</label>
          <div className="category-grid">
            {CATEGORIES.map(cat => (
              <div
                key={cat.id}
                className={`category-chip ${category === cat.id ? 'selected' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                <span className="category-chip-icon">{cat.icon}</span>
                <span className="category-chip-label">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">金额</label>
          <div className="amount-input-wrapper">
            <span className="yuan-symbol">¥</span>
            <input
              className="form-input"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amountStr}
              onChange={e => setAmountStr(e.target.value)}
              autoFocus
            />
          </div>
          {budgetInfo.budget > 0 && (
            <div className={`budget-hint ${budgetInfo.isOver ? 'budget-hint-over' : ''}`}>
              <div className="budget-hint-row">
                <span>{budgetInfo.month}月已用 ¥{formatAmount(budgetInfo.currentTotal)}</span>
                <span>预算 ¥{formatAmount(budgetInfo.budget)}</span>
              </div>
              <div className="budget-hint-progress">
                <div
                  className="budget-hint-progress-fill"
                  style={{
                    width: `${budgetInfo.percent}%`,
                    background: budgetInfo.isOver ? 'var(--danger)' : budgetInfo.cat.color,
                  }}
                />
              </div>
              <div className="budget-hint-text">
                {budgetInfo.isOver
                  ? `⚠️ 超出预算 ¥${formatAmount(budgetInfo.newTotal - budgetInfo.budget)}`
                  : `还可使用 ¥${formatAmount(Math.max(0, budgetInfo.remaining - amount))}`}
              </div>
            </div>
          )}
        </div>

        <div className="form-row">
          <label className="form-label">备注</label>
          <textarea
            className="form-textarea"
            placeholder="可选，添加备注..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="form-label">日期</label>
          <input
            className="form-date-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <button className="btn-submit" onClick={handleSubmit} disabled={!valid}>
          保存
        </button>
        <button className="btn-cancel" onClick={onClose}>取消</button>
      </div>
    </div>
  );
};
