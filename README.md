# 个人任务中心 · 前端页面

纯前端页面，使用本地 mock 数据，**无后端接口、无路由、无权限**。

## 在线预览（GitHub Pages）

部署成功后，同事可直接访问：

**https://hyrqdjfdbm.github.io/personal-task-center/**

### 首次开启 Pages

1. 打开仓库 [Settings → Pages](https://github.com/hyrqdjfdbm/personal-task-center/settings/pages)
2. **Build and deployment → Source** 选择 **GitHub Actions**
3. 推送代码到 `main` 分支后，Actions 会自动构建部署
4. 在 [Actions](https://github.com/hyrqdjfdbm/personal-task-center/actions) 查看进度，约 1～2 分钟完成

## 本地运行

```bash
npm install
npm run dev
```

打开浏览器即可预览，无需配置 API。

## 页面内容

- 卡片列表展示任务（来源模块、标题、状态、接收时间）
- 单条操作：去处置 / 去审核 / 完结 / 销号
- 多种弹窗：处置、审核、完结、销号

## 文件位置

| 文件 | 说明 |
|------|------|
| `src/views/workbench/PersonalTaskCenter.vue` | 页面主文件 |
| `src/components/task/` | 卡片与弹窗组件 |
| `src/mock/tasks.ts` | 示例数据（可改这里换内容） |

## 技术栈

Vue 3 + TypeScript + Ant Design Vue
