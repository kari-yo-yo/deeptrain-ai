# DeepTrain AI 训练助手 — 实施计划

## 一、Summary

本项目是一个面向深度学习初学者的「教学 + 代码管理」一体化网站。核心功能包括：
1. **分步式 AutoDL 教学引导** — 从数据上传到结果查看的完整交互教程
2. **AI Agent 代码管家（简化版）** — 用户粘贴终端运行日志，系统自动解析并归档代码、参数与训练指标
3. **代码仓库** — 支持搜索、筛选、版本对比与一键复用
4. **数据可视化** — Loss/Accuracy 曲线、数据分布直方图

**技术选型**：React 18 + Vite + Tailwind CSS（前端），FastAPI + SQLite（后端），部署至 IGA Pages（前端静态托管）+ VeFaaS（后端 Serverless 微服务）。

**当前目录为空**，从零开始搭建完整前后端项目。

---

## 二、Current State Analysis

- **工作目录状态**：完全空目录，无任何既有代码或配置
- **用户已确认的关键约束**：
  - AI Agent 采用「粘贴运行日志」简化方案，非自动化 SSH 监听
  - 部署目标为 IGA Pages（前端）+ VeFaaS（后端微服务）
  - 视觉风格：深蓝（`#0a192f`）+ 青色（`#64ffda`）科技风
- **平台约束（IGA Pages / VeFaaS）**：
  - VeFaaS 支持 Python 3.12 微服务模式（`CpuStrategy=always`），FastAPI 可直接以 uvicorn 运行
  - SQLite 需配合 NAS 挂载使用，必须启用 WAL 模式并限制并发（`ExclusiveMode=true`, `MaxConcurrency=1`）
  - 文件持久化依赖 NAS（数据库）和 TOS（日志/图表文件）
  - 前端为纯静态构建产物，由 IGA Pages 边缘加速托管

---

## 三、Proposed Changes

### 阶段一：基础骨架搭建

#### 1. 初始化项目结构
- **What**：创建前后端分离的目录结构，配置 `.gitignore`
- **Why**：清晰的目录边界是后续并行开发的基础
- **How**：根目录下创建 `frontend/`、`backend/`、`scripts/`、`docs/` 四个顶级目录

#### 2. 前端基础架构
- **文件**：`frontend/package.json`、`frontend/vite.config.js`、`frontend/tailwind.config.js`、`frontend/postcss.config.js`、`frontend/src/styles/globals.css`
- **What**：初始化 Vite + React + Tailwind CSS 项目，配置自定义主题色（深蓝青色系）和字体（JetBrains Mono + Noto Sans SC）
- **Why**：避免通用 AI 审美，从设计系统层面统一视觉语言
- **How**：
  - `tailwind.config.js` 中扩展 `colors`：`navy: '#0a192f'`, `light-navy: '#112240'`, `slate: '#8892b0'`, `accent: '#64ffda'`
  - `globals.css` 中定义 CSS 变量和全局暗色背景
  - 安装依赖：`react`, `react-dom`, `react-router-dom`, `framer-motion`, `recharts`, `react-syntax-highlighter`, `lucide-react`

#### 3. 后端基础架构
- **文件**：`backend/requirements.txt`、`backend/app/main.py`、`backend/app/database.py`、`backend/app/models.py`、`backend/app/schemas.py`、`backend/app/config.py`
- **What**：搭建 FastAPI 项目骨架，配置 SQLite + SQLAlchemy + WAL 模式
- **Why**：为后续所有 API 提供统一的数据层和配置管理
- **How**：
  - `requirements.txt` 包含：`fastapi`, `uvicorn[standard]`, `sqlalchemy`, `pydantic`, `python-multipart`, `alembic`
  - `database.py` 中创建引擎时传入 `connect_args={"check_same_thread": False}`，并在连接后执行 `PRAGMA journal_mode=WAL;`
  - `models.py` 定义：Tutorial（教程）、Term（术语）、ParsedLog（解析日志）、CodeSnippet（代码片段）、TrainingMetric（训练指标）
  - `config.py` 从环境变量读取 `DB_PATH`（默认 `./deeptrain.db`）、`TOS_PATH`、`ALLOWED_ORIGINS`

