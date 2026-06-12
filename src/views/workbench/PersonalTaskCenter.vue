<script setup lang="ts">
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue'
import TaskCard from '../../components/task/TaskCard.vue'
import TaskFilterBar from '../../components/task/TaskFilterBar.vue'
import DisposeModal from '../../components/task/DisposeModal.vue'
import CloseModal from '../../components/task/CloseModal.vue'
import ReviewModal from '../../components/task/ReviewModal.vue'
import ReadModal from '../../components/task/ReadModal.vue'
import { initialTasks } from '../../mock/tasks'
import type {
  CloseFormValues,
  DisposeFormValues,
  ReviewFormValues,
  SourceModule,
  TaskAction,
  TaskItem,
  TaskStatus,
} from '../../types/task'

const tasks = ref<TaskItem[]>([...initialTasks])
const sourceFilter = ref<SourceModule | 'all'>('all')
const statusFilter = ref<TaskStatus | 'all'>('all')
const keyword = ref('')

const activeTask = ref<TaskItem | null>(null)
const disposeOpen = ref(false)
const closeOpen = ref(false)
const reviewOpen = ref(false)
const finishOpen = ref(false)

const filteredTasks = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return tasks.value.filter((task) => {
    const matchSource = sourceFilter.value === 'all' || task.sourceModule === sourceFilter.value
    const matchStatus = statusFilter.value === 'all' || task.status === statusFilter.value
    const matchKeyword = !kw || task.title.toLowerCase().includes(kw)
    return matchSource && matchStatus && matchKeyword
  })
})

const statusSummary = computed(() => {
  const summary = {
    pending_dispose: 0,
    pending_review: 0,
    pending_confirm: 0,
  }
  tasks.value.forEach((task) => {
    summary[task.status] += 1
  })
  return summary
})

const summaryStats = computed(() => [
  {
    key: 'pending_dispose',
    label: '待处置',
    value: statusSummary.value.pending_dispose,
    tone: 'error' as const,
    filter: 'pending_dispose' as TaskStatus,
  },
  {
    key: 'pending_review',
    label: '待审核',
    value: statusSummary.value.pending_review,
    tone: 'warning' as const,
    filter: 'pending_review' as TaskStatus,
  },
  {
    key: 'pending_confirm',
    label: '待确认',
    value: statusSummary.value.pending_confirm,
    tone: 'primary' as const,
    filter: 'pending_confirm' as TaskStatus,
  },
  {
    key: 'pending_read',
    label: '待查阅',
    value: statusSummary.value.pending_confirm,
    tone: 'neutral' as const,
    filter: 'pending_confirm' as TaskStatus,
  },
])

function handleStatClick(filter: TaskStatus | 'all') {
  statusFilter.value = statusFilter.value === filter ? 'all' : filter
}

function handleTaskAction(task: TaskItem, action: TaskAction) {
  activeTask.value = task
  if (action === 'dispose') disposeOpen.value = true
  if (action === 'close') closeOpen.value = true
  if (action === 'review') reviewOpen.value = true
  if (action === 'finish') finishOpen.value = true
}

function refreshTaskList(taskId: string, nextStatus: TaskStatus) {
  tasks.value = tasks.value.map((task) =>
    task.id === taskId ? { ...task, status: nextStatus } : task,
  )
}

function removeTask(taskId: string) {
  tasks.value = tasks.value.filter((task) => task.id !== taskId)
}

function handleDisposeSubmit(values: DisposeFormValues) {
  if (!activeTask.value) return
  refreshTaskList(activeTask.value.id, 'pending_review')
  message.success(`处置已提交，完成时间：${values.finishTime}`)
}

function handleCloseSubmit(values: CloseFormValues) {
  if (!activeTask.value) return
  removeTask(activeTask.value.id)
  message.success(`预警已销号：${values.reason}`)
}

function handleReviewSubmit(values: ReviewFormValues) {
  if (!activeTask.value) return
  const nextStatus: TaskStatus = values.result === 'pass' ? 'pending_confirm' : 'pending_dispose'
  refreshTaskList(activeTask.value.id, nextStatus)
  message.success(
    values.result === 'pass' ? '审核通过，待相关人员查阅确认' : '已退回，任务重新进入待处置',
  )
}

function handleFinishConfirm() {
  if (!activeTask.value) return
  removeTask(activeTask.value.id)
  message.success('任务已完结')
}
</script>

