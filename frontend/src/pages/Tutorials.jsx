import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useApi } from '../hooks/useApi'

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState(new Set())
  const { get, loading } = useApi()

  useEffect(() => {
    get('/api/tutorials').then(data => {
      if (Array.isArray(data)) setTutorials(data)
    }).catch(console.error)
  }, [get])

  const current = tutorials[currentIndex]
  const progress = tutorials.length > 0 ? ((completed.size / tutorials.length) * 100).toFixed(0) : 0

  const handleNext = () => {
    if (currentIndex < tutorials.length - 1) {
      setCompleted(prev => new Set(prev).add(current.id))
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1)
  }

  const renderMarkdown = (content) => {
    if (!content) return null
    const lines = content.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-xl font-display font-bold text-white mt-6 mb-3">{line.replace('## ', '')}</h3>
      }
      if (line.startsWith('### ')) {
        return <h4 key={i} className="text-lg font-semibold text-slate-lighter mt-4 mb-2">{line.replace('### ', '')}</h4>
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 text-slate-light">{line.replace('- ', '')}</li>
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        return <li key={i} className="ml-4 text-slate-light">{line.substring(3)}</li>
      }
      if (line.startsWith('```')) {
        return null
      }
      if (line.match(/^\d+\./)) {
        return <li key={i} className="ml-4 text-slate-light">{line.substring(line.indexOf('.') + 1).trim()}</li>
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />
      }
      return <p key={i} className="text-slate-light leading-relaxed">{line}</p>
    })
  }

  if (loading || tutorials.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate">加载中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <BookOpen size={24} className="text-accent" />
            教程中心
          </h1>
          <p className="text-sm text-slate mt-1">跟随指引，快速上手 AutoDL 深度学习训练</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate">
            进度 <span className="text-accent font-mono font-bold">{progress}%</span>
          </div>
          <div className="w-32 h-2 bg-navy-lighter rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Step Navigation */}
        <div className="w-64 shrink-0">
          <div className="space-y-2">
            {tutorials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 ${
                  i === currentIndex
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : completed.has(t.id)
                    ? 'text-slate-light hover:bg-navy-light'
                    : 'text-slate hover:text-white hover:bg-navy-light'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                  completed.has(t.id)
                    ? 'bg-accent/20 text-accent'
                    : i === currentIndex
                    ? 'bg-accent text-navy-dark'
                    : 'bg-navy-lighter text-slate'
                }`}>
                  {completed.has(t.id) ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className="truncate">{t.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hover={false} className="min-h-[400px]">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 rounded text-xs font-mono bg-accent/10 text-accent border border-accent/20">
                      步骤 {currentIndex + 1} / {tutorials.length}
                    </span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white mb-6">{current.title}</h2>
                  <div className="prose prose-invert max-w-none">
                    {renderMarkdown(current.content)}
                  </div>
                </GlassCard>

                <div className="flex justify-between mt-6">
                  <NeonButton
                    variant="secondary"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft size={16} className="inline mr-1" />
                    上一步
                  </NeonButton>
                  <NeonButton
                    onClick={handleNext}
                    disabled={currentIndex === tutorials.length - 1}
                  >
                    {currentIndex === tutorials.length - 1 ? '已完成' : '下一步'}
                    <ChevronRight size={16} className="inline ml-1" />
                  </NeonButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Tutorials
