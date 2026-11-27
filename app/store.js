// State store: loads the seed data, keeps user edits in localStorage, and
// offers the small calculations every view needs.
import {
  SEED_TRANSACTIONS, SEED_GOALS, SEED_BILLS, DEFAULT_BUDGETS, DEFAULT_MONTH,
} from './data.js';

const KEY = 'hartono-budget-v1';

function clone(x) { return JSON.parse(JSON.stringify(x)); }

function seedState() {
  return {
    transactions: clone(SEED_TRANSACTIONS),
    goals: clone(SEED_GOALS),
    bills: clone(SEED_BILLS),
    budgets: { ...DEFAULT_BUDGETS },
    month: DEFAULT_MONTH,
  };
}

function loadStored() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const state = loadStored() || seedState();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
}

export function resetToSeed() {
  const fresh = seedState();
  state.transactions = fresh.transactions;
  state.goals = fresh.goals;
  state.bills = fresh.bills;
  state.budgets = fresh.budgets;
  save();
}

export function money(n) {
  const v = Math.abs(n);
  const s = '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n < 0 ? '-' + s : s;
}

export function money0(n) {
  return '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
}

export function monthOf(dateStr) { return dateStr.slice(0, 7); }

export function monthTx(ym) {
  return state.transactions.filter((t) => monthOf(t.date) === ym);
}

export function totalsFor(ym) {
  let income = 0; let spent = 0;
  for (const t of monthTx(ym)) {
    if (t.type === 'income') income += t.amount; else spent += t.amount;
  }
  return { income, spent, remaining: income - spent };
}

export function spentByCategory(ym) {
  const out = {};
  for (const t of monthTx(ym)) {
    if (t.type !== 'expense') continue;
    out[t.category] = (out[t.category] || 0) + t.amount;
  }
  return out;
}

export function runningBalance() {
  const sorted = [...state.transactions].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  let balance = 0;
  return sorted.map((t) => {
    balance += t.type === 'income' ? t.amount : -t.amount;
    return { ...t, balance };
  });
}

export function addTransaction(t) {
  const id = 't-u' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  state.transactions.push({ ...t, id });
  save();
  return id;
}

export function updateTransaction(id, patch) {
  const t = state.transactions.find((x) => x.id === id);
  if (t) Object.assign(t, patch);
  save();
}

export function deleteTransaction(id) {
  state.transactions = state.transactions.filter((x) => x.id !== id);
  save();
}

export function setBudget(category, amount) {
  state.budgets[category] = Math.max(0, Math.round(amount) || 0);
  save();
}

export function addFunds(goalId, amount) {
  const g = state.goals.find((x) => x.id === goalId);
  if (g) g.saved = Math.min(g.target, Math.max(0, g.saved + amount));
  save();
}

export function addGoal(goal) {
  const id = 'g-u' + Date.now().toString(36);
  state.goals.push({ ...goal, id });
  save();
  return id;
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
