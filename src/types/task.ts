export type SourceModule = 'warning' | 'leader_assign' | 'coordination'

export type TaskStatus = 'pending_dispose' | 'pending_review' | 'pending_confirm'

export type TaskAction = 'dispose' | 'close' | 'review' | 'finish'

export interface TaskItem {
  id: string
  projectCode: string
  projectName: string
  projectShortName?: string
  sourceModule: SourceModule
  title: string
  status: TaskStatus
  receiveTime: string
  detail?: string
  planFinishTime?: string
}

export interface DisposeFormValues {
  finishTime: string
  opinion: string
}

export interface CloseFormValues {
  reason: string
}

export interface ReviewFormValues {
  result: 'pass' | 'reject'
  comment: string
}
