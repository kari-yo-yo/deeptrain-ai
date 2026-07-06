# DeepTrain AI - 深度学习训练助手

专为 AutoDL 平台打造的智能训练管理工具，提供从入门教程到代码自动归档的一站式解决方案。

## 功能特性

- **分步式教程**：AutoDL 平台完整使用指南
- **术语词典**：深度学习核心概念速查
- **AI Agent 代码管家**：粘贴日志即可自动解析、归档训练代码与指标
- **代码仓库**：搜索、筛选、版本对比与一键复用
- **数据可视化**：Loss 曲线、数据分布与监控仪表盘

## 技术栈

- **前端**：React 18 + Vite + Tailwind CSS + Framer Motion
- **后端**：FastAPI + SQLAlchemy + SQLite
- **部署**：IGA Pages（前端）+ VeFaaS（后端）

## 快速启动

### 后端

```bash
cd backend
pip install -r requirements.txt
python scripts/init_db.py
uvicorn app.main:app --reload
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

## 部署

### 后端部署到 VeFaaS

1. 打包代码：`zip -r backend.zip backend/`
2. 创建 VeFaaS 函数，运行时选择 `python3.12`
3. 配置启动命令：`sh startup.sh`
4. 挂载 NAS 到 `/mnt/data`，TOS 到 `/mnt/tos`
5. 设置环境变量：`DB_PATH=/mnt/data/deeptrain.db`

### 前端部署到 IGA Pages

```bash
cd frontend
npm run build
iga pages deploy --name deeptrain-ai
```

## 使用示例

1. 访问「教程中心」，跟随指引学习 AutoDL 使用
2. 在「Agent 实验室」粘贴训练日志，点击「智能解析」
3. 解析完成后，点击「保存到仓库」归档代码
4. 在「代码仓库」查看所有历史记录，支持搜索和对比
5. 在「可视化」页面查看 Loss 曲线和数据分布

## 许可证

MIT License