#### 4. 设计系统组件
- **文件**：
  - `frontend/src/components/layout/ParticleCanvas.jsx` — Canvas 粒子网络背景动效
  - `frontend/src/components/ui/GlassCard.jsx` — 毛玻璃质感卡片
  - `frontend/src/components/ui/NeonButton.jsx` — 青色霓虹光晕按钮
  - `frontend/src/components/ui/CodeBlock.jsx` — 语法高亮代码块
  - `frontend/src/components/ui/MetricBadge.jsx` — 指标状态徽章
  - `frontend/src/components/layout/Sidebar.jsx` — 侧边导航栏
  - `frontend/src/components/layout/Header.jsx` — 顶部状态栏
- **What**：实现一套可复用的、符合科技风审美的基础 UI 组件
- **Why**：保证全站视觉一致性，减少后续页面开发时的重复工作
- **How**：ParticleCanvas 使用原生 Canvas 2D API 绘制缓慢移动的粒子与连线；GlassCard 使用 `backdrop-blur` + 半透明背景 + 细边框；NeonButton 使用 `box-shadow` 青色光晕过渡动画

### 阶段二：数据层与核心内容模块

#### 5. 数据库初始化与种子数据
- **文件**：`scripts/init_db.py`、`backend/app/data/seed_data.json`
- **What**：创建所有数据表，并导入 AutoDL 教程步骤和深度学习术语的初始数据
- **Why**：让教程中心和术语词典在首次运行时就有可用内容
- **How**：`seed_data.json` 中包含 5~8 个教程章节（数据上传、环境配置、代码运行、结果查看等）和 20+ 个术语（loss、epoch、batch size、learning rate、GPU utilization 等）；`init_db.py` 读取 JSON 并批量插入

#### 6. 教程中心模块
- **文件**：
  - `frontend/src/pages/Tutorials.jsx`
  - `frontend/src/components/ui/StepIndicator.jsx`
  - `backend/app/routers/tutorials.py`
- **What**：左侧步骤导航 + 右侧内容区的分步式教程页面，带完成进度百分比
- **Why**：这是用户首次使用时的核心引导路径
- **How**：
  - 前端：步骤导航使用垂直时间线样式，当前步骤高亮显示青色边框；内容区支持图文混排，底部有「上一步/下一步」按钮；进度百分比实时计算
  - 后端：`GET /api/tutorials` 返回分页列表，`GET /api/tutorials/{id}` 返回单个章节详情

#### 7. 术语词典模块
- **文件**：
  - `frontend/src/pages/Glossary.jsx`
  - `backend/app/routers/glossary.py`
- **What**：可搜索、按分类筛选的术语卡片页面，鼠标悬停显示通俗解释
- **Why**：降低深度学习初学者的认知门槛
- **How**：
  - 前端：顶部搜索栏 + 分类标签（训练/模型/数据/硬件）；卡片使用 GlassCard，悬停时展开详细解释；支持 FTS5 全文搜索高亮
  - 后端：`GET /api/glossary` 支持 `?q=` 全文搜索和 `?category=` 分类过滤；SQLite FTS5 虚拟表关联 `terms` 表

### 阶段三：核心 AI Agent 功能

#### 8. 日志解析引擎
- **文件**：`backend/app/services/log_parser.py`
- **What**：核心算法模块，用正则表达式从训练日志中提取结构化信息
- **Why**：这是「粘贴运行日志」方案的核心，决定了 Agent 的解析准确率
- **How**：
  - PyTorch 正则规则：匹配 `Epoch [\d]+/\d+`, `loss: [\d.]+`, `accuracy: [\d.]+`, `lr: [\d.e-]+`
  - AutoDL 平台正则：匹配实例 ID、GPU 型号、显存大小、启动时间
  - 代码块提取：识别 ` ```python ` 到 ` ``` ` 之间的内容
  - 错误检测：匹配 `CUDA out of memory`, `RuntimeError`, `KeyboardInterrupt` 等异常
  - 输出结构化 JSON：`{meta: {...}, epochs: [...], code_blocks: [...], errors: [...]}`

