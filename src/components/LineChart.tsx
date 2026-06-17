import React, { useRef, useEffect } from 'react';

interface LineChartProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
  color?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  labels,
  width = 380,
  height = 240,
  color = '#FF6B35',
}) => {
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

    const monthLabels = labels || ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    const padding = { top: 25, right: 20, bottom: 40, left: 10 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...data, 100);

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
      ctx.fillText(val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val.toFixed(0), padding.left + 22, y - 4);
    }

    // Calculate points
    const points = data.map((val, i) => ({
      x: padding.left + 30 + (i / 11) * (chartW - 30),
      y: padding.top + chartH - (val / maxVal) * chartH,
    }));

    // Draw area fill
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, color + '30');
    gradient.addColorStop(1, color + '05');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Draw dots and values
    points.forEach((p, i) => {
      if (data[i] > 0) {
        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        // Value above dot
        ctx.fillStyle = '#333';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        const valText = data[i] >= 1000
          ? (data[i] / 1000).toFixed(1) + 'k'
          : data[i].toFixed(0);
        ctx.fillText(valText, p.x, p.y - 10);
      }

      // Month label
      ctx.fillStyle = '#999';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(monthLabels[i], p.x, padding.top + chartH + 18);
    });
  }, [data, labels, width, height, color]);

  return <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />;
};
