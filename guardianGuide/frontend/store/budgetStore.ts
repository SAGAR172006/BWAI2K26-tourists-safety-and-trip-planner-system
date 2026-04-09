import { create } from "zustand";

export interface Expense {
  id: string;
  tripId: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
}

interface BudgetState {
  expenses: Expense[];
  totalBudget: number;
  currency: string;
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  setTotalBudget: (budget: number) => void;
  setCurrency: (currency: string) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  expenses: [],
  totalBudget: 0,
  currency: "USD",
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) =>
    set((s) => ({ expenses: [...s.expenses, expense] })),
  removeExpense: (id) =>
    set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
  setTotalBudget: (totalBudget) => set({ totalBudget }),
  setCurrency: (currency) => set({ currency }),
}));
