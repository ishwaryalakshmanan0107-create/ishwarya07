"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Wallet,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useMounted } from "@/hooks/use-mounted";
import { BudgetDialog } from "@/components/expense/budget-dialog";
import { ExpenseCharts } from "@/components/expense/charts";
import { SummaryCards } from "@/components/expense/summary-cards";
import { ThemeToggle } from "@/components/expense/theme-toggle";
import { TransactionForm } from "@/components/expense/transaction-form";
import { TransactionList } from "@/components/expense/transaction-list";
import {
  getCurrentMonthKey,
  getMonthLabel,
  shiftMonth,
} from "@/lib/format";
import {
  buildCategoryBreakdown,
  buildTrend,
  computeStats,
} from "@/lib/stats";
import { useExpenseStore } from "@/lib/store";
import type { Transaction } from "@/lib/types";

export default function Home() {
  const transactions = useExpenseStore((s) => s.transactions);
  const monthlyBudget = useExpenseStore((s) => s.monthlyBudget);
  const clearAllTransactions = useExpenseStore((s) => s.clearAllTransactions);

  // localStorage-backed store needs one frame before it rehydrates on client.
  const mounted = useMounted();
  const [month, setMonth] = useState(getCurrentMonthKey);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [budgetOpen, setBudgetOpen] = useState(false);

  const stats = useMemo(
    () => computeStats(transactions, month),
    [transactions, month]
  );
  const breakdown = useMemo(
    () => buildCategoryBreakdown(transactions, month),
    [transactions, month]
  );
  const trend = useMemo(() => buildTrend(transactions, month), [transactions, month]);

  const monthLabel = getMonthLabel(month);
  const isCurrentMonth = month === getCurrentMonthKey();

  const openAddForm = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (tx: Transaction) => {
    setEditing(tx);
    setFormOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <h1 className="text-base font-bold tracking-tight sm:text-lg">
                Expense Tracker
              </h1>
              <p className="hidden text-[11px] text-muted-foreground sm:block">
                Income, expenses &amp; budgets — all in one place
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Button onClick={openAddForm} className="h-10 gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Overview + month navigation */}
        <section aria-labelledby="overview-heading" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2
                id="overview-heading"
                className="text-xl font-bold tracking-tight sm:text-2xl"
              >
                Overview
              </h2>
              <p className="text-sm text-muted-foreground">
                {isCurrentMonth
                  ? "Your finances at a glance this month"
                  : `Viewing an earlier month: ${monthLabel}`}
              </p>
            </div>
            <div
              className="flex items-center gap-1 rounded-xl border bg-card p-1 shadow-sm"
              role="group"
              aria-label="Select month"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setMonth((m) => shiftMonth(m, -1))}
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex min-w-[140px] items-center justify-center gap-1.5 text-sm font-semibold tabular-nums">
                <CalendarDays
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                {monthLabel}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setMonth((m) => shiftMonth(m, 1))}
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {mounted ? (
            <>
              <SummaryCards
                balance={stats.balance}
                monthIncome={stats.income}
                monthExpenses={stats.expenses}
                monthlyBudget={monthlyBudget}
                monthLabel={monthLabel}
                onEditBudget={() => setBudgetOpen(true)}
              />
              <ExpenseCharts
                breakdown={breakdown}
                trend={trend}
                totalSpent={stats.expenses}
                monthLabel={monthLabel}
              />
            </>
          ) : (
            <DashboardSkeleton />
          )}
        </section>

        {/* Transactions */}
        <section aria-labelledby="transactions-heading" className="scroll-mt-24">
          <h2 id="transactions-heading" className="sr-only">
            Transactions
          </h2>
          {mounted ? (
            <TransactionList onEdit={openEditForm} />
          ) : (
            <div className="space-y-3 rounded-xl border bg-card p-6 shadow-sm">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <p>
            Expense Tracker · Your data is stored locally in your browser —
            nothing leaves your device.
          </p>
          {mounted && transactions.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear all data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all transactions?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All {transactions.length}{" "}
                    {transactions.length === 1 ? "record" : "records"} will be
                    permanently deleted from this browser. This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-white hover:bg-destructive/90"
                    onClick={() => {
                      clearAllTransactions();
                      toast.success("All transactions cleared");
                    }}
                  >
                    Delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </footer>

      {/* Dialogs */}
      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
      />
      <BudgetDialog open={budgetOpen} onOpenChange={setBudgetOpen} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[132px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[352px] rounded-xl" />
        <Skeleton className="h-[352px] rounded-xl" />
      </div>
    </div>
  );
}
