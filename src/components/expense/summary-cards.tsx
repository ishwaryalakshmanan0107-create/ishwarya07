"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Pencil,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  balance: number;
  monthIncome: number;
  monthExpenses: number;
  monthlyBudget: number;
  monthLabel: string;
  onEditBudget: () => void;
}

export function SummaryCards({
  balance,
  monthIncome,
  monthExpenses,
  monthlyBudget,
  monthLabel,
  onEditBudget,
}: SummaryCardsProps) {
  const hasBudget = monthlyBudget > 0;
  const progress =
    hasBudget && monthExpenses > 0
      ? Math.min(100, (monthExpenses / monthlyBudget) * 100)
      : 0;
  const remaining = monthlyBudget - monthExpenses;
  const overBudget = hasBudget && remaining < 0;
  const nearLimit = hasBudget && !overBudget && progress >= 75;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Total balance — feature card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 p-5 text-white shadow-sm">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-4 h-24 w-24 rounded-full bg-white/10"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/90">Total Balance</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <Wallet className="h-[18px] w-[18px]" />
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">
          {formatCurrency(balance)}
        </p>
        <p className="mt-1 text-xs text-white/80">Across all accounts, all time</p>
      </div>

      {/* Income */}
      <StatCard
        label="Income"
        sublabel={monthLabel}
        value={formatCurrency(monthIncome)}
        icon={ArrowUpRight}
        iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        valueClassName="text-emerald-600 dark:text-emerald-400"
      />

      {/* Expenses */}
      <StatCard
        label="Expenses"
        sublabel={monthLabel}
        value={formatCurrency(monthExpenses)}
        icon={ArrowDownRight}
        iconClassName="bg-rose-500/10 text-rose-600 dark:text-rose-400"
        valueClassName="text-rose-600 dark:text-rose-400"
      />

      {/* Monthly budget */}
      <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Monthly Budget
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEditBudget}
            aria-label="Edit monthly budget"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
        {hasBudget ? (
          <>
            <p className="mt-3 text-2xl font-bold tracking-tight tabular-nums">
              {formatCurrency(monthExpenses)}
              <span className="text-base font-medium text-muted-foreground">
                {" "}
                / {formatCurrency(monthlyBudget)}
              </span>
            </p>
            <Progress
              value={progress}
              aria-label={`${Math.round(progress)}% of monthly budget used`}
              className={cn(
                "mt-3 h-2",
                overBudget
                  ? "[&>div]:bg-rose-500"
                  : nearLimit
                    ? "[&>div]:bg-amber-500"
                    : "[&>div]:bg-emerald-500"
              )}
            />
            <p
              className={cn(
                "mt-2 text-xs font-medium",
                overBudget
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-muted-foreground"
              )}
            >
              {overBudget
                ? `Over budget by ${formatCurrency(Math.abs(remaining))}`
                : `${formatCurrency(remaining)} left this month`}
            </p>
          </>
        ) : (
          <>
            <p className="mt-3 text-2xl font-bold tracking-tight">Not set</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Click the pencil to set a monthly spending limit
            </p>
          </>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  sublabel: string;
  value: string;
  icon: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
}

function StatCard({
  label,
  sublabel,
  value,
  icon: Icon,
  iconClassName,
  valueClassName,
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            iconClassName
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <p
        className={cn(
          "mt-3 text-3xl font-bold tracking-tight tabular-nums",
          valueClassName
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
    </div>
  );
}
