"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES_BY_TYPE,
  type Transaction,
  type TransactionType,
} from "@/lib/types";
import { getTodayISO } from "@/lib/format";
import { useExpenseStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Transaction | null;
}

interface FormErrors {
  amount?: string;
  category?: string;
  date?: string;
}

export function TransactionForm({
  open,
  onOpenChange,
  editing,
}: TransactionFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/*
          Radix unmounts dialog content while closed, so the inner form is a
          fresh mount on every open — state initializers below always run with
          the correct editing transaction (no effects needed).
        */}
        <FormBody editing={editing} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}

function FormBody({
  editing,
  onOpenChange,
}: {
  editing: Transaction | null;
  onOpenChange: (open: boolean) => void;
}) {
  const addTransaction = useExpenseStore((s) => s.addTransaction);
  const updateTransaction = useExpenseStore((s) => s.updateTransaction);

  const [type, setType] = useState<TransactionType>(editing?.type ?? "expense");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [category, setCategory] = useState(editing?.category ?? "");
  const [date, setDate] = useState(editing?.date ?? getTodayISO());
  const [description, setDescription] = useState(editing?.description ?? "");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleTypeChange = (next: TransactionType) => {
    setType(next);
    setCategory("");
  };

  const handleSubmit = () => {
    const nextErrors: FormErrors = {};
    const parsed = Number.parseFloat(amount);
    if (!amount.trim() || Number.isNaN(parsed) || parsed <= 0) {
      nextErrors.amount = "Enter a valid amount greater than 0";
    }
    if (!category) {
      nextErrors.category = "Please select a category";
    }
    if (!date) {
      nextErrors.date = "Please pick a date";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const draft = {
      type,
      amount: Math.round(parsed * 100) / 100,
      category,
      date,
      description: description.trim(),
    };

    if (editing) {
      updateTransaction(editing.id, draft);
      toast.success("Transaction updated");
    } else {
      addTransaction(draft);
      toast.success(
        `${draft.type === "income" ? "Income" : "Expense"} added successfully`
      );
    }
    onOpenChange(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editing ? "Edit Transaction" : "Add Transaction"}
        </DialogTitle>
        <DialogDescription>
          {editing
            ? "Update the details of this transaction."
            : "Record a new income or expense."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Type toggle */}
        <div
          className="grid grid-cols-2 gap-2"
          role="group"
          aria-label="Transaction type"
        >
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            aria-pressed={type === "expense"}
            className={cn(
              "h-10 rounded-lg border text-sm font-medium transition-colors",
              type === "expense"
                ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            aria-pressed={type === "income"}
            className={cn(
              "h-10 rounded-lg border text-sm font-medium transition-colors",
              type === "income"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <Label htmlFor="tx-amount">Amount</Label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
            >
              $
            </span>
            <Input
              id="tx-amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className={cn("pl-7", errors.amount && "border-destructive")}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label htmlFor="tx-category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              id="tx-category"
              aria-label="Category"
              className={cn("w-full", errors.category && "border-destructive")}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES_BY_TYPE[type].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-destructive">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <Label htmlFor="tx-date">Date</Label>
          <Input
            id="tx-date"
            type="date"
            className={cn(errors.date && "border-destructive")}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="tx-description">
            Description{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Input
            id="tx-description"
            placeholder="e.g. Weekly groceries"
            maxLength={120}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {editing ? "Save Changes" : "Add Transaction"}
        </Button>
      </DialogFooter>
    </>
  );
}
