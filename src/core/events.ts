// Core Event Types - Internal canonical event format
export type SystemEventType =
  | "session.started"
  | "session.compacted"
  | "session.idle"
  | "tool.started"
  | "tool.completed"
  | "tool.failed"
  | "file.changed"
  | "task.completed"
  | "task.failed"

export interface SystemEvent {
  id: string
  timestamp: string
  type: SystemEventType
  source: "opencode"
  payload: Record<string, unknown>
}