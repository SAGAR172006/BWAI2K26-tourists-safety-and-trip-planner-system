— LangSmith + Ragas Evaluation

## Purpose
Achieve 95%+ accuracy in safety scores and trip planning. Automatically detect and fix model drift.

## LangSmith Tracing

```python
# evaluation/langsmith_tracer.py

from langsmith import Client, traceable

client = Client()

@traceable(name="planner_agent_run", tags=["planner", "production"])
async def run_planner_with_trace(state: PlannerState) -> PlannerState:
    """Wraps the LangGraph execution in a LangSmith trace"""
    
    # CRITICAL: Log every Two-Strike event
    if state["strike_count"] > 0:
        client.create_feedback(
            run_id=current_run_id,
            key="budget_strike",
            score=state["strike_count"],
            comment=f"Strike {state['strike_count']}: budget {state['budget']} < min {state['min_budget']}"
        )
    
    # Log sentiment score calculation
    if "zone_score" in state:
        client.create_feedback(
            run_id=current_run_id,
            key="sentiment_score",
            score=state["zone_score"],
            comment=f"Zone: {state['zone']} | Samples: {state['sample_size']}"
        )
    
    return await planner_graph.ainvoke(state)
```

## Ragas Evaluation Test Suite

```python
# evaluation/ragas_evaluator.py

from ragas import evaluate
from ragas.metrics import context_precision, faithfulness, answer_relevancy

# Test case structure
test_dataset = {
    "question": ["Is Montmartre safe at night?"],
    "contexts": [["Montmartre crime reports...", "Reddit posts..."]],  # RAG context used
    "answer": ["Based on our analysis, Montmartre scores 3.2..."],    # Model output
    "ground_truth": ["Montmartre is generally safe with moderate vigilance"]
}

results = evaluate(
    dataset=test_dataset,
    metrics=[
        context_precision,    # Is the crime report data relevant to the question?
        faithfulness,         # Is the chatbot hallucinating safety scores?
        answer_relevancy,     # Is the answer actually useful?
    ]
)

# Target scores:
# context_precision > 0.90   (map data must be relevant)
# faithfulness > 0.95        (no hallucinated safety numbers)
# answer_relevancy > 0.85    (answers must be useful)
```

## The Feedback Loop

```
1. Run Ragas evaluation weekly (or on deploy)
2. If faithfulness < 0.95:
   → Review failed cases in LangSmith UI
   → Identify which safety scores were hallucinated
   → Add real examples to RAG corpus (crime_reports/ folder)
   → Re-run evaluation
3. If context_precision < 0.90:
   → Review which retrieved chunks are irrelevant
   → Improve ChromaDB chunk size / overlap settings
   → Re-embed corpus
4. Automated: feedback_loop.py runs ragas → if score drops → opens GitHub issue with details
```

---