import { usePlannerStore } from '@/store/plannerStore';

export function usePlanner() {
  const store = usePlannerStore();
  
  const generateItinerary = async (tripId: string) => {
    store.setLoading(true);
    try {
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...store.inputs, tripId })
      });
      
      const data = await response.json();
      
      if (data.status === 'strike1') {
        store.setStrike(1);
        store.setMinBudget(data.min_budget);
      } else if (data.status === 'strike2') {
        store.setStrike(2);
        store.setMinBudget(data.min_budget);
      } else {
        store.setItinerary(data.itinerary);
        store.setAlternatives(data.alternatives || []);
        store.setSessionId(data.session_id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      store.setLoading(false);
    }
  };

  return { generateItinerary };
}
