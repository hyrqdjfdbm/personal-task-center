<script setup lang="ts">
import type { TaskItem } from '../../types/task'
import { SOURCE_MODULE_LABEL, TASK_STATUS_LABEL } from '../../constants/task'

defineProps<{
  open: boolean
  task: TaskItem | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

function handleCancel() {
  emit('update:open', false)
}

function handleConfirm() {
  emit('confirm')
  emit('update:open', false)
}
</script>

<template>
  <a-modal
    :open="open"
    title="任务完结"
    :width="640"
    destroy-on-close
    :footer="null"
    @cancel="handleCancel"
  >
    <template v-if="task">
      <a-descriptions bordered :column="1" size="middle">
        <a-descriptions-item label="来源模块">
          {{ SOURCE_MODULE_LABEL[task.sourceModule] }}
        </a-descriptions-item>
        <a-descriptions-item label="任务标题">{{ task.title }}</a-descriptions-item>
        <a-descriptions-item label="当前状态">
          {{ TASK_STATUS_LABEL[task.status] }}
        </a-descriptions-item>
        <a-descriptions-item label="接收时间">{{ task.receiveTime }}</a-descriptions-item>
        <a-descriptions-item v-if="task.planFinishTime" label="计划完成时间">
          {{ task.planFinishTime }}
        </a-descriptions-item>
        <a-descriptions-item label="详情说明">
          {{ task.detail || '暂无补充说明' }}
        </a-descriptions-item>
      </a-descriptions>

      <div class="read-footer">
        <a-button @click="handleCancel">关闭</a-button>
        <a-button type="primary" @click="handleConfirm">确认完结</a-button>
      </div>
    </template>
  </a-modal>
</template>

<style scoped>
.read-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xl);
}
</style>
