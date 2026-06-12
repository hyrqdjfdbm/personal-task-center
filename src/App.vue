<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import PersonalTaskCenter from './views/workbench/PersonalTaskCenter.vue'

dayjs.locale('zh-cn')
</script>

<template>
  <a-config-provider :locale="zhCN">
    <div class="page-shell">
      <PersonalTaskCenter />
    </div>
  </a-config-provider>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  padding: var(--spacing-xl);
  background: var(--color-bg-page);
}
</style>
