import React from 'react';
import { LineChart } from '../components/LineChart';

interface YearlyPageProps {
  year: number;
  onPrevYear: () => void;
  onNextYear: () => void;
  yearTotal: number;
  monthlyTotals: number[];
}

const MONTH_LABELS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

export const YearlyPage: React.FC<YearlyPageProps> = ({
  year, onPrevYear, onNextYear, yearTotal, monthlyTotals,
}) => {
  const nonZeroMonths = monthlyTotals.filter(v => v > 0);
  const avgMonthly = nonZeroMonths.length > 0 ? yearTotal / nonZeroMonths.length : 0;
  const maxMonth = Math.max(...monthlyTotals);
  const maxMonthIdx = monthlyTotals.indexOf(maxMonth);

  return (
    <div className="page">
      <div className="page-inner">
        {/* Year Navigation */}
        <div className="year-nav">
          <button className="year-nav-btn" onClick={onPrevYear}>&lt;</button>
          <span className="year-label">{year}年</span>
          <button className="year-nav-btn" onClick={onNextYear}>&gt;</button>
        </div>

        {/* Summary Cards */}
        <div className="yearly-summary">
          <div className="yearly-summary-card">
            <div className="yearly-summary-value">
              ¥{yearTotal >= 10000
                ? (yearTotal / 10000).toFixed(1) + '万'
                : yearTotal.toFixed(yearTotal % 1 === 0 ? 0 : 0)}
            </div>
            <div className="yearly-summary-label">年度总支出</div>
          </div>
          <div className="yearly-summary-card">
            <div className="yearly-summary-value">
              ¥{avgMonthly >= 1000
                ? (avgMonthly / 1000).toFixed(1) + 'k'
                : avgMonthly.toFixed(0)}
            </div>
            <div className="yearly-summary-label">月均支出</div>
          </div>
        </div>

        {/* Peak month info */}
        {maxMonth > 0 && (
          <div style={{
            background: 'var(--card)', borderRadius: 'var(--radius)', padding: '12px 16px',
            boxShadow: 'var(--shadow)', marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 14,
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>支出最多月份</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
              {maxMonthIdx + 1}月 · ¥{maxMonth.toFixed(maxMonth % 1 === 0 ? 0 : 2)}
            </span>
          </div>
        )}

        {/* Line Chart */}
        <div className="chart-card">
          <div className="chart-title">月度支出趋势</div>
          <div className="chart-container">
            <LineChart
              data={monthlyTotals}
              labels={MONTH_LABELS}
              width={380}
              height={240}
            />
          </div>
        </div>

        {/* Monthly bar list */}
        <div className="monthly-bars">
          <div className="chart-title">各月支出明细</div>
          {monthlyTotals.map((total, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 14, marginBottom: 4,
              }}>
                <span style={{ color: total > 0 ? 'var(--text)' : 'var(--text-hint)' }}>
                  {i + 1}月
                </span>
                <span style={{ fontWeight: total > 0 ? 600 : 400, color: total > 0 ? 'var(--text)' : 'var(--text-hint)' }}>
                  {total > 0 ? `¥${total.toFixed(total % 1 === 0 ? 0 : 2)}` : '-'}
                </span>
              </div>
              <div style={{
                height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: maxMonth > 0 ? (total / maxMonth * 100) + '%' : '0%',
                  background: total > 0 ? 'var(--primary)' : 'transparent',
                  borderRadius: 3,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
