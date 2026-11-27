// Seed data for the Hartono household budget. Realistic multi-month figures
// (September–November 2026) so every page has real numbers to show.
export const HOUSEHOLD = {
  name: 'The Hartono Family',
  members: 'Rina & Budi Hartono, with Maya (9) and Dimas (6)',
  home: 'A three-bedroom house in Bandung',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#1d5c43' },
  { id: 'groceries', label: 'Groceries', color: '#2e8b6a' },
  { id: 'utilities', label: 'Utilities', color: '#4a90a4' },
  { id: 'transport', label: 'Transport', color: '#7a6fb0' },
  { id: 'dining', label: 'Dining out', color: '#e8a33d' },
  { id: 'entertainment', label: 'Entertainment', color: '#c96a9b' },
  { id: 'health', label: 'Health', color: '#b3402e' },
  { id: 'kids', label: 'Kids & school', color: '#5a7d2a' },
  { id: 'clothing', label: 'Clothing', color: '#8a6d3b' },
  { id: 'other', label: 'Other', color: '#8a8f8c' },
  { id: 'income', label: 'Income', color: '#1d5c43' },
];

export const MONTHS = ['2026-09', '2026-10', '2026-11'];
export const DEFAULT_MONTH = '2026-11';

export function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Monthly category budgets (November 2026 plan).
export const DEFAULT_BUDGETS = {
  housing: 1480, groceries: 620, utilities: 240, transport: 260,
  dining: 180, entertainment: 120, health: 150, kids: 220, clothing: 90, other: 100,
};

export const SEED_GOALS = [
  { id: 'g-emergency', name: 'Emergency fund', target: 6000, saved: 4350, note: 'Six months of essentials, kept in a separate savings account.' },
  { id: 'g-vacation', name: 'Family holiday — Yogyakarta', target: 2400, saved: 1180, note: 'Train tickets, hotel and food for four, planned for June 2027.' },
  { id: 'g-car', name: 'Replace the family car', target: 9000, saved: 2740, note: 'The 2014 sedan is on its last legs; saving $300 a month toward it.' },
  { id: 'g-school', name: "Maya's school fees", target: 1500, saved: 900, note: 'Next school year fees, due in July 2027.' },
];

export const SEED_BILLS = [
  { name: 'Rent', amount: 1450, due: '2026-12-01', category: 'housing', note: 'Due on the 1st' },
  { name: 'Electricity (PLN)', amount: 96, due: '2026-12-05', category: 'utilities', note: 'Estimated from October usage' },
  { name: 'Internet & TV', amount: 59, due: '2026-12-08', category: 'utilities', note: 'Fiber 100 Mbps' },
  { name: 'Water', amount: 34, due: '2026-12-10', category: 'utilities', note: 'PDAM bill' },
  { name: 'Car insurance', amount: 112, due: '2026-12-15', category: 'transport', note: 'Monthly premium' },
  { name: 'Maya piano lessons', amount: 80, due: '2026-12-18', category: 'kids', note: 'Four lessons a month' },
];

