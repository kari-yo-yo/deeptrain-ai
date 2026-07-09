import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Copy, Check, Terminal, FolderTree, Rocket, AlertCircle, ExternalLink, Search, BookOpen, Database, Settings } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import CodeBlock from '../components/ui/CodeBlock'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// ========== 他人项目复现指南（蓝色标注） ==========
const otherProjectSections = [
  {
    id: 'search',
    title: '1. 在 GitHub 上找到项目',
    desc: '使用关键词搜索你需要的深度学习项目，关注 Stars 数、最近更新时间和 README 完整性',
    icon: Search,
    tag: '他人项目相关',
    tagColor: 'blue',
    code: `# GitHub 搜索技巧
# 按 Stars 排序：深度学习图像分类项目
site:github.com "image classification" pytorch stars:>100

# 查看项目活跃度
# 进入仓库 → Insights → Pulse 看最近提交频率`,
    lang: 'bash'
  },
  {
    id: 'clone-other',
    title: '2. 克隆他人的项目到本地',
    desc: '复制项目的 HTTPS 地址，用 git clone 下载到本地',
    icon: Github,
    tag: '他人项目相关',
    tagColor: 'blue',
    code: `# 示例：克隆一个热门的 PyTorch 图像分类项目
git clone https://github.com/pytorch/examples.git

# 或者克隆指定的项目（替换为实际地址）
git clone https://github.com/原作者用户名/项目名称.git
cd 项目名称`,
    lang: 'bash'
  },
  {
    id: 'read-readme',
    title: '3. 阅读 README 和依赖说明',
    desc: 'README 中通常包含安装步骤、数据准备方法和运行命令，务必先通读一遍',
    icon: BookOpen,
    tag: '他人项目相关',
    tagColor: 'blue',
    code: `# 查看 README 内容（终端中）
cat README.md

# 或者直接用代码编辑器打开项目文件夹
# VS Code: code .
# PyCharm: 打开文件夹`,
    lang: 'bash'
  },
  {
    id: 'install-deps',
    title: '4. 安装项目依赖',
    desc: '根据 README 指引安装依赖，通常通过 requirements.txt 或 environment.yml',
    icon: Terminal,
    tag: '他人项目相关',
    tagColor: 'blue',
    code: `# 方式一：pip 安装 requirements.txt
pip install -r requirements.txt

# 方式二：conda 环境（如果提供了 environment.yml）
conda env create -f environment.yml
conda activate 环境名

# 方式三：setup.py 安装
pip install -e .`,
    lang: 'bash'
  },
  {
    id: 'prepare-data',
    title: '5. 准备数据集（核心步骤）',
    desc: '这是复现他人项目最关键的一步。需要按照作者要求的数据格式准备数据',
    icon: Database,
    tag: '他人项目相关',
    tagColor: 'blue',
    code: `# 常见数据准备方式：

# 方式 A：下载作者提供的数据脚本
bash download_data.sh

# 方式 B：使用 torchivision 自带数据集（如 CIFAR-10、ImageNet）
# 代码中通常自动下载，无需手动准备

# 方式 C：准备自己的数据集
# 1. 创建 data/ 目录
mkdir data

# 2. 按类别存放图片（ImageFolder 格式）
# data/
#   train/
#     class_a/     ← 类别 A 的图片
#     class_b/     ← 类别 B 的图片
#   val/
#     class_a/
#     class_b/

# 3. 修改代码中的数据路径配置`,
    lang: 'bash'
  },
  {
    id: 'modify-config',
    title: '6. 修改配置文件和数据路径',
    desc: '根据你的环境修改数据路径、batch size、学习率等参数。这些通常在 config.py、args.py 或 YAML 文件中',
    icon: Settings,
    tag: '他人项目相关',
    tagColor: 'blue',
    code: `# 典型的需要修改的配置项（示例）：

# config.py 或 train.py 中
DATA_PATH = './data/my_dataset'      # ← 修改为你的数据路径
BATCH_SIZE = 32                       # ← 根据显存调整
LEARNING_RATE = 0.001                 # ← 根据任务调整
NUM_EPOCHS = 100                      # ← 训练轮数
NUM_CLASSES = 10                      # ← 你的类别数
PRETRAINED = True                     # ← 是否使用预训练权重

# 命令行传参方式
python train.py --data_path ./data --batch_size 16 --lr 0.0001`,
    lang: 'python'
  },
  {
    id: 'run-training',
    title: '7. 运行训练代码',
    desc: '执行训练脚本，观察 loss 和 accuracy 是否正常下降',
    icon: Rocket,
    tag: '他人项目相关',
    tagColor: 'blue',
    code: `# 基础运行
python train.py

# 带参数运行
python train.py --epochs 50 --batch_size 32 --lr 0.001

# 指定 GPU（多卡训练）
CUDA_VISIBLE_DEVICES=0,1 python train.py

# 后台运行（nohup）
nohup python train.py > train.log 2>&1 &
tail -f train.log`,
    lang: 'bash'
  }
]

