<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { ReviewFormValues, TaskItem } from '../../types/task'

const props = defineProps<{
  open: boolean
  task: TaskItem | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [values: ReviewFormValues]
}>()

const formRef = ref<FormInstance>()
const formState = reactive<{ result: 'pass' | 'reject'; comment: string }>({
  result: 'pass',
  comment: '',
})

watch(
  () => props.open,
  (visible) => {
    if (visible) {
      formState.result = 'pass'
      formState.comment = ''
    }
  },
)

function handleCancel() {
  emit('update:open', false)
}

async function handleOk() {
  await formRef.value?.validate()
  emit('submit', {
    result: formState.result,
    comment: formState.comment.trim(),
  })
  emit('update:open', false)
}
</script>

<template>
  <a-modal
    :open="open"
    title="任务审核"
    ok-text="提交审核"
    cancel-text="取消"
    :width="560"
    destroy-on-close
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div v-if="task" class="modal-context">
      <p class="modal-context__label">任务标题</p>
      <p class="modal-context__value">{{ task.title }}</p>
      <p v-if="task.detail" class="modal-context__detail">{{ task.detail }}</p>
    </div>

    <a-form ref="formRef" layout="vertical" :model="formState">
      <a-form-item
        label="审核结果"
        name="result"
        :rules="[{ required: true, message: '请选择审核结果' }]"
      >
        <a-radio-group v-model:value="formState.result">
          <a-radio value="pass">通过</a-radio>
          <a-radio value="reject">退回</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="审核意见"
        name="comment"
        :rules="[
          { required: true, message: '请填写审核意见' },
          { min: 5, message: '审核意见至少 5 个字' },
        ]"
      >
        <a-textarea
          v-model:value="formState.comment"
          :rows="4"
          placeholder="请填写审核意见"
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

.modal-context__detail {
  margin: var(--spacing-sm) 0 0;
  font-size: var(--font-size-small);
  line-height: 1.6;
  color: var(--color-text-secondary);
}
</style>
