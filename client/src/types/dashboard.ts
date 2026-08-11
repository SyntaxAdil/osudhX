// src/types/dashboard.ts
import { LucideIcon } from "lucide-react";

export interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  isDestructive?: boolean;
}

export interface OrderRow {
  id: string;
  primaryIdentifier: string;
  secondaryDetail: string;
  amount: number;
  status: string;
  date: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  status: "Critical" | "Low";
}

export interface MonthlyDataPoint {
  month: string;
  spent?: number;
  revenue?: number;
}

export interface OrderStatusDataPoint {
  name: string;
  value: number;
}