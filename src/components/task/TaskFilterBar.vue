<script setup lang="ts">
import { watch } from 'vue'
import type { SourceModule, TaskStatus } from '../../types/task'
import { SOURCE_MODULE_LABEL, TASK_STATUS_LABEL } from '../../constants/task'

const sourceModule = defineModel<SourceModule | 'all'>('sourceModule', { default: 'all' })
const status = defineModel<TaskStatus | 'all'>('status', { default: 'all' })
const keyword = defineModel<string>('keyword', { default: '' })

const sourceOptions = [
  { label: '全部来源', value: 'all' },
  ...Object.entries(SOURCE_MODULE_LABEL).map(([value, label]) => ({ label, value })),
]

const statusOptions = [
  { label: '全部状态', value: 'all' },
  ...Object.entries(TASK_STATUS_LABEL).map(([value, label]) => ({ label, value })),
]

watch(sourceModule, (value) => {
  if (value === 'all') {
    status.value = 'all'
  }
})
</script>

<template>
  <div class="filter-bar">
    <a-input-search
      v-model:value="keyword"
      allow-clear
      placeholder="搜索项目代码｜项目名称｜项目简称"
      style="width: 320px"
    />
    <a-select v-model:value="sourceModule" :options="sourceOptions" style="width: 160px" />
    <a-select
      v-if="sourceModule !== 'all'"
      v-model:value="status"
      :options="statusOptions"
      style="width: 180px"
    />
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--color-bg-container);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-component-stroke);
}
</style>
