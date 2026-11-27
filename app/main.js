// App entry: hash routing and control wiring for Hartono Budget.
import { state, save, addTransaction, updateTransaction, deleteTransaction, setBudget, addFunds, addGoal, resetToSeed } from './store.js';
import { renderDashboard, renderTransactions, renderBudgets, renderGoals, renderReports } from './views.js';

const app = document.getElementById('app');
const txFilter = { month: '', category: '', q: '', edit: '' };

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const params = new URLSearchParams(queryPart || '');
  return { page: pathPart || '', edit: params.get('edit') || '' };
}

function render() {
  const { page, edit } = parseHash();
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const name = a.getAttribute('data-nav');
    a.classList.toggle('active', (page === '' && name === 'dashboard') || page === name);
  });
  if (page === 'transactions') {
    txFilter.edit = edit;
    app.innerHTML = renderTransactions(txFilter);
  } else if (page === 'budgets') {
    app.innerHTML = renderBudgets();
  } else if (page === 'goals') {
    app.innerHTML = renderGoals();
  } else if (page === 'reports') {
    app.innerHTML = renderReports();
  } else {
    app.innerHTML = renderDashboard();
  }
  window.scrollTo(0, 0);
}

function rerender(keepScroll) {
  const y = window.scrollY;
  render();
  if (keepScroll) window.scrollTo(0, y);
}

app.addEventListener('change', (e) => {
  const el = e.target;
  if (el.matches('[data-action="month"]')) {
    state.month = el.value;
    save();
    render();
  } else if (el.matches('[data-filter="month"]')) {
    txFilter.month = el.value;
    rerender(true);
  } else if (el.matches('[data-filter="category"]')) {
    txFilter.category = el.value;
    rerender(true);
  } else if (el.matches('[data-budget]')) {
    setBudget(el.getAttribute('data-budget'), Number(el.value));
    rerender(true);
  }
});

app.addEventListener('input', (e) => {
  const el = e.target;
  if (el.matches('[data-filter="q"]')) {
    txFilter.q = el.value;
    const y = window.scrollY;
    app.innerHTML = renderTransactions(txFilter);
    const box = document.getElementById('flt-q');
    if (box) { box.focus(); box.setSelectionRange(box.value.length, box.value.length); }
    window.scrollTo(0, y);
  }
});

app.addEventListener('click', (e) => {
  const del = e.target.closest('[data-delete]');
  if (del) {
    e.preventDefault();
    deleteTransaction(del.getAttribute('data-delete'));
    render();
    return;
  }
  const reset = e.target.closest('[data-action="reset-data"]');
  if (reset) {
    if (window.confirm('Restore the original demo data? Your changes will be lost.')) {
      resetToSeed();
      render();
    }
  }
});

app.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  if (form.id === 'tx-form') {
    const data = new FormData(form);
    const tx = {
      date: String(data.get('date')),
      desc: String(data.get('desc')).trim(),
      category: String(data.get('category')),
      type: String(data.get('type')),
      amount: Math.round(Number(data.get('amount')) * 100) / 100,
    };
    if (!tx.desc || !(tx.amount > 0) || !tx.date) return;
    const editId = form.getAttribute('data-edit');
    if (editId) updateTransaction(editId, tx);
    else addTransaction(tx);
    txFilter.edit = '';
    location.hash = '#/transactions';
    render();
  } else if (form.id === 'goal-form') {
    const data = new FormData(form);
    const goal = {
      name: String(data.get('name')).trim(),
      target: Math.round(Number(data.get('target'))),
      saved: Math.round(Number(data.get('saved')) || 0),
      note: String(data.get('note')).trim() || 'A new goal for the family.',
    };
    if (!goal.name || !(goal.target > 0)) return;
    addGoal(goal);
    render();
  } else if (form.hasAttribute('data-goal')) {
    const data = new FormData(form);
    const amount = Math.round(Number(data.get('amount')) || 0);
    if (amount > 0) {
      addFunds(form.getAttribute('data-goal'), amount);
      render();
    }
  }
});

window.addEventListener('hashchange', render);
render();
