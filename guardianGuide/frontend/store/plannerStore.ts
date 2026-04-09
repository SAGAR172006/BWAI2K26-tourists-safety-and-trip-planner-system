import { create } from 'zustand';

interface PlannerInputs {
  fromLocation: string;
  toLocation: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  expectations: string;
}

interface PlannerState {
  inputs: PlannerInputs;
  strikeCount: number;
  minBudget: number | null;
  isLoading: boolean;
  itinerary: any | null;
  alternatives: any[];
  sessionId: string | null;
  messages: any[];
  isConfirmed: boolean;
  
  setInput: (field: keyof PlannerInputs, value: any) => void;
  setStrike: (count: number) => void;
  setMinBudget: (budget: number) => void;
  setLoading: (val: boolean) => void;
  setItinerary: (it: any) => void;
  setAlternatives: (alts: any[]) => void;
  setSessionId: (id: string) => void;
}

export const usePlannerStore = create<PlannerState>((set) => ({
  inputs: {
    fromLocation: '',
    toLocation: '',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    budget: 1000,
    currency: 'USD',
    expectations: ''
  },
  strikeCount: 0,
  minBudget: null,
  isLoading: false,
  itinerary: null,
  alternatives: [],
  sessionId: null,
  messages: [],
  isConfirmed: false,
  
  setInput: (field, value) => set((state) => ({ inputs: { ...state.inputs, [field]: value } })),
  setStrike: (count) => set({ strikeCount: count }),
  setMinBudget: (budget) => set({ minBudget: budget }),
  setLoading: (val) => set({ isLoading: val }),
  setItinerary: (it) => set({ itinerary: it }),
  setAlternatives: (alts) => set({ alternatives: alts }),
  setSessionId: (id) => set({ sessionId: id })
}));
