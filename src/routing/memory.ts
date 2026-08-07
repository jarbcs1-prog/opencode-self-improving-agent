// Memory Integration - Routing learns from outcomes
export interface RoutingOutcome {
  task_id: string
  chosen_agent: string
  expected_score: number
  actual_result: boolean
  verification_score: number
  cost: number
  lesson: string
}

export class RoutingMemory {
  private history: RoutingOutcome[] = []

  recordOutcome(outcome: RoutingOutcome) {
    this.history.push(outcome)
  }

  getPerformance(agent: string): { success_rate: number; avg_cost: number } {
    const agentHistory = this.history.filter(h => h.chosen_agent === agent)
    if (agentHistory.length === 0) return { success_rate: 0, avg_cost: 0 }
    return {
      success_rate: agentHistory.filter(h => h.actual_result).length / agentHistory.length,
      avg_cost: agentHistory.reduce((sum, h) => sum + h.cost, 0) / agentHistory.length
    }
  }
}