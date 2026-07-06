# DeepTrain AI 全栈部署计划

## 摘要

将 DeepTrain AI 的前端（GitHub Pages）和后端（FastAPI）完整部署到线上，使网站在无需本地后端的情况下也能正常展示教程、术语等内容，同时 Agent 解析等交互功能通过线上后端支持。

## 当前状态分析

- **前端**: 已部署到 GitHub Pages（https://kari-yo-yo.github.io/deeptrain-ai/），React 应用正常加载，但因无后端 API，所有页面显示"加载中..."
- **后端**: FastAPI + SQLite 仅在本地运行，未部署到线上
- **数据**: `seed_data.json` 中有 6 条教程和 12 条术语，可直接内嵌前端

## 部署策略：静态数据嵌入 + 后端部署到 VeFaaS

### 为什么不只用纯静态？

- Agent 实验室（日志解析）和代码仓库（保存/删除）是核心交互功能，必须依赖后端
- 可视化页面的数据（Loss 曲线等）来自用户上传的日志，需要后端支持
- 纯静态方案会让网站变成"只读展示"，失去大部分价值

### 为什么不部署到 IGA Pages + VeFaaS？

- IGA Pages 预览链接有时效性 token，不适合做固定链接
- GitHub Pages 已成功部署，有稳定的固定 URL
- 后端用 VeFaaS 部署，前端跨域调用即可

## 实施步骤

### 步骤 1：嵌入静态数据到前端

将 `seed_data.json` 中的教程和术语数据直接嵌入前端代码，实现无后端时的优雅降级。

**创建文件**: `frontend/src/data/staticData.js`
- 从 `backend/app/data/seed_data.json` 提取 `tutorials` 和 `terms` 数组
- 导出为 `STATIC_TUTORIALS` 和 `STATIC_TERMS`
- 为 tutorials 添加 `id` 字段（从 order_index 生成）
- 为 terms 添加 `id` 字段（从数组索引生成）

**修改文件**: `frontend/src/hooks/useApi.js`
- 新增 `VITE_API_BASE_URL` 环境变量检测
- 当 API_BASE_URL 为空时，使用静态数据回退模式
- `get('/api/tutorials')` → 返回 `STATIC_TUTORIALS`
- `get('/api/glossary')` → 返回 `STATIC_TERMS`
- `get('/api/agent/logs')` → 返回空数组 `[]`
- 其他 API 调用 → 返回空数组或 mock 数据

**修改文件**: `frontend/src/pages/Visualization.jsx`
- 当无后端时，用 mock 数据展示 Loss 曲线和直方图
- 添加演示提示文案："演示数据，连接后端后可查看真实训练指标"

### 步骤 2：配置前端环境变量

**修改文件**: `frontend/.env.production`
```
VITE_API_BASE_URL=https://your-vefaas-url.volcengineapi.com
```

当部署后端后填入实际地址；未填则自动降级为静态数据模式。

### 步骤 3：本地验证

- `npm run build` 确认构建成功
- 本地预览确认各页面数据正常显示

### 步骤 4：重新构建并推送到 GitHub Pages

- 执行 `npm run build`
- 用临时目录方式重建 `gh-pages` 分支，dist 文件放根目录
- `git push origin gh-pages --force`
- 等 GitHub 自动部署完成

### 步骤 5：部署后端到 VeFaaS（手动）

后端部署需要在火山引擎控制台操作，提供详细指引：

1. 登录火山引擎控制台 → VeFaaS
2. 创建新函数，选择 Web 函数
3. 上传后端代码（backend/ 目录）
4. 设置启动命令：`uvicorn app.main:app --host 0.0.0.0 --port 8000`
5. 配置环境变量（DB_PATH 等）
6. 部署成功后获取 API URL
7. 更新 `frontend/.env.production` 中的 `VITE_API_BASE_URL`
8. 重新构建前端并推送

**注意**: VeFaaS 使用无状态容器，SQLite 不适合持久化存储。建议：
- 如果只是演示，可以接受每次部署重置数据
- 如果需要持久化，后续可改为 Volcengine TOS（对象存储）或 Redis

## 前提假设与决策

- **决策**: 优先保证教程和术语页面可访问，Agent 和代码仓库功能标记为"需连接后端"
- **决策**: 使用 useApi.js 拦截层实现降级，而非修改每个页面组件
- **假设**: VeFaaS 支持 Python Web 函数（FastAPI + uvicorn）
- **假设**: GitHub Pages 已配置好 gh-pages 分支（已完成）

## 验证步骤

1. 构建无报错
2. GitHub Pages 上教程中心显示 6 篇教程，点击可展开内容
3. 术语词典显示 12 个术语，搜索和分类筛选正常
4. 仪表盘显示教程数=6、术语数=12、归档日志数=0
5. 可视化页面显示演示 Loss 曲线和直方图
6. Agent 实验室显示提示"需连接后端"
