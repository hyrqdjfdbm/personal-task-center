<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { CloseFormValues, TaskItem } from '../../types/task'

const props = defineProps<{
  open: boolean
  task: TaskItem | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [values: CloseFormValues]
}>()

const formRef = ref<FormInstance>()
const formState = reactive<{ reason: string }>({
  reason: '',
})

watch(
  () => props.open,
  (visible) => {
    if (visible) {
      formState.reason = ''
    }
  },
)

function handleCancel() {
  emit('update:open', false)
}

async function handleOk() {
  await formRef.value?.validate()
  emit('submit', {
    reason: formState.reason.trim(),
  })
  emit('update:open', false)
}
</script>

<template>
  <a-modal
    :open="open"
    title="预警销号"
    ok-text="确认销号"
    cancel-text="取消"
    :width="560"
    destroy-on-close
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div v-if="task" class="modal-context">
      <p class="modal-context__label">任务标题</p>
      <p class="modal-context__value">{{ task.title }}</p>
    </div>

    <a-form ref="formRef" layout="vertical" :model="formState">
      <a-form-item
        label="销号说明"
        name="reason"
        :rules="[
          { required: true, message: '请填写销号说明' },
          { min: 5, message: '销号说明至少 5 个字' },
        ]"
      >
        <a-textarea
          v-model:value="formState.reason"
          :rows="4"
          placeholder="请说明销号原因及当前事项处理情况"
          show-count
          :maxlength="500"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
.modal-context {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-md);
}

.modal-context__label {
  margin: 0 0 var(--spacing-3xs);
  font-size: var(--font-size-small);
  color: var(--color-text-placeholder);
}

.modal-context__value {
  margin: 0;
  line-height: 1.6;
  color: var(--color-text-primary);
}
</style>
