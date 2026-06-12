<script setup lang="ts">
import type { SourceModule, TaskAction, TaskStatus } from '../../types/task'
import {
  ACTION_BUTTON_LABEL,
  getTaskAction,
  isWarningPendingDispose,
  SOURCE_MODULE_COLOR,
  SOURCE_MODULE_LABEL,
  TASK_STATUS_COLOR,
  TASK_STATUS_LABEL,
} from '../../constants/task'
import type { TaskItem } from '../../types/task'

defineProps<{
  task: TaskItem
}>()

const emit = defineEmits<{
  action: [task: TaskItem, action: TaskAction]
}>()

function handleAction(task: TaskItem, action: TaskAction) {
  emit('action', task, action)
}
</script>

<template>
  <article class="task-card">
    <div class="task-card__main">
      <div class="task-card__meta">
        <a-tag :color="SOURCE_MODULE_COLOR[task.sourceModule as SourceModule]">
          {{ SOURCE_MODULE_LABEL[task.sourceModule as SourceModule] }}
        </a-tag>
        <a-tag :color="TASK_STATUS_COLOR[task.status as TaskStatus]">
          {{ TASK_STATUS_LABEL[task.status as TaskStatus] }}
        </a-tag>
        <span class="task-card__time">接收时间：{{ task.receiveTime }}</span>
      </div>
      <p class="task-card__project">{{ task.projectName }}</p>
      <h3 class="task-card__title">{{ task.title }}</h3>
    </div>
    <div class="task-card__action">
      <template v-if="isWarningPendingDispose(task)">
        <a-button type="primary" @click="handleAction(task, 'dispose')">
          {{ ACTION_BUTTON_LABEL.dispose }}
        </a-button>
        <a-button @click="handleAction(task, 'close')">
          {{ ACTION_BUTTON_LABEL.close }}
        </a-button>
      </template>
      <a-button
        v-else
        type="primary"
        @click="handleAction(task, getTaskAction(task.status))"
      >
        {{ ACTION_BUTTON_LABEL[getTaskAction(task.status)] }}
      </a-button>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--color-bg-container);
  border: 1px solid var(--color-component-stroke);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-1);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.task-card:hover {
  border-color: rgba(22, 119, 255, 0.25);
  box-shadow: var(--shadow-2);
}

.task-card__main {
  flex: 1;
  min-width: 0;
}

.task-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.task-card__time {
  font-size: var(--font-size-small);
  color: var(--color-text-placeholder);
}

.task-card__project {
  margin: 0 0 var(--spacing-3xs);
  font-size: var(--font-size-base);
  font-weight: 600;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.task-card__title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.task-card__action {
  display: flex;
  flex-shrink: 0;
  gap: var(--spacing-xs);
}
</style>
