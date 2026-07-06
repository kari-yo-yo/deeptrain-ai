import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Cpu, FolderGit2, BarChart3, ArrowRight, Sparkles } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import { useApi } from '../hooks/useApi'

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

const quickLinks = [
  { icon: BookOpen, label: '教程中心', desc: '从零开始学习 AutoDL', path: '/tutorials', color: 'text-accent' },
  { icon: Cpu, label: 'Agent 实验室', desc: '粘贴日志智能解析', path: '/agent', color: 'text-blue-400' },
  { icon: FolderGit2, label: '代码仓库', desc: '管理与复用历史代码', path: '/codes', color: 'text-purple-400' },
  { icon: BarChart3, label: '可视化', desc: 'Loss 曲线与数据分布', path: '/viz', color: 'text-orange-400' },
]

const Dashboard = () => {
  const [stats, setStats] = useState({ tutorials: 0, terms: 0, logs: 0 })
  const { get } = useApi()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tutorials, terms, logs] = await Promise.all([
          get('/api/tutorials').catch(() => []),
          get('/api/glossary').catch(() => []),
          get('/api/agent/logs').catch(() => []),
        ])
        setStats({
          tutorials: Array.isArray(tutorials) ? tutorials.length : 0,
          terms: Array.isArray(terms) ? terms.length : 0,
          logs: Array.isArray(logs) ? logs.length : 0,
        })
      } catch (e) {
        console.error('Stats fetch failed', e)
      }
    }
    fetchStats()
  }, [get])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Hero */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl border border-navy-lighter bg-navy-light p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-accent" />
            <span className="text-sm font-mono text-accent">DeepTrain AI v0.1.0</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-3">
            深度学习训练助手
          </h1>
          <p className="text-slate max-w-xl">
            专为 AutoDL 平台打造的智能训练管理工具。从入门教程到代码自动归档，
            让每一次训练都有迹可循。
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <GlassCard hover={false} className="text-center">
          <div className="text-2xl font-display font-bold text-accent">{stats.tutorials}</div>
          <div className="text-xs text-slate mt-1">教程章节</div>
        </GlassCard>
        <GlassCard hover={false} className="text-center">
          <div className="text-2xl font-display font-bold text-accent-dark">{stats.terms}</div>
          <div className="text-xs text-slate mt-1">术语词条</div>
        </GlassCard>
        <GlassCard hover={false} className="text-center">
          <div className="text-2xl font-display font-bold text-white">{stats.logs}</div>
          <div className="text-xs text-slate mt-1">已归档日志</div>
        </GlassCard>
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-display font-semibold text-white mb-4">快速入口</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <GlassCard
              key={link.path}
              onClick={() => window.location.href = link.path}
              className="flex items-center gap-4 group"
            >
              <div className={`p-3 rounded-lg bg-navy-dark border border-navy-lighter ${link.color}`}>
                <link.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium group-hover:text-accent transition-colors">
                  {link.label}
                </div>
                <div className="text-xs text-slate">{link.desc}</div>
              </div>
              <ArrowRight size={16} className="text-slate group-hover:text-accent transition-colors" />
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard
