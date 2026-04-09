"use client";
import { useState, useCallback } from "react";

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
}

/**
 * Hook for managing trip budget and expenses.
 */
export function useBudget(tripId: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);

  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - spent;
  const percentUsed = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setExpenses((prev) => [
      ...prev,
      { ...expense, id: crypto.randomUUID() },
    ]);
  }, []);

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const loadBudget = useCallback(async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      if (res.ok) {
        const data = await res.json();
        setTotalBudget(data.budget ?? 0);
        setExpenses(data.expenses ?? []);
      }
    } catch (err) {
      console.error("Failed to load budget:", err);
    }
  }, [tripId]);

  return {
    expenses,
    totalBudget,
    spent,
    remaining,
    percentUsed,
    addExpense,
    removeExpense,
    loadBudget,
    setTotalBudget,
  };
}
