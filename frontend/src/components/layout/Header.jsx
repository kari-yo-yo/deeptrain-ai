import React from 'react'
import { Github, ExternalLink } from 'lucide-react'

const Header = () => {
  return (
    <header className="h-16 glass border-b border-navy-lighter flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-white font-display font-semibold">深度学习训练助手</h2>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent/10 text-accent border border-accent/20">
          BETA
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate hover:text-white transition-colors"
        >
          <Github size={20} />
        </a>
        <a
          href="https://www.autodl.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-slate hover:text-accent transition-colors"
        >
          <span>AutoDL</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </header>
  )
}

export default Header