#### 9. AI Agent 前端页面
- **文件**：`frontend/src/pages/AgentParser.jsx`
- **What**：大文本粘贴区 → 解析按钮 → 结构化结果展示的三段式界面
- **Why**：用户与 Agent 交互的主入口
- **How**：
  - 粘贴区：`<textarea>` 支持拖拽文件，带行号显示，最大 50MB 文本
  - 解析按钮：调用 `POST /api/agent/parse`，加载状态显示脉冲动画
  - 结果展示：Tab 切换视图 —「概览」（元数据卡片）、「训练指标」（Loss/Acc 表格）、「提取代码」（CodeBlock 列表）、「异常检测」（红色告警卡片）
  - 提供「保存到仓库」按钮，将解析结果持久化到后端

#### 10. AI Agent 后端接口
- **文件**：`backend/app/routers/agent.py`
- **What**：接收原始日志文本，调用解析引擎，将结果保存到数据库
- **Why**：桥接前端粘贴操作与后端数据持久化
- **How**：
  - `POST /api/agent/parse`：接收 `{"raw_log": "..."}`，调用 `log_parser.parse()`，返回结构化 JSON（不保存，纯解析）
  - `POST /api/agent/save`：接收解析结果 + 用户标注的项目名/标签，写入 `parsed_logs` 和 `code_snippets` 表
  - `GET /api/agent/logs`：分页查询历史解析记录

### 阶段四：代码仓库与可视化

#### 11. 代码仓库模块
- **文件**：
  - `frontend/src/pages/CodeRepo.jsx`
  - `frontend/src/pages/CodeCompare.jsx`
  - `backend/app/routers/code_repo.py`
  - `backend/app/services/code_manager.py`
- **What**：卡片式代码片段列表、详情页、版本对比功能
- **Why**：用户回溯和复用历史代码的核心场景
- **How**：
  - CodeRepo：卡片显示项目名、数据集、模型架构标签、最后运行时间、状态（成功/失败/运行中）；顶部有搜索栏（项目名/数据集/模型关键词）和筛选器；点击进入详情页展示完整代码 + 运行日志 + 指标图表
  - CodeCompare：选择两段代码，使用 `diff-match-patch` 库生成行级 diff，新增行绿色高亮、删除行红色高亮
  - 后端：`GET /api/codes` 支持多字段过滤，`GET /api/codes/{id}` 返回详情，`GET /api/codes/{id}/diff?target_id=xx` 返回对比结果

#### 12. 数据可视化模块
- **文件**：
  - `frontend/src/pages/Visualization.jsx`
  - `frontend/src/components/charts/LossCurve.jsx`
  - `frontend/src/components/charts/DataHistogram.jsx`
  - `frontend/src/components/charts/MetricDashboard.jsx`
  - `backend/app/routers/visualization.py`
  - `backend/app/services/viz_generator.py`
- **What**：训练指标曲线、数据分布统计、GPU 监控仪表盘
- **Why**：将训练过程以直观图表呈现，帮助用户快速诊断问题
- **How**：
  - LossCurve：Recharts `LineChart`，双曲线（train loss / val loss），支持缩放和平移
  - DataHistogram：Recharts `BarChart`，展示数据集类别数量或图像尺寸分布
  - MetricDashboard：网格布局，显示当前 GPU 利用率、显存占用、最新 loss、预估剩余时间（基于最近 10 个 epoch 的下降速率线性估算）
  - 后端：`GET /api/viz/metrics?log_id=xx` 返回时间序列数据；`GET /api/viz/histogram?dataset=xx` 返回分布数据

#### 13. 文件存储服务
- **文件**：
  - `backend/app/services/file_storage.py`
  - `backend/app/routers/files.py`