// ========== 本项目下载指南（绿色标注） ==========
const ownProjectSections = [
  {
    id: 'clone-own',
    title: 'A. 克隆 DeepTrain AI 项目',
    desc: '将本项目下载到你的电脑',
    icon: Github,
    tag: '本项目专用',
    tagColor: 'green',
    code: `git clone https://github.com/kari-yo-yo/deeptrain-ai.git
cd deeptrain-ai`,
    lang: 'bash'
  },
  {
    id: 'frontend-setup',
    title: 'B. 安装并启动前端',
    desc: 'React + Vite 开发服务器',
    icon: Terminal,
    tag: '本项目专用',
    tagColor: 'green',
    code: `cd frontend
npm install
npm run dev`,
    lang: 'bash'
  },
  {
    id: 'backend-setup',
    title: 'C. 安装并启动后端',
    desc: 'FastAPI + SQLite 服务',
    icon: Rocket,
    tag: '本项目专用',
    tagColor: 'green',
    code: `cd ../backend
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000`,
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

const SectionCard = ({ section, tagColor }) => {
  const isBlue = tagColor === 'blue'
  const borderColor = isBlue ? 'border-blue-500/30' : 'border-green-500/30'
  const bgColor = isBlue ? 'bg-blue-500/5' : 'bg-green-500/5'
  const textColor = isBlue ? 'text-blue-400' : 'text-green-400'
  const badgeBg = isBlue ? 'bg-blue-500/10' : 'bg-green-500/10'
  const badgeBorder = isBlue ? 'border-blue-500/20' : 'border-green-500/20'

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center gap-2 mb-3">
        <section.icon size={18} className="text-accent" />
        <h2 className="text-lg font-display font-semibold text-white">{section.title}</h2>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${badgeBg} ${textColor} border ${badgeBorder}`}>
          {section.tag}
        </span>
      </div>
      <p className="text-sm text-slate mb-3">{section.desc}</p>
      <div className={`rounded-xl overflow-hidden border ${borderColor}`}>
        <div className={`flex items-center justify-between px-4 py-2 ${bgColor} border-b ${isBlue ? 'border-blue-500/20' : 'border-green-500/20'}`}>
          <div className="flex items-center gap-2">
            <Terminal size={14} className={textColor} />
            <span className={`text-xs font-mono ${textColor}`}>
              {isBlue ? '他人项目 · 可复用代码' : '本项目 · 直接执行'}
            </span>
          </div>
          <CopyButton text={section.code} />
        </div>
        <CodeBlock code={section.code} language={section.lang} />
      </div>
    </motion.div>
  )
}

const GitHubSetup = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* 页面标题 */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
            <Github size={20} className="text-accent" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">
            GitHub 项目下载与复现指南
          </h1>
        </div>
        <p className="text-slate max-w-2xl">
          本页面包含两部分指南：
          <span className="text-blue-400 font-medium"> 蓝色边框 </span>
          标注的是复现他人项目的通用步骤；
          <span className="text-green-400 font-medium"> 绿色边框 </span>
          标注的是下载本项目的专用命令。
        </p>
      </motion.div>

      {/* ========== Part 1: 他人项目复现（蓝色） ========== */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 rounded-full bg-blue-500" />
          <h2 className="text-xl font-display font-bold text-white">Part 1 · 复现他人的 GitHub 项目</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
            通用指南
          </span>
        </div>
        <p className="text-sm text-slate mb-4 ml-4">
          以下步骤适用于任何 GitHub 上的深度学习项目。每个代码块都可以直接复制使用。
        </p>
      </motion.div>

      {otherProjectSections.map((section) => (
        <SectionCard key={section.id} section={section} tagColor="blue" />
      ))}

      {/* 数据准备详细说明卡片（蓝色强调） */}
      <motion.div variants={itemVariants}>
        <GlassCard className="border-blue-500/20">
          <div className="flex items-start gap-3">
            <Database size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="text-white font-medium">数据准备的核心要点</div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  他人项目相关
                </span>
              </div>
              <ul className="text-sm text-slate space-y-1.5 list-disc list-inside">
                <li><strong className="text-white">查看数据格式</strong>：README 中通常会说明数据集应该放在哪个目录、什么格式</li>
                <li><strong className="text-white">检查数据加载代码</strong>：打开 <code className="text-accent">train.py</code> 或 <code className="text-accent">data_loader.py</code>，找到数据路径配置项</li>
                <li><strong className="text-white">修改路径</strong>：将作者的路径改为你本地的数据路径，例如 <code className="text-accent">./data/cifar10</code> → <code className="text-accent">D:/datasets/cifar10</code></li>
                <li><strong className="text-white">类别数匹配</strong>：确保模型输出的类别数（num_classes）与你的数据集一致</li>
                <li><strong className="text-white">图片尺寸</strong>：检查输入图片尺寸是否符合模型要求（如 224x224）</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 分割线 */}
      <div className="border-t border-navy-lighter" />

      {/* ========== Part 2: 本项目下载（绿色） ========== */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 rounded-full bg-green-500" />
          <h2 className="text-xl font-display font-bold text-white">Part 2 · 下载 DeepTrain AI 本项目</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-500/10 text-green-400 border border-green-500/20">
            本项目专用
          </span>
        </div>
      </motion.div>

      {/* 本项目仓库链接卡片 */}
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

      {ownProjectSections.map((section) => (
        <SectionCard key={section.id} section={section} tagColor="green" />
      ))}

      {/* 项目结构说明 */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-3">
          <FolderTree size={18} className="text-accent" />
          <h2 className="text-lg font-display font-semibold text-white">本项目目录结构</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-500/10 text-green-400 border border-green-500/20">
            本项目专用
          </span>
        </div>
        <p className="text-sm text-slate mb-3">
          了解 DeepTrain AI 的代码组织方式
        </p>
        <div className="rounded-xl overflow-hidden border border-green-500/30">
          <div className="flex items-center px-4 py-2 bg-green-500/5 border-b border-green-500/20">
            <Terminal size={14} className="text-green-400 mr-2" />
            <span className="text-xs text-green-400 font-mono">文件结构</span>
          </div>
          <CodeBlock code={projectStructure.trim()} language="text" />
        </div>
      </motion.div>

      {/* 注意事项 */}
      <motion.div variants={itemVariants}>
        <GlassCard className="border-orange-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-3">
              <div>
                <div className="text-white font-medium mb-1">环境要求</div>
                <ul className="text-sm text-slate space-y-1 list-disc list-inside">
                  <li>Node.js 18+ （前端需要）</li>
                  <li>Python 3.10+ （后端需要）</li>
                  <li>Git （用于克隆仓库）</li>
                </ul>
              </div>
              <div>
                <div className="text-white font-medium mb-1">复现他人项目常见问题</div>
                <ul className="text-sm text-slate space-y-1 list-disc list-inside">
                  <li><strong className="text-white">依赖冲突</strong>：用 conda 创建独立虚拟环境，避免包版本冲突</li>
                  <li><strong className="text-white">CUDA 不匹配</strong>：检查 PyTorch 的 CUDA 版本与你本地的 NVIDIA 驱动是否匹配</li>
                  <li><strong className="text-white">数据路径错误</strong>：这是最常见的错误，务必确认 train.py 中的数据路径指向正确位置</li>
                  <li><strong className="text-white">显存不足</strong>：减小 batch_size，或使用 mixed precision 训练（AMP）</li>
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

export default GitHubSetup
