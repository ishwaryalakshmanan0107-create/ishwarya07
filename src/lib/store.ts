"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Transaction, TransactionDraft } from "./types";
import { generateSampleTransactions } from "./sample";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface ExpenseStore {
  transactions: Transaction[];
  /** Monthly budget limit applied to every month. 0 means "not set". */
  monthlyBudget: number;
  addTransaction: (draft: TransactionDraft) => void;
  updateTransaction: (id: string, draft: TransactionDraft) => void;
  deleteTransaction: (id: string) => void;
  setMonthlyBudget: (budget: number) => void;
  loadSampleData: () => void;
  clearAllTransactions: () => void;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      // Sample data is only visible until the user's own persisted state
      // exists; once persisted, zustand replaces it with the stored data.
      transactions: generateSampleTransactions(),
      monthlyBudget: 2500,

      addTransaction: (draft) =>
        set((state) => ({
          transactions: [
            { ...draft, id: uid(), createdAt: Date.now() },
            ...state.transactions,
          ],
        })),

      updateTransaction: (id, draft) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...draft } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setMonthlyBudget: (budget) => set({ monthlyBudget: budget }),

      loadSampleData: () => set({ transactions: generateSampleTransactions() }),

      clearAllTransactions: () => set({ transactions: [] }),
    }),
    {
      name: "expense-tracker-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
