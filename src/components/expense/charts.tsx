"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { CategorySlice, TrendPoint } from "@/lib/stats";

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  color: "var(--popover-foreground)",
  fontSize: "0.8125rem",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
};

interface ChartsProps {
  breakdown: CategorySlice[];
  trend: TrendPoint[];
  totalSpent: number;
  monthLabel: string;
}

export function ExpenseCharts({
  breakdown,
  trend,
  totalSpent,
  monthLabel,
}: ChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Spending by Category</CardTitle>
          <p className="text-xs text-muted-foreground">{monthLabel}</p>
        </CardHeader>
        <CardContent>
          {breakdown.length === 0 ? (
            <EmptyChart message={`No expenses recorded for ${monthLabel} yet.`} />
          ) : (
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative h-52 w-52 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="64%"
                      outerRadius="92%"
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {breakdown.map((slice) => (
                        <Cell key={slice.name} fill={slice.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        "Spent",
                      ]}
                      contentStyle={TOOLTIP_STYLE}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Spent
                  </span>
                  <span className="text-xl font-bold tabular-nums">
                    {formatCurrency(totalSpent)}
                  </span>
                </div>
              </div>
              <ul
                className="w-full space-y-1.5 overflow-y-auto pr-1"
                aria-label="Expense breakdown by category"
              >
                {breakdown.map((slice) => {
                  const pct = totalSpent
                    ? (slice.value / totalSpent) * 100
                    : 0;
                  return (
                    <li
                      key={slice.name}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: slice.color }}
                      />
                      <span className="min-w-0 flex-1 truncate text-muted-foreground">
                        {slice.name}
                      </span>
                      <span className="tabular-nums font-medium">
                        {formatCurrency(slice.value)}
                      </span>
                      <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                        {Math.round(pct)}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Income vs Expenses</CardTitle>
          <p className="text-xs text-muted-foreground">Last 6 months</p>
        </CardHeader>
        <CardContent>
          <div className="h-56 w-full sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} barGap={4}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tick={{ fill: "var(--muted-foreground)" }}
                />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip
                  cursor={{ fill: "var(--accent)", opacity: 0.6 }}
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    name === "income" ? "Income" : "Expenses",
                  ]}
                />
                <Bar
                  dataKey="income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={26}
                />
                <Bar
                  dataKey="expenses"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={26}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-emerald-500"
              />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-rose-500"
              />
              Expenses
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-52 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center">
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
      <p className="text-xs text-muted-foreground/70">
        Add an expense to see the breakdown.
      </p>
    </div>
  );
}
