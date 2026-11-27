# Hartono Budget — Household Budget Site

[![Make.fun competition](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457/)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/sitopberkah-blip/household-budget-mf-20261126/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457/)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/sitopberkah-blip/household-budget-mf-20261126/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457/)

A working household budget planner for a fictional family — the Hartonos of Bandung — built as plain static files with no network requests. Open `app/index.html` in any browser, on desktop or phone, and it just works.

## What it does

- **Dashboard** — month selector, income vs spending vs remaining, category breakdown bars, recent transactions, upcoming bills, savings goals at a glance.
- **Transactions** — add, edit and delete transactions (date, description, category, amount, income/expense), filter by category, month or search, with a running balance. Seeded with realistic September–November 2026 data.
- **Budgets** — a monthly limit per category with spent/remaining bars, over-budget warnings and editable amounts.
- **Goals** — savings goals with progress bars, add funds, and create new goals.
- **Reports** — monthly trend, top categories, biggest expenses, and plain-language insights about where the money goes.

Changes are saved in the browser's localStorage — nothing leaves your device.

## Run it locally

```sh
node serve.ts
# then open http://localhost:8080
```

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Built as an entry for the [make.fun best household budget site competition](https://make.fun/bounty/best-household-budget-site-20261126-1457).

## License

MIT — see [LICENSE](LICENSE).
