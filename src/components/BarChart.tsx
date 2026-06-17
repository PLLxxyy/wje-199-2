import React, { useRef, useEffect } from 'react';
import { CATEGORIES, getCategoryById } from '../types/Expense';

interface BarChartProps {
  data: Record<string, number>;
  width?: number;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, width = 360, height = 220 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const entries = CATEGORIES
      .map(cat => ({ ...cat, amount: data[cat.id] || 0 }))
      .filter(e => e.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    if (entries.length === 0) {
      ctx.fillStyle = '#999';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('暂无数据', width / 2, height / 2);
      return;
    }

    const padding = { top: 30, right: 20, bottom: 50, left: 10 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...entries.map(e => e.amount));
    const barCount = entries.length;
    const barGap = Math.min(16, chartW * 0.08);
    const barWidth = Math.min(48, (chartW - barGap * (barCount + 1)) / barCount);
    const totalBarsWidth = barCount * barWidth + (barCount + 1) * barGap;
    const offsetX = padding.left + (chartW - totalBarsWidth) / 2;

    // Draw grid lines
    const gridLines = 4;
    ctx.strokeStyle = '#F0F0F0';
    ctx.lineWidth = 1;
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#BBB';
    ctx.textAlign = 'right';
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      const val = maxVal - (maxVal / gridLines) * i;
      ctx.fillText(val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toFixed(0), padding.left - 2, y - 4);
    }

    // Draw bars
    entries.forEach((entry, i) => {
      const x = offsetX + barGap + i * (barWidth + barGap);
      const barH = (entry.amount / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      // Bar shadow
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      const radius = Math.min(6, barWidth / 2);
      roundedRect(ctx, x + 2, y + 2, barWidth, barH, radius);
      ctx.fill();

      // Bar
      ctx.fillStyle = entry.color;
      roundedRect(ctx, x, y, barWidth, barH, radius);
      ctx.fill();

      // Value on top
      ctx.fillStyle = '#333';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      const valText = entry.amount >= 1000
        ? (entry.amount / 1000).toFixed(1) + 'k'
        : entry.amount.toFixed(entry.amount % 1 === 0 ? 0 : 1);
      ctx.fillText(valText, x + barWidth / 2, y - 6);

      // Icon below
      ctx.font = '18px sans-serif';
      ctx.fillText(entry.icon, x + barWidth / 2, padding.top + chartH + 22);

      // Label below icon
      ctx.fillStyle = '#999';
      ctx.font = '10px sans-serif';
      ctx.fillText(entry.name, x + barWidth / 2, padding.top + chartH + 40);
    });
  }, [data, width, height]);

  return <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />;
};

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
