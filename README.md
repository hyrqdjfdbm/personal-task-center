# 个人任务中心 · 前端页面

纯前端页面，使用本地 mock 数据，**无后端接口、无路由、无权限**。

## 运行

```bash
npm install
npm run dev
```

打开浏览器即可预览，无需配置 API。

## 页面内容

- 卡片列表展示任务（来源模块、标题、状态、接收时间）
- 单条操作：去处置 / 去审核 / 去查阅
- 三种弹窗：处置表单、审核表单、只读查阅

## 文件位置

| 文件 | 说明 |
|------|------|
| `src/views/workbench/PersonalTaskCenter.vue` | 页面主文件 |
| `src/components/task/` | 卡片与弹窗组件 |
| `src/mock/tasks.ts` | 示例数据（可改这里换内容） |

## 技术栈

Vue 3 + TypeScript + Ant Design Vue
