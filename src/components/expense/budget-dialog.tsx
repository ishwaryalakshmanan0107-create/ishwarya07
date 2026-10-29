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
import { useExpenseStore } from "@/lib/store";

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BudgetDialog({ open, onOpenChange }: BudgetDialogProps) {
  const monthlyBudget = useExpenseStore((s) => s.monthlyBudget);
  const setMonthlyBudget = useExpenseStore((s) => s.setMonthlyBudget);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <BudgetBody
          monthlyBudget={monthlyBudget}
          setMonthlyBudget={setMonthlyBudget}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}

function BudgetBody({
  monthlyBudget,
  setMonthlyBudget,
  onOpenChange,
}: {
  monthlyBudget: number;
  setMonthlyBudget: (budget: number) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [value, setValue] = useState(
    monthlyBudget > 0 ? String(monthlyBudget) : ""
  );
  const [error, setError] = useState("");

  const handleSave = () => {
    const parsed = Number.parseFloat(value);
    if (!value.trim() || Number.isNaN(parsed) || parsed < 0) {
      setError("Enter a valid budget amount");
      return;
    }
    setMonthlyBudget(Math.round(parsed * 100) / 100);
    toast.success(
      parsed > 0 ? "Monthly budget updated" : "Monthly budget removed"
    );
    onOpenChange(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Set Monthly Budget</DialogTitle>
        <DialogDescription>
          Set a spending limit for each month. You can change it anytime.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-1.5">
        <Label htmlFor="budget-amount">Budget limit</Label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
          >
            $
          </span>
          <Input
            id="budget-amount"
            type="number"
            inputMode="decimal"
            step="10"
            min="0"
            placeholder="e.g. 2500"
            className={`pl-7 ${error ? "border-destructive" : ""}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">
          Enter 0 to remove the budget.
        </p>
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Budget</Button>
      </DialogFooter>
    </>
  );
}
