import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Cpu,
  FolderGit2,
  GitCompare,
  BarChart3,
  Github,
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '总览看板' },
  { path: '/tutorials', icon: BookOpen, label: '教程中心' },
  { path: '/glossary', icon: HelpCircle, label: '术语词典' },
  { path: '/agent', icon: Cpu, label: 'Agent 实验室' },
  { path: '/codes', icon: FolderGit2, label: '代码仓库' },
  { path: '/compare', icon: GitCompare, label: '代码对比' },
  { path: '/viz', icon: BarChart3, label: '可视化' },
  { path: '/github-setup', icon: Github, label: '项目源码' },
]

const Sidebar = () => {
  return (
    <aside className="w-64 h-full glass flex flex-col z-10">
      <div className="p-6 border-b border-navy-lighter">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Cpu size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="text-white font-display font-bold text-lg leading-tight">DeepTrain</h1>
            <p className="text-xs text-slate font-mono">AI 训练助手</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive 
                ? 'bg-accent/10 text-accent border border-accent/20' 
                : 'text-slate hover:text-white hover:bg-navy-light'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-navy-lighter">
        <div className="glass rounded-lg p-3 text-xs text-slate">
          <p className="font-mono text-accent mb-1">v0.1.0</p>
          <p>DeepTrain AI 训练助手</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
