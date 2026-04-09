import { useAuthStore } from "@/store/authStore";
import { usePlannerStore } from "@/store/plannerStore";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function usePlanner() {
  const store = usePlannerStore();
  const token = useAuthStore((s) => s.token);

  const generateItinerary = async (tripId: string) => {
    store.setLoading(true);
    const started = Date.now();
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch("/api/planner", {
        method: "POST",
        headers,
        body: JSON.stringify({ ...store.inputs, tripId }),
      });

      const data = await response.json();

      if (data.status === "strike2") {
        store.setStrike(2);
        store.setMinBudget(data.min_budget);
        return;
      }

      if (data.status === "strike1") {
        store.setStrike(1);
        store.setMinBudget(data.min_budget);
        if (data.itinerary) {
          const elapsed = Date.now() - started;
          if (elapsed < 15_000) await sleep(15_000 - elapsed);
          store.setItinerary(data.itinerary);
          store.setAlternatives(data.alternatives || []);
          store.setSessionId(data.session_id);
        }
        return;
      }

      if (data.itinerary) {
        const elapsed = Date.now() - started;
        if (elapsed < 15_000) await sleep(15_000 - elapsed);
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
