export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  /** ISO date string in yyyy-MM-dd format */
  date: string;
  description: string;
  createdAt: number;
}

export type TransactionDraft = Omit<Transaction, "id" | "createdAt">;

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Transport",
  "Shopping",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Gifts",
  "Other",
] as const;

export const CATEGORIES_BY_TYPE: Record<TransactionType, readonly string[]> = {
  expense: EXPENSE_CATEGORIES,
  income: INCOME_CATEGORIES,
};

export const ALL_CATEGORIES: readonly string[] = Array.from(
  new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])
);