- **What**：封装 TOS 对象存储的上传/下载/列举操作
- **Why**：日志文件和生成的图表文件需持久化到 TOS，避免 VeFaaS 实例重启丢失
- **How**：
  - `file_storage.py`：基于 `boto3` 或火山 TOS SDK，封装 `upload_file()`, `download_file()`, `list_objects()`, `generate_presigned_url()`
  - `files.py`：`POST /api/files/upload` 接收 multipart 文件，保存到 TOS 并返回 URL；`GET /api/files/{key}` 返回预签名下载链接

### 阶段五：联调与部署准备

#### 14. 前后端联调
- **文件**：`frontend/src/hooks/useApi.js`
- **What**：统一封装所有后端 API 调用，处理 CORS、认证、错误提示
- **Why**：避免每个页面重复写 fetch 逻辑，确保错误处理一致
- **How**：
  - 基于 `fetch` 封装，读取 `import.meta.env.VITE_API_BASE_URL`
  - 统一处理 401/403/500 状态码，弹出 Toast 提示
  - 提供 `useQuery` 和 `useMutation` 风格的 hooks（或使用 `swr` 轻量库）

#### 15. 本地完整测试
- **What**：在本地环境运行完整前后端，验证所有核心流程
- **Why**：确保部署前功能稳定，减少线上调试成本
- **How**：
  - 前端：`cd frontend && npm run dev`（Vite 默认 5173 端口）
  - 后端：`cd backend && uvicorn app.main:app --reload`（默认 8000 端口）
  - 使用浏览器 DevTools Network 面板验证所有 API；使用样本训练日志测试解析准确率

#### 16. 部署配置
- **文件**：
  - `backend/startup.sh`
  - `frontend/.env.production`
  - `backend/Dockerfile`（备选）
- **What**：编写 VeFaaS 启动脚本和生产环境变量配置
- **Why**：部署到 IGA Pages / VeFaaS 的必需文件
- **How**：
  - `startup.sh`：`exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1`
  - `.env.production`：`VITE_API_BASE_URL=https://<vefaas-domain>`

### 阶段六：部署上线

#### 17. 火山引擎资源开通与配置
- **What**：创建 NAS 文件系统、TOS Bucket、获取访问密钥
- **Why**：后端持久化存储的底层依赖
- **How**：
  - NAS：创建通用型文件系统，挂载点路径 `/`，记录 `FileSystemId`
  - TOS：创建私有 Bucket（如 `deeptrain-files`），获取 AK/SK
  - VeFaaS：创建函数 `deeptrain-api`，运行时 `python3.12`，微服务模式

#### 18. 后端部署到 VeFaaS
- **What**：将后端代码打包上传，配置启动命令、挂载、环境变量
- **How**：
  - 打包：`cd backend && zip -r ../deploy/backend.zip . -x "__pycache__/*" "*.pyc"`
  - 配置启动命令：`sh startup.sh`
  - 配置监听端口：`8000`
  - NAS 挂载：`LocalMountPath=/mnt/data`, `RemotePath=/`
  - TOS 挂载：`LocalMountPath=/mnt/tos`, `BucketName=deeptrain-files`
  - 环境变量：`DB_PATH=/mnt/data/deeptrain.db`, `TOS_PATH=/mnt/tos`
  - 关键：设置 `ExclusiveMode=true`, `MaxConcurrency=1`, `CpuStrategy=always`

#### 19. 前端部署到 IGA Pages
- **What**：构建静态产物并推送
- **How**：
  - `cd frontend && npm install && npm run build`
  - 将 `frontend/dist/` 目录作为 IGA Pages 的部署源
  - 配置 SPA 回退：所有路由指向 `index.html`

#### 20. 线上验证与备份策略
- **What**：测试所有端点，配置数据库定时备份
- **How**：
  - 使用浏览器完整走一遍「教程 → 粘贴日志 → 保存 → 仓库查看 → 对比代码」流程
  - 在 `main.py` 中添加启动任务：将 `/mnt/data/deeptrain.db` 复制到 `/mnt/tos/backups/deeptrain_$(date +%Y%m%d).db`

---

## 四、Assumptions & Decisions

