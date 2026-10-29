# ishwarya07

A simple, modern **Expense Tracker** web app — track income and expenses, set a monthly budget, and visualize your spending. All data is stored locally in your browser.

## Features

- **Dashboard** — Total balance, monthly income, expenses, and monthly budget with a color-coded progress bar
- **Transactions CRUD** — Add, edit, and delete income & expense records with amount, category, date, and description
- **Charts** — Spending-by-category donut chart and a 6-month income vs. expenses bar chart
- **Search & filters** — Search descriptions, filter by type (income/expense) and category
- **Monthly budget** — Set a spending limit; the progress bar turns amber near the limit and red when exceeded
- **Month navigation** — Browse stats and charts for any month with ‹ › arrows
- **Light / dark mode** — Theme toggle with system preference support
- **Fully responsive** — Clean, touch-friendly layout on mobile, tablet, and desktop
- **Local-first** — Data persists in your browser via `localStorage`; nothing leaves your device

## Tech Stack

| Layer     | Technology                     |
| --------- | ------------------------------ |
| Framework | Next.js 16 (App Router), React 19 |
| Language  | TypeScript 5                   |
| Styling   | Tailwind CSS 4, shadcn/ui      |
| State     | Zustand (persist middleware → localStorage) |
| Charts    | Recharts                       |
| Icons     | Lucide React                   |
| Toasts    | Sonner                         |

## Getting Started

### Prerequisites

- Node.js 18.18+ or Bun 1.x

### Install & run

```bash
# install dependencies
bun install   # or: npm install

# start the dev server
bun run dev   # or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Lint

```bash
bun run lint  # or: npm run lint
```

## Project Structure

```
src/
├── app/                    # App Router pages, layout, global styles
├── components/
│   ├── expense/            # Feature components
│   │   ├── summary-cards.tsx    # Dashboard stat cards
│   │   ├── charts.tsx           # Donut + bar charts
│   │   ├── transaction-form.tsx # Add/edit dialog
│   │   ├── transaction-list.tsx # Search, filters, list
│   │   ├── budget-dialog.tsx    # Monthly budget editor
│   │   ├── category-icon.tsx    # Category icon/color map
│   │   └── theme-toggle.tsx     # Dark mode toggle
│   └── ui/                 # shadcn/ui primitives
├── hooks/                  # useMounted helper
└── lib/                    # Types, store, formatting, stats
```

## Data & Privacy

Transactions and the monthly budget are saved to your browser's `localStorage` under the key `expense-tracker-storage`. You can clear everything at any time using the **Clear all data** button in the footer. The app works fully offline after the initial load.

## License

MIT
