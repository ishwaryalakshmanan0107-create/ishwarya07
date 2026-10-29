"use client";

import {
  Briefcase,
  Car,
  Clapperboard,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  MoreHorizontal,
  Plane,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryColor } from "@/lib/stats";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Food & Dining": UtensilsCrossed,
  Groceries: ShoppingCart,
  Transport: Car,
  Shopping: ShoppingBag,
  Housing: Home,
  Utilities: Zap,
  Entertainment: Clapperboard,
  Health: HeartPulse,
  Education: GraduationCap,
  Travel: Plane,
  Salary: Wallet,
  Freelance: Laptop,
  Business: Briefcase,
  Investments: TrendingUp,
  Gifts: Gift,
  Other: MoreHorizontal,
};

interface CategoryIconProps {
  category: string;
  className?: string;
  iconClassName?: string;
}

export function CategoryIcon({
  category,
  className,
  iconClassName,
}: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[category] ?? MoreHorizontal;
  const color = getCategoryColor(category);
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        className
      )}
      style={{ color, backgroundColor: `${color}1f` }}
    >
      <Icon className={cn("h-[18px] w-[18px]", iconClassName)} />
    </div>
  );
}
