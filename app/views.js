// Page views for Hartono Budget. Each render function returns HTML;
// main.js mounts it and wires the controls.
import { CATEGORIES, MONTHS, monthLabel } from './data.js';
import {
  state, money, money0, totalsFor, spentByCategory, monthTx, runningBalance, esc,
} from './store.js';
import { barChart, categoryBar } from './charts.js';

function catLabel(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.label : id;
}
function catColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : '#8a8f8c';
}
function monthOptions(selected) {
  return MONTHS.map((m) => `<option value="${m}"${m === selected ? ' selected' : ''}>${monthLabel(m)}</option>`).join('');
}
function fmtDate(d) {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function renderDashboard() {
  const ym = state.month;
  const t = totalsFor(ym);
  const byCat = spentByCategory(ym);
  const maxCat = Math.max(1, ...Object.values(byCat));
  const cats = CATEGORIES.filter((c) => c.id !== 'income' && byCat[c.id])
    .sort((a, b) => byCat[b.id] - byCat[a.id]);
  const recent = [...monthTx(ym)].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const over = cats.filter((c) => byCat[c.id] > (state.budgets[c.id] || 0));
  const savingsRate = t.income > 0 ? Math.round((t.remaining / t.income) * 100) : 0;

  const bills = state.bills.map((b) => `
    <tr><td>${esc(b.name)}<br><span class="stat-sub">${esc(b.note)}</span></td>
    <td class="hide-phone">${fmtDate(b.due)}</td><td class="amt">${money(b.amount)}</td></tr>`).join('');

  return `
  <div class="page-head">
    <div><h1>Dashboard — ${monthLabel(ym)}</h1>
    <p class="lede">How ${'the Hartono family'} is doing this month: money in, money out, and what is left for savings.</p></div>
    <div class="toolbar"><label for="month">Month</label>
      <select id="month" data-action="month">${monthOptions(ym)}</select></div>
  </div>

  <div class="grid cols-3">
    <div class="card"><div class="stat-label">Income</div><div class="stat-value income">${money(t.income)}</div>
      <div class="stat-sub">Salary $4,800 + freelance $650</div></div>
    <div class="card"><div class="stat-label">Spent</div><div class="stat-value spent">${money(t.spent)}</div>
      <div class="stat-sub">${cats.length} spending categories this month</div></div>
    <div class="card"><div class="stat-label">Remaining</div><div class="stat-value">${money(t.remaining)}</div>
      <div class="stat-sub">Savings rate <b>${savingsRate}%</b> of income</div></div>
  </div>

  <div class="grid cols-2" style="margin-top:16px">
    <section class="card"><h2>Where the money went</h2>
      ${cats.map((c) => categoryBar(c.label, byCat[c.id], maxCat, c.color)).join('')}
      <p class="stat-sub" style="margin-top:10px">Housing is the biggest share, as usual — rent alone is ${money0(byCat.housing || 0)} of ${money0(t.spent)} spent.</p>
      ${over.length ? `<p class="note"><strong>Heads up:</strong> ${over.map((c) => catLabel(c.id)).join(', ')} ${over.length > 1 ? 'are' : 'is'} over budget this month. <a href="#/budgets">Review budgets →</a></p>` : '<p class="callout">Every category is within budget this month. Nice work.</p>'}
    </section>
    <section class="card"><h2>Recent transactions</h2>
      <table><thead><tr><th>Date</th><th>What</th><th class="amt">Amount</th></tr></thead><tbody>
      ${recent.map((x) => `<tr><td>${fmtDate(x.date)}</td><td><span class="cat-dot" style="background:${catColor(x.category)}"></span>${esc(x.desc)}</td><td class="amt ${x.type === 'income' ? 'pos' : 'neg'}">${x.type === 'income' ? '+' : '−'}${money(x.amount)}</td></tr>`).join('')}
      </tbody></table>
      <p><a href="#/transactions">See all transactions →</a></p>
    </section>
  </div>

  <div class="grid cols-2" style="margin-top:16px">
    <section class="card"><h2>Upcoming bills</h2>
      <table><thead><tr><th>Bill</th><th class="hide-phone">Due</th><th class="amt">Amount</th></tr></thead><tbody>${bills}</tbody></table>
      <p class="stat-sub">Total coming up: <b>${money(state.bills.reduce((s, b) => s + b.amount, 0))}</b></p>
    </section>
    <section class="card"><h2>Savings goals at a glance</h2>
      ${state.goals.map((g) => {
        const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
        return `<div style="margin:10px 0"><div class="goal-head"><strong>${esc(g.name)}</strong><span class="goal-meta">${money0(g.saved)} of ${money0(g.target)} · ${pct}%</span></div>
        <div class="bar-track" style="margin-top:6px"><div class="bar-fill" style="width:${pct}%"></div></div></div>`;
      }).join('')}
      <p><a href="#/goals">Manage goals →</a></p>
    </section>
  </div>`;
}

export function renderTransactions(filter) {
  const q = (filter.q || '').toLowerCase();
  let rows = runningBalance();
  if (filter.month) rows = rows.filter((t) => t.date.startsWith(filter.month));
  if (filter.category) rows = rows.filter((t) => t.category === filter.category);
  if (q) rows = rows.filter((t) => t.desc.toLowerCase().includes(q));
  rows = [...rows].sort((a, b) => (a.date < b.date ? 1 : -1));

  const catOptions = `<option value="">All categories</option>` + CATEGORIES.map((c) => `<option value="${c.id}"${filter.category === c.id ? ' selected' : ''}>${c.label}</option>`).join('');
  const editing = filter.edit ? state.transactions.find((t) => t.id === filter.edit) : null;

  return `
  <div class="page-head"><div><h1>Transactions</h1>
  <p class="lede">Every dollar in and out, with a running balance. Add a new one below, or edit and delete from the list.</p></div></div>

  <section class="card" style="margin-bottom:16px"><h2>${editing ? 'Edit transaction' : 'Add a transaction'}</h2>
  <form id="tx-form" class="inline-form" data-edit="${editing ? editing.id : ''}">
    <div class="field"><label for="f-date">Date</label><input id="f-date" name="date" type="date" required value="${editing ? editing.date : '2026-11-27'}"></div>
    <div class="field wide"><label for="f-desc">Description</label><input id="f-desc" name="desc" type="text" required maxlength="80" placeholder="e.g. Weekly groceries" value="${editing ? esc(editing.desc) : ''}"></div>
    <div class="field"><label for="f-cat">Category</label><select id="f-cat" name="category">${CATEGORIES.map((c) => `<option value="${c.id}"${editing && editing.category === c.id ? ' selected' : ''}>${c.label}</option>`).join('')}</select></div>
    <div class="field"><label for="f-type">Type</label><select id="f-type" name="type"><option value="expense"${editing && editing.type === 'expense' ? ' selected' : ''}>Expense</option><option value="income"${editing && editing.type === 'income' ? ' selected' : ''}>Income</option></select></div>
    <div class="field"><label for="f-amount">Amount ($)</label><input id="f-amount" name="amount" type="number" min="0.01" step="0.01" required value="${editing ? editing.amount : ''}" placeholder="0.00"></div>
    <div class="field"><button type="submit">${editing ? 'Save changes' : 'Add transaction'}</button>${editing ? ' <a href="#/transactions" class="secondary">Cancel</a>' : ''}</div>
  </form></section>

  <section class="card"><h2>All transactions <span class="stat-sub">(${rows.length} shown)</span></h2>
  <div class="filters">
    <div class="field"><label for="flt-month">Month</label><select id="flt-month" data-filter="month"><option value="">All months</option>${monthOptions(filter.month || '')}</select></div>
    <div class="field"><label for="flt-cat">Category</label><select id="flt-cat" data-filter="category">${catOptions}</select></div>
    <div class="field"><label for="flt-q">Search</label><input id="flt-q" data-filter="q" type="search" placeholder="Search description…" value="${esc(filter.q || '')}"></div>
    <button class="secondary small" data-action="reset-data" type="button">Reset demo data</button>
  </div>
  <table><thead><tr><th>Date</th><th>Description</th><th class="hide-phone">Category</th><th class="amt">Amount</th><th class="amt hide-phone">Balance</th><th></th></tr></thead><tbody>
  ${rows.map((x) => `<tr>
    <td>${fmtDate(x.date)}</td>
    <td>${esc(x.desc)}</td>
    <td class="hide-phone"><span class="cat-dot" style="background:${catColor(x.category)}"></span>${catLabel(x.category)}</td>
    <td class="amt ${x.type === 'income' ? 'pos' : 'neg'}">${x.type === 'income' ? '+' : '−'}${money(x.amount)}</td>
    <td class="amt hide-phone">${money(x.balance)}</td>
    <td style="white-space:nowrap"><a href="#/transactions?edit=${x.id}">Edit</a> · <a href="#/transactions" data-delete="${x.id}">Delete</a></td>
  </tr>`).join('') || '<tr><td colspan="6">No transactions match these filters.</td></tr>'}
  </tbody></table></section>`;
}

export function renderBudgets() {
  const ym = state.month;
  const byCat = spentByCategory(ym);
  const rows = CATEGORIES.filter((c) => c.id !== 'income').map((c) => {
    const budget = state.budgets[c.id] || 0;
    const spent = byCat[c.id] || 0;
    const left = budget - spent;
    const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
    const status = spent > budget ? ['over', 'Over budget'] : pct >= 85 ? ['warn', 'Almost there'] : ['ok', 'On track'];
    return `<div class="budget-row">
      <span class="b-name"><span class="cat-dot" style="background:${c.color}"></span>${c.label}</span>
      <span><span class="bar-track" style="display:block"><span class="bar-fill ${status[0] === 'over' ? 'red' : status[0] === 'warn' ? 'amber' : ''}" style="display:block;width:${Math.min(100, pct)}%"></span></span>
      <span class="stat-sub" style="margin-top:4px">${money0(spent)} of ${money0(budget)} · ${pct}%</span></span>
      <span class="b-nums">${left >= 0 ? money(left) + ' left' : money(-left) + ' over'} <span class="pill ${status[0]}">${status[1]}</span></span>
      <span class="b-edit"><label style="display:inline">Budget $<input type="number" min="0" step="1" value="${budget}" data-budget="${c.id}" aria-label="Monthly budget for ${c.label}"></label></span>
    </div>`;
  }).join('');

  const totalBudget = Object.values(state.budgets).reduce((a, b) => a + b, 0);
  const totalSpent = totalsFor(ym).spent;
  return `
  <div class="page-head"><div><h1>Budgets — ${monthLabel(ym)}</h1>
  <p class="lede">A monthly limit for each category. Change any amount and it saves straight away.</p></div>
  <div class="toolbar"><label for="month">Month</label><select id="month" data-action="month">${monthOptions(ym)}</select></div></div>

  <div class="grid cols-3" style="margin-bottom:16px">
    <div class="card"><div class="stat-label">Total budgeted</div><div class="stat-value">${money(totalBudget)}</div><div class="stat-sub">Across ${CATEGORIES.length - 1} categories</div></div>
    <div class="card"><div class="stat-label">Total spent</div><div class="stat-value spent">${money(totalSpent)}</div><div class="stat-sub">${Math.round((totalSpent / Math.max(1, totalBudget)) * 100)}% of the plan used</div></div>
    <div class="card"><div class="stat-label">Budget left</div><div class="stat-value">${money(totalBudget - totalSpent)}</div><div class="stat-sub">${totalBudget - totalSpent >= 0 ? 'Still inside the plan' : 'Over the plan — see the red rows'}</div></div>
  </div>

  <section class="card"><h2>Monthly limits by category</h2>${rows}
  <p class="stat-sub" style="margin-top:12px">Tip: a category that keeps going over is not a failure — it is the budget telling you the limit was wrong. Raise it, and cut somewhere else.</p></section>`;
}

export function renderGoals() {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <div class="page-head"><div><h1>Savings goals</h1>
  <p class="lede">What the family is saving for — and how close each goal is. Add funds whenever there is money left over.</p></div></div>

  <div class="grid cols-3" style="margin-bottom:16px">
    <div class="card"><div class="stat-label">Total saved</div><div class="stat-value">${money(totalSaved)}</div><div class="stat-sub">Across ${state.goals.length} goals</div></div>
    <div class="card"><div class="stat-label">Total target</div><div class="stat-value">${money(totalTarget)}</div><div class="stat-sub">${Math.round((totalSaved / Math.max(1, totalTarget)) * 100)}% of the way there</div></div>
    <div class="card"><div class="stat-label">Still to save</div><div class="stat-value">${money(totalTarget - totalSaved)}</div><div class="stat-sub">At $300 a month, about ${Math.ceil((totalTarget - totalSaved) / 300)} months to go</div></div>
  </div>

  <div class="grid cols-2">
  ${state.goals.map((g) => {
    const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
    return `<section class="card"><div class="goal-head"><h2>${esc(g.name)}</h2><span class="pill ${pct >= 100 ? 'ok' : pct >= 50 ? 'warn' : 'over'}">${pct}%</span></div>
    <p>${esc(g.note)}</p>
    <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
    <p class="goal-meta" style="margin-top:8px">${money(g.saved)} saved of ${money(g.target)} — ${money(g.target - g.saved)} to go</p>
    <form class="toolbar" data-goal="${g.id}"><label>Add funds $<input type="number" name="amount" min="1" step="1" required placeholder="100" style="width:110px"></label><button type="submit" class="small">Add funds</button></form>
    </section>`;
  }).join('')}
  </div>

  <section class="card" style="margin-top:16px"><h2>Create a new goal</h2>
  <form id="goal-form" class="inline-form">
    <div class="field wide"><label for="g-name">Goal name</label><input id="g-name" name="name" type="text" required maxlength="60" placeholder="e.g. New washing machine"></div>
    <div class="field"><label for="g-target">Target ($)</label><input id="g-target" name="target" type="number" min="1" step="1" required placeholder="1000"></div>
    <div class="field"><label for="g-saved">Already saved ($)</label><input id="g-saved" name="saved" type="number" min="0" step="1" value="0"></div>
    <div class="field wide"><label for="g-note">Why this goal?</label><input id="g-note" name="note" type="text" maxlength="120" placeholder="A short note to future-you"></div>
    <div class="field"><button type="submit">Create goal</button></div>
  </form></section>`;
}

export function renderReports() {
  const months = MONTHS;
  const cols = [];
  const rows = months.map((ym) => {
    const t = totalsFor(ym);
    cols.push(
      { label: monthLabel(ym).split(' ')[0] + ' in', value: t.income, className: '' },
    );
    return t;
  });
  const trendCols = [];
  months.forEach((ym, i) => {
    const t = rows[i];
    trendCols.push({ label: monthLabel(ym).split(' ')[0], value: t.spent, className: 'spent' });
  });
  const savedCols = months.map((ym, i) => ({ label: monthLabel(ym).split(' ')[0], value: Math.max(0, rows[i].remaining), className: 'saved' }));

  const allSpent = {};
  for (const t of state.transactions) {
    if (t.type === 'expense') allSpent[t.category] = (allSpent[t.category] || 0) + t.amount;
  }
  const topCats = Object.entries(allSpent).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxTop = Math.max(1, ...topCats.map(([, v]) => v));
  const biggest = [...state.transactions].filter((t) => t.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 5);
  const totalIncome = rows.reduce((s, r) => s + r.income, 0);
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
  const avgSaved = Math.round(rows.reduce((s, r) => s + Math.max(0, r.remaining), 0) / months.length);

  return `
  <div class="page-head"><div><h1>Reports &amp; insights</h1>
  <p class="lede">Three months of the Hartono household, September to November 2026 — trends, top spending and what to do about it.</p></div></div>

  <div class="grid cols-3" style="margin-bottom:16px">
    <div class="card"><div class="stat-label">Income (3 months)</div><div class="stat-value income">${money(totalIncome)}</div><div class="stat-sub">Salary + freelance, steady each month</div></div>
    <div class="card"><div class="stat-label">Spent (3 months)</div><div class="stat-value spent">${money(totalSpent)}</div><div class="stat-sub">Average ${money(Math.round(totalSpent / 3))} a month</div></div>
    <div class="card"><div class="stat-label">Saved per month (avg)</div><div class="stat-value">${money(avgSaved)}</div><div class="stat-sub">Savings rate ${Math.round((avgSaved / Math.max(1, totalIncome / 3)) * 100)}% of monthly income</div></div>
  </div>

  <div class="grid cols-2">
    <section class="card"><h2>Monthly spending trend</h2>
      ${barChart(trendCols)}
      <div class="legend"><span><i style="background:#e8a33d"></i>Spent</span><span><i style="background:#1d5c43"></i>Income (see table)</span></div>
      <table style="margin-top:10px"><thead><tr><th>Month</th><th class="amt">Income</th><th class="amt">Spent</th><th class="amt">Saved</th></tr></thead><tbody>
      ${months.map((ym, i) => `<tr><td>${monthLabel(ym)}</td><td class="amt pos">${money(rows[i].income)}</td><td class="amt neg">${money(rows[i].spent)}</td><td class="amt">${money(rows[i].remaining)}</td></tr>`).join('')}
      </tbody></table></section>
    <section class="card"><h2>Saved each month</h2>
      ${barChart(savedCols)}
      <p class="stat-sub">November saved the most so far — ${money(rows[2].remaining)} — because freelance income was up and dining stayed low.</p>
      <h2 style="margin-top:18px">Top spending categories (3 months)</h2>
      ${topCats.map(([id, v]) => categoryBar(catLabel(id), v, maxTop, catColor(id))).join('')}
    </section>
  </div>

  <div class="grid cols-2" style="margin-top:16px">
    <section class="card"><h2>Biggest single expenses</h2>
      <table><thead><tr><th>Date</th><th>What</th><th class="amt">Amount</th></tr></thead><tbody>
      ${biggest.map((x) => `<tr><td>${fmtDate(x.date)}</td><td>${esc(x.desc)}</td><td class="amt neg">${money(x.amount)}</td></tr>`).join('')}
      </tbody></table></section>
    <section class="card"><h2>What the numbers say</h2>
      <p><strong>Rent is the anchor.</strong> Housing takes about ${Math.round(((allSpent.housing || 0) / Math.max(1, totalSpent)) * 100)}% of all spending — there is little to cut there, so savings have to come from the flexible categories.</p>
      <p><strong>Groceries are steady.</strong> Around ${money0(596)} a month, week after week. Meal planning is already working; the win here is avoiding the extra top-up shop.</p>
      <p><strong>Dining out is the lever.</strong> Two family meals a month cost about ${money0(280)}. One fewer restaurant visit a month frees roughly $70 — enough to finish the school-fees goal two months early.</p>
      <p><strong>Keep the streak.</strong> Three months in a row with money left over. Move the leftover to a goal on payday, before it can drift into impulse spending.</p>
    </section>
  </div>`;
}