<template>
  <div class="task-center">
    <header class="page-header">
      <div>
        <a-breadcrumb>
          <a-breadcrumb-item>工作台</a-breadcrumb-item>
          <a-breadcrumb-item>个人任务中心</a-breadcrumb-item>
        </a-breadcrumb>
        <h1 class="page-title">个人任务中心</h1>
        <p class="page-desc">集中处理来自各业务模块的待办事项，按状态快速处置、审核或查阅。</p>
      </div>
      <div class="page-header__stat">
        <span class="page-header__stat-label">待办总数</span>
        <strong class="page-header__stat-value">{{ tasks.length }}</strong>
      </div>
    </header>

    <section class="summary-grid">
      <button
        v-for="stat in summaryStats"
        :key="stat.key"
        type="button"
        class="stat-card"
        :class="[
          `stat-card--${stat.tone}`,
          { 'stat-card--active': statusFilter === stat.filter },
        ]"
        @click="handleStatClick(stat.filter)"
      >
        <span class="stat-card__label">{{ stat.label }}</span>
        <span class="stat-card__value">{{ stat.value }}</span>
      </button>
    </section>

    <TaskFilterBar
      v-model:source-module="sourceFilter"
      v-model:status="statusFilter"
      v-model:keyword="keyword"
    />

    <section class="task-list">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @action="handleTaskAction"
      />
      <a-empty v-if="filteredTasks.length === 0" description="暂无匹配的任务" />
    </section>

    <DisposeModal
      v-model:open="disposeOpen"
      :task="activeTask"
      @submit="handleDisposeSubmit"
    />
    <CloseModal v-model:open="closeOpen" :task="activeTask" @submit="handleCloseSubmit" />
    <ReviewModal v-model:open="reviewOpen" :task="activeTask" @submit="handleReviewSubmit" />
    <ReadModal v-model:open="finishOpen" :task="activeTask" @confirm="handleFinishConfirm" />
  </div>
</template>

<style scoped>
.task-center {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: var(--color-bg-container);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-component-stroke);
}

.page-title {
  margin: var(--spacing-sm) 0 var(--spacing-3xs);
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.page-desc {
  margin: 0;
  color: var(--color-text-secondary);
}

.page-header__stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-3xs);
  min-width: 88px;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, rgba(22, 119, 255, 0.08), rgba(22, 119, 255, 0.02));
  border: 1px solid rgba(22, 119, 255, 0.12);
  border-radius: var(--radius-lg);
}

.page-header__stat-label {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
}

.page-header__stat-value {
  font-size: 32px;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--color-brand-normal);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-md);
}

.stat-card {
  appearance: none;
  font: inherit;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--color-bg-container);
  border: 1px solid var(--color-component-stroke);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-1);
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-2);
  transform: translateY(-1px);
}

.stat-card--active {
  box-shadow: var(--shadow-2);
}

.stat-card__label {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.stat-card__value {
  font-size: 36px;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.stat-card--error {
  border-top: 3px solid var(--color-error);
}

.stat-card--error .stat-card__value {
  color: var(--color-error);
}

.stat-card--error.stat-card--active {
  border-color: rgba(255, 77, 79, 0.35);
  background: rgba(255, 77, 79, 0.04);
}

.stat-card--warning {
  border-top: 3px solid var(--color-warning);
}

.stat-card--warning .stat-card__value {
  color: var(--color-warning);
}

.stat-card--warning.stat-card--active {
  border-color: rgba(250, 173, 20, 0.4);
  background: rgba(250, 173, 20, 0.06);
}

.stat-card--primary {
  border-top: 3px solid var(--color-brand-normal);
}

.stat-card--primary .stat-card__value {
  color: var(--color-brand-normal);
}

.stat-card--primary.stat-card--active {
  border-color: rgba(22, 119, 255, 0.35);
  background: rgba(22, 119, 255, 0.04);
}

.stat-card--neutral {
  border-top: 3px solid rgba(0, 0, 0, 0.25);
}

.stat-card--neutral .stat-card__value {
  color: var(--color-text-primary);
}

.stat-card--neutral.stat-card--active {
  border-color: rgba(0, 0, 0, 0.2);
  background: var(--color-bg-elevated);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

@media (max-width: 960px) {
  .page-header {
    flex-direction: column;
  }

  .page-header__stat {
    align-items: flex-start;
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .stat-card__value {
    font-size: 30px;
  }
}
</style>
