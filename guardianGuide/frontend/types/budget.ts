export interface Expense {
  id: string;
  tripId: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  createdAt?: string;
}

export interface BudgetSummary {
  totalBudget: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  currency: string;
}
