import React, { useState } from 'react';
import { CATEGORIES, getTodayStr } from '../types/Expense';

interface AddExpenseModalProps {
  onSubmit: (category: string, amount: number, note: string, date: string) => void;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ onSubmit, onClose }) => {
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayStr());

  const amount = parseFloat(amountStr) || 0;
  const valid = amount > 0;

  const handleSubmit = () => {
    if (!valid) return;
    onSubmit(category, amount, note.trim(), date);
    onClose();
  };

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
