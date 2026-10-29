import type { Transaction, TransactionDraft } from "./types";

/**
 * Generates a realistic set of sample transactions covering the last four
 * months (including the current one). Dates are clamped so the current month
 * never contains future-dated entries.
 */
export function generateSampleTransactions(): Transaction[] {
  const now = new Date();
  const drafts: TransactionDraft[] = [];

  for (let i = 3; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const cap = i === 0 ? now.getDate() : maxDay;
    const day = (n: number) =>
      `${ym}-${String(Math.min(n, cap)).padStart(2, "0")}`;

    drafts.push({
      type: "income",
      amount: 4200,
      category: "Salary",
      date: day(1),
      description: "Monthly salary",
    });

    if (i % 2 === 0 && cap >= 15) {
      drafts.push({
        type: "income",
        amount: 650,
        category: "Freelance",
        date: day(15),
        description: "Freelance design project",
      });
    }

    drafts.push({
      type: "expense",
      amount: 1350,
      category: "Housing",
      date: day(2),
      description: "Rent payment",
    });
    drafts.push({
      type: "expense",
      amount: 96 + ((3 - i) * 7) % 25,
      category: "Utilities",
      date: day(5),
      description: "Electricity, water & internet",
    });
    drafts.push({
      type: "expense",
      amount: 285 + ((3 - i) * 23) % 60,
      category: "Groceries",
      date: day(8),
      description: "Weekly groceries",
    });
    drafts.push({
      type: "expense",
      amount: 84 + i * 6,
      category: "Transport",
      date: day(12),
      description: "Fuel & transit card",
    });
    if (cap >= 14) {
      drafts.push({
        type: "expense",
        amount: 52 + i * 4,
        category: "Food & Dining",
        date: day(14),
        description: "Dinner with friends",
      });
    }
    if (cap >= 18) {
      drafts.push({
        type: "expense",
        amount: 45 + i * 5,
        category: "Entertainment",
        date: day(18),
        description: "Movies & streaming",
      });
    }
    if (cap >= 22) {
      drafts.push({
        type: "expense",
        amount: 120 + i * 15,
        category: "Shopping",
        date: day(22),
        description: "Clothing & essentials",
      });
    }
    if (i === 1 && cap >= 20) {
      drafts.push({
        type: "expense",
        amount: 240,
        category: "Health",
        date: day(20),
        description: "Dental checkup",
      });
    }
    if (i === 2 && cap >= 24) {
      drafts.push({
        type: "expense",
        amount: 380,
        category: "Travel",
        date: day(24),
        description: "Weekend getaway",
      });
    }
  }

  return drafts.map((draft, idx) => ({
    ...draft,
    id: `sample-${idx}`,
    createdAt: Date.now() - idx * 1000,
  }));
}
