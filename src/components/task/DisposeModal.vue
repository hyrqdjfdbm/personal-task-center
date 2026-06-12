<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import dayjs, { type Dayjs } from 'dayjs'
import type { DisposeFormValues, TaskItem } from '../../types/task'

const props = defineProps<{
  open: boolean
  task: TaskItem | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [values: DisposeFormValues]
}>()

const formRef = ref<FormInstance>()
const formState = reactive<{ finishTime: Dayjs | null; opinion: string }>({
  finishTime: null,
  opinion: '',
})

watch(
  () => props.open,
  (visible) => {
    if (visible) {
      formState.finishTime = props.task?.planFinishTime
        ? dayjs(props.task.planFinishTime)
        : dayjs()
      formState.opinion = ''
    }
  },
)

function handleCancel() {
  emit('update:open', false)
}

async function handleOk() {
  await formRef.value?.validate()
  emit('submit', {
    finishTime: formState.finishTime!.format('YYYY-MM-DD'),
    opinion: formState.opinion.trim(),
  })
  emit('update:open', false)
}
</script>

<template>
  <a-modal
    :open="open"
    title="任务处置"
    ok-text="提交"
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
        label="完成时间"
        name="finishTime"
        :rules="[{ required: true, message: '请选择完成时间' }]"
      >
        <a-date-picker
          v-model:value="formState.finishTime"
          style="width: 100%"
          placeholder="请选择完成时间"
        />
      </a-form-item>
      <a-form-item
        label="处理意见"
        name="opinion"
        :rules="[
          { required: true, message: '请填写处理意见' },
          { min: 5, message: '处理意见至少 5 个字' },
        ]"
      >
        <a-textarea
          v-model:value="formState.opinion"
          :rows="4"
          placeholder="请描述处置措施、当前进展及后续安排"
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