| 决策点 | 选择 | 理由 |
|-------|------|------|
| AI Agent 自动收集方式 | **粘贴运行日志**（简化版） | 用户明确选择。避免 SSH 连接 AutoDL 的认证复杂度和网络不稳定问题，MVP 阶段足够验证价值 |
| 后端部署模式 | **VeFaaS 微服务**（非函数事件模式） | FastAPI 可直接以 uvicorn 运行，无需 Mangum 等 ASGI 适配器，开发体验与本地一致 |
| 数据库选型 | **SQLite + NAS 挂载** | 项目初期数据量小，SQLite 零运维成本；通过 `ExclusiveMode=true` 和 WAL 模式规避并发风险 |
| 文件存储 | **TOS 对象存储挂载** | VeFaaS 原生支持 TOS 挂载，日志/图表文件直接以本地文件系统方式读写，开发门槛低 |
| 前端图表库 | **Recharts** | React 生态最成熟的图表库，API 简洁，与 Tailwind 暗色主题配合良好 |
| 代码对比算法 | **`diff-match-patch`** | Google 开源的 robust diff 库，无需后端计算，纯前端实现，减轻服务器压力 |
| 日志解析引擎 | **纯正则规则引擎**（零外部 API） | 不依赖 OpenAI/Qwen 等大模型 API，零成本、零延迟、可离线运行；后续可叠加 LLM 增强 |
| 动效策略 | **Framer Motion + Canvas 粒子** | Framer Motion 处理页面过渡和组件动画，Canvas 处理全局背景，分工明确 |
| 字体选择 | **JetBrains Mono + Noto Sans SC** | JetBrains Mono 科技感强、辨识度高；Noto Sans SC 保证中文显示质量 |

---

## 五、Verification Steps

### 功能验证
1. **教程中心**：打开首页 → 点击「教程中心」→ 能看到 5+ 章节 → 点击「下一步」按钮 → 进度百分比正确更新 → 最后一章显示「完成」
2. **术语词典**：搜索「batch size」→ 结果高亮匹配词 → 悬停卡片 → 显示通俗解释 → 切换分类标签「训练」→ 只显示训练相关术语
3. **AI Agent 粘贴解析**：进入「Agent 实验室」→ 粘贴一段 PyTorch 训练日志（含 epoch、loss、acc）→ 点击「解析」→ 5 秒内返回结构化结果 → 切换到「训练指标」Tab → 能看到数值表格 → 点击「保存到仓库」→ 提示保存成功
4. **代码仓库**：进入「代码仓库」→ 能看到刚保存的卡片 → 卡片显示项目名、数据集、运行状态 → 点击进入详情 → 展示完整代码和 loss 曲线 → 返回列表 → 搜索关键词「CIFAR」→ 筛选结果正确
5. **代码对比**：选择两个同一项目的不同版本 → 进入对比页 → 新增行绿色高亮、删除行红色高亮 → 能清晰看出参数改动
6. **数据可视化**：上传一个 CSV 文件（含类别/尺寸列）→ 自动生成数据分布直方图 → 切换到 Metric Dashboard → GPU 利用率和显存显示正常

### 部署验证
7. **后端部署**：VeFaaS 函数状态为「运行中」→ 访问 `/docs` → Swagger UI 正常显示所有 API → 调用 `/api/tutorials` → 返回 200 + JSON 数据
8. **前端部署**：IGA Pages 域名访问 → 首页加载正常 → ParticleCanvas 背景动画流畅 → 所有页面路由切换无 404 → API 调用无 CORS 错误
9. **持久化验证**：通过 Agent 保存一条记录 → 等待 5 分钟 → 重新访问「代码仓库」→ 记录仍然存在 → 检查 NAS 路径 `/mnt/data/deeptrain.db` 文件大小有增长
10. **备份验证**：触发一次 VeFaaS 实例重启 → 访问数据库记录 → 数据未丢失 → 检查 TOS `/backups/` 目录 → 存在 `.db` 备份文件

---

*本计划基于 IGA Pages / VeFaaS 官方文档及 SQLite Serverless 最佳实践制定，所有技术选型均有实际平台能力支撑。*
