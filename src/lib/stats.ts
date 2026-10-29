import type { Transaction, TransactionType } from "./types";
import { getMonthShortLabel, monthOf, shiftMonth } from "./format";

export interface MonthStats {
  balance: number;
  income: number;
  expenses: number;
  transactionCount: number;
}

export function sumByType(
  transactions: Transaction[],
  type: TransactionType
): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function computeStats(
  transactions: Transaction[],
  month: string
): MonthStats {
  const balance =
    sumByType(transactions, "income") - sumByType(transactions, "expense");
  const monthTx = transactions.filter((t) => monthOf(t.date) === month);
  return {
    balance,
    income: sumByType(monthTx, "income"),
    expenses: sumByType(monthTx, "expense"),
    transactionCount: monthTx.length,
  };
}

export interface CategorySlice {
  name: string;
  value: number;
  color: string;
}

export function buildCategoryBreakdown(
  transactions: Transaction[],
  month: string
): CategorySlice[] {
  const monthTx = transactions.filter(
    (t) => t.type === "expense" && monthOf(t.date) === month
  );
  const totals = new Map<string, number>();
  for (const t of monthTx) {
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value, color: getCategoryColor(name) }))
    .sort((a, b) => b.value - a.value);
}

export interface TrendPoint {
  month: string;
  income: number;
  expenses: number;
}

export function buildTrend(
  transactions: Transaction[],
  endMonth: string,
  count = 6
): TrendPoint[] {
  const months: string[] = [];
  for (let i = count - 1; i >= 0; i--) months.push(shiftMonth(endMonth, -i));
  return months.map((ym) => {
    const tx = transactions.filter((t) => monthOf(t.date) === ym);
    return {
      month: getMonthShortLabel(ym),
      income: sumByType(tx, "income"),
      expenses: sumByType(tx, "expense"),
    };
  });
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#64748b";
}

const CATEGORY_COLORS: Record<string, string> = {
  // Expenses
  "Food & Dining": "#f97316",
  Groceries: "#84cc16",
  Transport: "#14b8a6",
  Shopping: "#ec4899",
  Housing: "#a855f7",
  Utilities: "#eab308",
  Entertainment: "#f43f5e",
  Health: "#10b981",
  Education: "#8b5cf6",
  Travel: "#d946ef",
  // Income
  Salary: "#10b981",
  Freelance: "#14b8a6",
  Business: "#22c55e",
  Investments: "#a3e635",
  Gifts: "#f472b6",
  // Fallback
  Other: "#64748b",
};
