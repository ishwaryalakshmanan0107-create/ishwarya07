"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  Inbox,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryIcon } from "./category-icon";
import { formatDate, formatCurrency } from "@/lib/format";
import { sumByType } from "@/lib/stats";
import { useExpenseStore } from "@/lib/store";
import { ALL_CATEGORIES, type Transaction, type TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | TransactionType;

interface TransactionListProps {
  onEdit: (transaction: Transaction) => void;
}

export function TransactionList({ onEdit }: TransactionListProps) {
  const transactions = useExpenseStore((s) => s.transactions);
  const deleteTransaction = useExpenseStore((s) => s.deleteTransaction);
  const loadSampleData = useExpenseStore((s) => s.loadSampleData);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions
      .filter((t) => {
        if (typeFilter !== "all" && t.type !== typeFilter) return false;
        if (categoryFilter !== "all" && t.category !== categoryFilter)
          return false;
        if (q) {
          const haystack = `${t.description} ${t.category}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        return b.createdAt - a.createdAt;
      });
  }, [transactions, search, typeFilter, categoryFilter]);

  const filtersActive =
    search.trim() !== "" || typeFilter !== "all" || categoryFilter !== "all";

  const net = filtered.length
    ? sumByType(filtered, "income") - sumByType(filtered, "expense")
    : 0;

  const handleClearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteTransaction(deleteTarget.id);
    toast.success("Transaction deleted");
    setDeleteTarget(null);
  };

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Transactions</CardTitle>
            <CardDescription>
              {filtered.length} of {transactions.length}{" "}
              {transactions.length === 1 ? "record" : "records"}
              {filtered.length > 0 && (
                <span className="ml-1">
                  · Net:{" "}
                  <span
                    className={cn(
                      "font-medium tabular-nums",
                      net > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : net < 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-foreground"
                    )}
                  >
                    {formatCurrency(net)}
                  </span>
                </span>
              )}
            </CardDescription>
          </div>
          {filtersActive && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9"
              onClick={handleClearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Search & filters */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search description or category…"
              className="h-10 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search transactions"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:w-[300px]">
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as TypeFilter)}
            >
              <SelectTrigger className="h-10 w-full sm:w-[140px]" aria-label="Filter by type">
                <span className="flex min-w-0 items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10 w-full sm:w-[150px]" aria-label="Filter by category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">All categories</SelectItem>
                {ALL_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filtered.length === 0 ? (
          transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">No transactions yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Start tracking by adding your first transaction.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => {
                  loadSampleData();
                  toast.success("Sample data loaded");
                }}
              >
                Load sample data
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-12 text-center">
              <Search className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">
                No transactions match your search
              </p>
              <p className="text-xs text-muted-foreground/70">
                Try a different keyword or clear the filters.
              </p>
            </div>
          )
        ) : (
          <ul
            className="max-h-[480px] space-y-1 overflow-y-auto pr-1"
            aria-label="Transaction list"
          >
            {filtered.map((t) => (
              <li
                key={t.id}
                className="group flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border hover:bg-accent/50"
              >
                <CategoryIcon category={t.category} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {t.description || t.category}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Badge
                      variant="secondary"
                      className="h-5 px-1.5 text-[10px] font-medium"
                    >
                      {t.category}
                    </Badge>
                    <span>{formatDate(t.date)}</span>
                  </p>
                </div>
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-sm font-semibold tabular-nums",
                    t.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-foreground"
                  )}
                >
                  {t.type === "income" ? (
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
                <div className="flex shrink-0 items-center gap-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => onEdit(t)}
                    aria-label={`Edit ${t.description || t.category}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteTarget(t)}
                    aria-label={`Delete ${t.description || t.category}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget &&
                `"${deleteTarget.description || deleteTarget.category}" (${formatCurrency(
                  deleteTarget.amount
                )}) will be permanently removed. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
