# 租房记账本 (Rent Expense Tracker)

一个纯前端的租房费用记账应用，支持分类记录、合租分摊、月度统计和年度趋势分析。

## 功能特性

- 按类别记录支出：房租、水费、电费、燃气、网费、物业费、其他
- 月度分类柱状图统计
- 合租人数设置与每人分摊金额自动计算
- 12个月支出趋势折线图
- 历史月份切换查看
- 所有数据存储在浏览器 localStorage

## 技术栈

- Vite 5 + React 18 + TypeScript
- 原生 Canvas 绘制图表（柱状图、折线图）
- 所有样式内联在 index.html `<style>` 标签中
- 无第三方 UI 库

## 开发

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

## 项目结构

```
src/
  types/Expense.ts    - 数据类型定义
  utils/storage.ts    - localStorage 工具
  hooks/useExpenses.ts- 状态管理 Hook
  components/         - 通用组件（图表、表单、标签栏）
  pages/              - 页面（首页、统计、年度、设置）
  App.tsx             - 主应用
  main.tsx            - 入口文件
```
