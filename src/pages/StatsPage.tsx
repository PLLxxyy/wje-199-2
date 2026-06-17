import React, { useMemo } from 'react';
import { CATEGORIES } from '../types/Expense';
import { BarChart } from '../components/BarChart';

interface StatsPageProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  monthTotal: number;
  categoryTotals: Record<string, number>;
  roommates: number;
}

export const StatsPage: React.FC<StatsPageProps> = ({
  year, month, onPrevMonth, onNextMonth,
  monthTotal, categoryTotals, roommates,
}) => {
  const monthLabel = `${year}年${month}月`;

  const sortedCategories = useMemo(() => {
    return CATEGORIES
      .map(cat => ({
        ...cat,
        amount: categoryTotals[cat.id] || 0,
        pct: monthTotal > 0 ? ((categoryTotals[cat.id] || 0) / monthTotal * 100) : 0,
      }))
      .filter(c => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [categoryTotals, monthTotal]);

  const hasData = monthTotal > 0;

  return (
    <div className="page">
      <div className="page-inner">
        {/* Month nav */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 20, marginBottom: 16, padding: '8px 0'
        }}>
          <button className="month-nav-btn" onClick={onPrevMonth}
            style={{ background: '#F0F0F0', color: '#333' }}>&lt;</button>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{monthLabel}</span>
          <button className="month-nav-btn" onClick={onNextMonth}
            style={{ background: '#F0F0F0', color: '#333' }}>&gt;</button>
        </div>

        {/* Total */}
        <div className="stats-total-bar">
          <div className="stats-total-value">¥{monthTotal.toFixed(monthTotal % 1 === 0 ? 0 : 2)}</div>
          <div className="stats-total-label">本月总支出</div>
        </div>

        {/* Bar Chart */}
        <div className="chart-card">
          <div className="chart-title">分类支出柱状图</div>
          <div className="chart-container">
            <BarChart data={categoryTotals} width={340} height={220} />
          </div>
        </div>

        {/* Category proportion list */}
        {hasData && (
          <div className="chart-card">
            <div className="chart-title">各类别占比</div>
            {sortedCategories.map(cat => (
              <div key={cat.id} style={{ marginBottom: 12 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 14, marginBottom: 4
                }}>
                  <span>{cat.icon} {cat.name}</span>
                  <span style={{ fontWeight: 600 }}>
                    ¥{cat.amount.toFixed(cat.amount % 1 === 0 ? 0 : 2)}
                    <span style={{ color: '#999', fontSize: 12, marginLeft: 4 }}>
                      ({cat.pct.toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <div style={{
                  height: 8, background: '#F0F0F0', borderRadius: 4, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: cat.pct + '%',
                    background: cat.color,
                    borderRadius: 4,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Split per person */}
        {hasData && (
          <div className="split-card">
            <div className="split-header">
              <span className="split-title">每人分摊</span>
              <span className="split-badge">{roommates}人均分</span>
            </div>
            <div className="split-amount">
              <span className="yuan">¥</span>
              {(monthTotal / roommates).toFixed(2)}
            </div>
            <div className="split-desc">
              总支出 ¥{monthTotal.toFixed(2)} ÷ {roommates}人
            </div>
          </div>
        )}

        {!hasData && (
          <div className="chart-card" style={{ textAlign: 'center', color: '#999' }}>
            暂无数据
          </div>
        )}
      </div>
    </div>
  );
};
