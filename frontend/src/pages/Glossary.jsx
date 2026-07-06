import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, HelpCircle } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import { useApi } from '../hooks/useApi'
import { TERM_CATEGORIES } from '../utils/constants'

const Glossary = () => {
  const [terms, setTerms] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [hoveredTerm, setHoveredTerm] = useState(null)
  const { get, loading } = useApi()

  useEffect(() => {
    get('/api/glossary').then(data => {
      if (Array.isArray(data)) setTerms(data)
    }).catch(console.error)
  }, [get])

  const filteredTerms = terms.filter(term => {
    const matchesSearch = !searchQuery || 
      term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.short_desc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || term.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const categoryLabels = {
    training: '训练',
    model: '模型',
    data: '数据',
    hardware: '硬件',
    general: '通用',
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <HelpCircle size={24} className="text-accent" />
          术语词典
        </h1>
        <p className="text-sm text-slate mt-1">悬停查看详细解释，快速掌握深度学习核心概念</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input
            type="text"
            placeholder="搜索术语..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-navy-light border border-navy-lighter text-white placeholder-slate focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TERM_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? 'bg-accent/10 text-accent border border-accent/30'
                  : 'bg-navy-light text-slate border border-navy-lighter hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      {loading ? (
        <div className="text-center text-slate py-12">加载中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredTerms.map((term) => (
              <motion.div
                key={term.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard
                  hover={true}
                  className="relative"
                  onMouseEnter={() => setHoveredTerm(term.id)}
                  onMouseLeave={() => setHoveredTerm(null)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-display font-semibold text-white">{term.name}</h3>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-navy-dark text-slate border border-navy-lighter">
                      {categoryLabels[term.category] || term.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-light">{term.short_desc}</p>
                  
                  <AnimatePresence>
                    {hoveredTerm === term.id && term.full_desc && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-navy-lighter">
                          <p className="text-sm text-slate leading-relaxed">{term.full_desc}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredTerms.length === 0 && !loading && (
        <div className="text-center text-slate py-12">
          <HelpCircle size={48} className="mx-auto mb-3 opacity-30" />
          <p>未找到匹配的术语</p>
        </div>
      )}
    </div>
  )
}

export default Glossary