// Transactions: { id, date: 'YYYY-MM-DD', desc, category, type: 'income'|'expense', amount }
// amount is always positive; type decides the sign.
export const SEED_TRANSACTIONS = [
  // ---- September 2026 ----
  { id: 't-s01', date: '2026-09-01', desc: 'Salary — Budi (PT Nusantara)', category: 'income', type: 'income', amount: 4800 },
  { id: 't-s02', date: '2026-09-01', desc: 'Rent — September', category: 'housing', type: 'expense', amount: 1450 },
  { id: 't-s03', date: '2026-09-03', desc: 'Weekly groceries — Super Indo', category: 'groceries', type: 'expense', amount: 142 },
  { id: 't-s04', date: '2026-09-05', desc: 'Electricity bill', category: 'utilities', type: 'expense', amount: 91 },
  { id: 't-s05', date: '2026-09-07', desc: 'Petrol — Shell', category: 'transport', type: 'expense', amount: 48 },
  { id: 't-s06', date: '2026-09-09', desc: 'Freelance design — Rina', category: 'income', type: 'income', amount: 520 },
  { id: 't-s07', date: '2026-09-10', desc: 'Weekly groceries — Hypermart', category: 'groceries', type: 'expense', amount: 158 },
  { id: 't-s08', date: '2026-09-12', desc: 'Dinner at Sate House', category: 'dining', type: 'expense', amount: 64 },
  { id: 't-s09', date: '2026-09-14', desc: 'Kids school supplies', category: 'kids', type: 'expense', amount: 73 },
  { id: 't-s10', date: '2026-09-16', desc: 'Internet & TV', category: 'utilities', type: 'expense', amount: 59 },
  { id: 't-s11', date: '2026-09-18', desc: 'Weekly groceries — Super Indo', category: 'groceries', type: 'expense', amount: 129 },
  { id: 't-s12', date: '2026-09-20', desc: 'Cinema — family movie night', category: 'entertainment', type: 'expense', amount: 42 },
  { id: 't-s13', date: '2026-09-22', desc: 'Pharmacy — flu medicine', category: 'health', type: 'expense', amount: 28 },
  { id: 't-s14', date: '2026-09-24', desc: 'Bus & ride-hailing', category: 'transport', type: 'expense', amount: 61 },
  { id: 't-s15', date: '2026-09-26', desc: 'Weekly groceries — market', category: 'groceries', type: 'expense', amount: 117 },
  { id: 't-s16', date: '2026-09-27', desc: 'Dimas birthday gift', category: 'other', type: 'expense', amount: 55 },
  { id: 't-s17', date: '2026-09-29', desc: 'Car service — oil change', category: 'transport', type: 'expense', amount: 130 },
  // ---- October 2026 ----
  { id: 't-o01', date: '2026-10-01', desc: 'Salary — Budi (PT Nusantara)', category: 'income', type: 'income', amount: 4800 },
  { id: 't-o02', date: '2026-10-01', desc: 'Rent — October', category: 'housing', type: 'expense', amount: 1450 },
  { id: 't-o03', date: '2026-10-02', desc: 'Weekly groceries — Super Indo', category: 'groceries', type: 'expense', amount: 151 },
  { id: 't-o04', date: '2026-10-05', desc: 'Electricity bill', category: 'utilities', type: 'expense', amount: 104 },
  { id: 't-o05', date: '2026-10-06', desc: 'Freelance design — Rina', category: 'income', type: 'income', amount: 610 },
  { id: 't-o06', date: '2026-10-08', desc: 'Petrol — Shell', category: 'transport', type: 'expense', amount: 52 },
  { id: 't-o07', date: '2026-10-09', desc: 'Weekly groceries — Hypermart', category: 'groceries', type: 'expense', amount: 167 },
  { id: 't-o08', date: '2026-10-11', desc: 'Dentist — Maya check-up', category: 'health', type: 'expense', amount: 85 },
  { id: 't-o09', date: '2026-10-13', desc: 'School fees — term 2', category: 'kids', type: 'expense', amount: 190 },
  { id: 't-o10', date: '2026-10-15', desc: 'Internet & TV', category: 'utilities', type: 'expense', amount: 59 },
  { id: 't-o11', date: '2026-10-16', desc: 'Weekly groceries — Super Indo', category: 'groceries', type: 'expense', amount: 143 },
  { id: 't-o12', date: '2026-10-18', desc: 'Lunch out — family weekend', category: 'dining', type: 'expense', amount: 78 },
  { id: 't-o13', date: '2026-10-20', desc: 'New shoes — Dimas', category: 'clothing', type: 'expense', amount: 46 },
  { id: 't-o14', date: '2026-10-22', desc: 'Streaming subscriptions', category: 'entertainment', type: 'expense', amount: 29 },
  { id: 't-o15', date: '2026-10-24', desc: 'Weekly groceries — market', category: 'groceries', type: 'expense', amount: 138 },
  { id: 't-o16', date: '2026-10-26', desc: 'Petrol — Shell', category: 'transport', type: 'expense', amount: 49 },
  { id: 't-o17', date: '2026-10-28', desc: 'Dinner with friends', category: 'dining', type: 'expense', amount: 57 },
  { id: 't-o18', date: '2026-10-30', desc: 'Water bill', category: 'utilities', type: 'expense', amount: 33 },
  // ---- November 2026 ----
  { id: 't-n01', date: '2026-11-01', desc: 'Salary — Budi (PT Nusantara)', category: 'income', type: 'income', amount: 4800 },
  { id: 't-n02', date: '2026-11-01', desc: 'Rent — November', category: 'housing', type: 'expense', amount: 1450 },
  { id: 't-n03', date: '2026-11-02', desc: 'Weekly groceries — Super Indo', category: 'groceries', type: 'expense', amount: 148 },
  { id: 't-n04', date: '2026-11-04', desc: 'Electricity bill', category: 'utilities', type: 'expense', amount: 98 },
  { id: 't-n05', date: '2026-11-05', desc: 'Petrol — Shell', category: 'transport', type: 'expense', amount: 51 },
  { id: 't-n06', date: '2026-11-06', desc: 'Maya piano lessons', category: 'kids', type: 'expense', amount: 80 },
  { id: 't-n07', date: '2026-11-08', desc: 'Weekly groceries — Hypermart', category: 'groceries', type: 'expense', amount: 161 },
  { id: 't-n08', date: '2026-11-09', desc: 'Freelance design — Rina', category: 'income', type: 'income', amount: 650 },
  { id: 't-n09', date: '2026-11-10', desc: 'Dinner at Sate House', category: 'dining', type: 'expense', amount: 71 },
  { id: 't-n10', date: '2026-11-12', desc: 'Internet & TV', category: 'utilities', type: 'expense', amount: 59 },
  { id: 't-n11', date: '2026-11-13', desc: 'Weekly groceries — Super Indo', category: 'groceries', type: 'expense', amount: 155 },
  { id: 't-n12', date: '2026-11-14', desc: 'Cinema — family movie night', category: 'entertainment', type: 'expense', amount: 46 },
  { id: 't-n13', date: '2026-11-16', desc: 'Pharmacy — vitamins', category: 'health', type: 'expense', amount: 34 },
  { id: 't-n14', date: '2026-11-17', desc: 'Bus & ride-hailing', category: 'transport', type: 'expense', amount: 58 },
  { id: 't-n15', date: '2026-11-18', desc: 'Weekly groceries — market', category: 'groceries', type: 'expense', amount: 132 },
  { id: 't-n16', date: '2026-11-19', desc: 'School books — Dimas', category: 'kids', type: 'expense', amount: 42 },
  { id: 't-n17', date: '2026-11-20', desc: 'Winter jackets — kids', category: 'clothing', type: 'expense', amount: 88 },
  { id: 't-n18', date: '2026-11-21', desc: 'Lunch out — family weekend', category: 'dining', type: 'expense', amount: 69 },
  { id: 't-n19', date: '2026-11-23', desc: 'Petrol — Shell', category: 'transport', type: 'expense', amount: 47 },
  { id: 't-n20', date: '2026-11-24', desc: 'Weekly groceries — Super Indo', category: 'groceries', type: 'expense', amount: 149 },
  { id: 't-n21', date: '2026-11-25', desc: 'Streaming subscriptions', category: 'entertainment', type: 'expense', amount: 29 },
  { id: 't-n22', date: '2026-11-26', desc: 'Water bill', category: 'utilities', type: 'expense', amount: 36 },
];
