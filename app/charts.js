// Tiny chart helpers: pure HTML/CSS bars, no library, no canvas, no network.
import { money0 } from './store.js';

// Vertical bar chart: cols = [{ label, value, className }], values in dollars.
export function barChart(cols) {
  const max = Math.max(1, ...cols.map((c) => c.value));
  const bars = cols.map((c) => {
    const h = Math.max(2, Math.round((c.value / max) * 100));
    return `<div class="chart-col"><span class="chart-val">${money0(c.value)}</span>` +
      `<div class="chart-bar ${c.className || ''}" style="height:${h}%"></div>` +
      `<span class="chart-lab">${c.label}</span></div>`;
  }).join('');
  return `<div class="chart-wrap" role="img" aria-label="Bar chart">${bars}</div>`;
}

// Horizontal category bar row used on dashboard and reports.
export function categoryBar(label, amount, max, color) {
  const pct = max > 0 ? Math.min(100, Math.round((amount / max) * 100)) : 0;
  return `<div class="bar-row"><span class="bar-cat"><span class="cat-dot" style="background:${color}"></span>${label}</span>` +
    `<span class="bar-track"><span class="bar-fill" style="display:block;width:${pct}%;background:${color}"></span></span>` +
    `<span class="bar-amt">${money0(amount)}</span></div>`;
}
