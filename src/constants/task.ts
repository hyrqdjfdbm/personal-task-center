import type { SourceModule, TaskAction, TaskStatus } from '../types/task'

export const SOURCE_MODULE_LABEL: Record<SourceModule, string> = {
  warning: '预警信息',
  leader_assign: '领导交办',
  coordination: '难题协调',
}

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  pending_dispose: '待处置',
  pending_review: '待审核',
  pending_confirm: '待确认',
}

export const TASK_STATUS_COLOR: Record<TaskStatus, string> = {
  pending_dispose: 'error',
  pending_review: 'warning',
  pending_confirm: 'default',
}

export const SOURCE_MODULE_COLOR: Record<SourceModule, string> = {
  warning: 'orange',
  leader_assign: 'blue',
  coordination: 'purple',
}

export const ACTION_BUTTON_LABEL: Record<TaskAction, string> = {
  dispose: '去处置',
  close: '去销号',
  review: '去审核',
  finish: '完结',
}

export function getTaskAction(status: TaskStatus): TaskAction {
  if (status === 'pending_review') return 'review'
  if (status === 'pending_confirm') return 'finish'
  return 'dispose'
}

export function isWarningPendingDispose(task: { sourceModule: SourceModule; status: TaskStatus }) {
  return task.sourceModule === 'warning' && task.status === 'pending_dispose'
}
