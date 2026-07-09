import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Copy, Check, Terminal, FolderTree, Rocket, AlertCircle, ExternalLink } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import CodeBlock from '../components/ui/CodeBlock'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// 可直接应用的代码块数据，标注清晰
const codeSections = [
  {
    id: 'clone',
    title: '1. 克隆项目到本地',
    desc: '在终端中执行以下命令，将 DeepTrain AI 项目下载到你的电脑',
    icon: Github,
    isActionable: true,
    code: `git clone https://github.com/kari-yo-yo/deeptrain-ai.git
cd deeptrain-ai`,
    lang: 'bash'
  },
  {
    id: 'frontend-deps',
    title: '2. 安装前端依赖',
    desc: '进入 frontend 目录，安装 React 项目所需的 npm 包',
    icon: Terminal,
    isActionable: true,
    code: `cd frontend
npm install`,
    lang: 'bash'
  },
  {
    id: 'backend-deps',
    title: '3. 安装后端依赖',
    desc: '进入 backend 目录，安装 Python 依赖（建议使用虚拟环境）',
    icon: Terminal,
    isActionable: true,
    code: `cd ../backend

# 创建虚拟环境（推荐）
python -m venv venv

# Windows 激活
venv\\Scripts\\activate

# macOS/Linux 激活
# source venv/bin/activate

# 安装依赖
pip install -r requirements.txt`,
    lang: 'bash'
  },
  {
    id: 'start-backend',
    title: '4. 启动后端服务',
    desc: '运行 FastAPI 后端，默认监听 http://localhost:8000',
    icon: Rocket,
    isActionable: true,
    code: `# 在 backend 目录下
python -m uvicorn app.main:app --reload --port 8000`,
    lang: 'bash'
  },
  {
    id: 'start-frontend',
    title: '5. 启动前端开发服务器',
    desc: '在另一个终端窗口中运行前端，默认打开 http://localhost:5173',
    icon: Rocket,
    isActionable: true,
    code: `# 在 frontend 目录下（新终端）
npm run dev`,
    lang: 'bash'
  }
]

const projectStructure = `
deeptrain-ai/
├── frontend/                 # React 前端项目
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   │   ├── Dashboard.jsx      # 总览看板
│   │   │   ├── Tutorials.jsx      # 教程中心
│   │   │   ├── Glossary.jsx       # 术语词典
│   │   │   ├── AgentParser.jsx    # Agent 实验室（核心功能）
│   │   │   ├── CodeRepo.jsx       # 代码仓库
│   │   │   ├── Visualization.jsx  # 数据可视化
│   │   │   └── GitHubSetup.jsx    # 本页面
│   │   ├── components/      # 可复用 UI 组件
│   │   ├── hooks/           # 自定义 Hooks
│   │   └── data/            # 静态数据
│   ├── public/              # 静态资源
│   └── package.json         # 前端依赖配置
│
├── backend/                  # FastAPI 后端项目
│   ├── app/
│   │   ├── main.py          # 应用入口
│   │   ├── models.py        # 数据库模型
│   │   ├── routers/         # API 路由
│   │   │   ├── tutorials.py       # 教程 API
│   │   │   ├── glossary.py        # 术语 API
│   │   │   ├── agent.py           # 日志解析 API
│   │   │   ├── code_repo.py       # 代码仓库 API
│   │   │   └── visualization.py   # 可视化 API
│   │   ├── services/        # 业务逻辑
│   │   │   └── log_parser.py      # 日志解析引擎
│   │   └── data/
│   │       └── seed_data.json     # 初始数据
│   └── requirements.txt     # Python 依赖
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages 自动部署配置
│
└── README.md                # 项目说明文档
`

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-dark border border-navy-lighter text-xs text-slate hover:text-accent hover:border-accent/30 transition-all"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      {copied ? '已复制' : '复制'}
    </button>
  )
}

const GitHubSetup = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 页面标题 */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <Github size={20} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">
            下载并运行本项目
          </h1>
        </div>
        <p className="text-slate max-w-2xl">
          以下是从 GitHub 下载 DeepTrain AI 并在本地运行的完整步骤。
          <span className="text-green-400 font-medium"> 绿色边框标注的代码块 </span>
          是可以直接复制到终端执行的命令。
        </p>
      </motion.div>

      {/* GitHub 仓库链接卡片 */}
      <motion.div variants={itemVariants}>
        <GlassCard className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Github size={32} className="text-white" />
            <div>
              <div className="text-white font-medium">kari-yo-yo/deeptrain-ai</div>
              <div className="text-xs text-slate">深度学习训练助手 · React + FastAPI</div>
            </div>
          </div>
          <a
            href="https://github.com/kari-yo-yo/deeptrain-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm hover:bg-accent/20 transition-colors"
          >
            <ExternalLink size={14} />
            在 GitHub 上查看
          </a>
        </GlassCard>
      </motion.div>

      {/* 可执行代码步骤 */}
      {codeSections.map((section) => (
        <motion.div key={section.id} variants={itemVariants}>
          <div className="flex items-center gap-2 mb-3">
            <section.icon size={18} className="text-accent" />
            <h2 className="text-lg font-display font-semibold text-white">{section.title}</h2>
            {section.isActionable && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-500/10 text-green-400 border border-green-500/20">
                可直接应用
              </span>
            )}
          </div>
          <p className="text-sm text-slate mb-3">{section.desc}</p>
          <div className={`rounded-xl overflow-hidden border ${section.isActionable ? 'border-green-500/30' : 'border-navy-lighter'}`}>
            {section.isActionable && (
              <div className="flex items-center justify-between px-4 py-2 bg-green-500/5 border-b border-green-500/20">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-green-400" />
                  <span className="text-xs text-green-400 font-mono">终端命令</span>
                </div>
                <CopyButton text={section.code} />
              </div>
            )}
            <CodeBlock code={section.code} language={section.lang} />
          </div>
        </motion.div>
      ))}

      {/* 项目结构说明 */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-3">
          <FolderTree size={18} className="text-accent" />
          <h2 className="text-lg font-display font-semibold text-white">项目目录结构</h2>
        </div>
        <p className="text-sm text-slate mb-3">
          了解代码组织方式，方便你定位需要修改的文件
        </p>
        <div className="rounded-xl overflow-hidden border border-navy-lighter">
          <CodeBlock code={projectStructure.trim()} language="text" />
        </div>
      </motion.div>

      {/* 注意事项 */}
      <motion.div variants={itemVariants}>
        <GlassCard className="border-orange-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <div className="text-white font-medium">环境要求</div>
              <ul className="text-sm text-slate space-y-1 list-disc list-inside">
                <li>Node.js 18+ （前端需要）</li>
                <li>Python 3.10+ （后端需要）</li>
                <li>Git （用于克隆仓库）</li>
              </ul>
              <div className="text-white font-medium mt-3">常见问题</div>
              <ul className="text-sm text-slate space-y-1 list-disc list-inside">
                <li>后端启动失败？检查是否已激活虚拟环境，以及 SQLite 是否有写权限</li>
                <li>前端无法连接后端？确认 .env 中的 API_BASE_URL 是否为 http://localhost:8000</li>
                <li>npm install 卡住？尝试换源：<code className="text-accent">npm config set registry https://registry.npmmirror.com</code></li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

export default GitHubSetup
