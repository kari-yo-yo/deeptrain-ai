import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderGit2, Search, Calendar, Tag, Trash2, Eye } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import MetricBadge from '../components/ui/MetricBadge'
import { useApi } from '../hooks/useApi'

const CodeRepo = () => {
  const [codes, setCodes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCode, setSelectedCode] = useState(null)
  const { get, del, loading } = useApi()

  useEffect(() => {
    fetchCodes()
  }, [])

  const fetchCodes = () => {
    get('/api/codes').then(data => {
      if (Array.isArray(data)) setCodes(data)
    }).catch(console.error)
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除这条记录吗？')) return
    try {
      await del(`/api/codes/${id}`)
      fetchCodes()
      if (selectedCode?.id === id) setSelectedCode(null)
    } catch (e) {
      console.error('Delete failed', e)
    }
  }

  const filteredCodes = codes.filter(code => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      code.project_name?.toLowerCase().includes(q) ||
      code.dataset?.toLowerCase().includes(q) ||
      code.model_arch?.toLowerCase().includes(q)
    )
  })

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <FolderGit2 size={24} className="text-accent" />
          代码仓库
        </h1>
        <p className="text-sm text-slate mt-1">浏览、搜索和管理 AI Agent 归档的历史代码</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input
            type="text"
            placeholder="搜索项目、数据集或模型..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-navy-light border border-navy-lighter text-white placeholder-slate focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code List */}
        <div className="space-y-3">
          {loading && <div className="text-slate text-center py-8">加载中...</div>}
          {filteredCodes.map((code) => (
            <motion.div
              key={code.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GlassCard
                hover={true}
                onClick={() => setSelectedCode(code)}
                className={selectedCode?.id === code.id ? 'border-accent/30' : ''}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-medium truncate">{code.project_name}</h3>
                  <MetricBadge status={code.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate mb-2">
                  {code.dataset && (
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {code.dataset}
                    </span>
                  )}
                  {code.model_arch && (
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {code.model_arch}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(code.created_at)}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(code.id) }}
                    className="text-slate hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
          {filteredCodes.length === 0 && !loading && (
            <div className="text-center text-slate py-12">
              <FolderGit2 size={48} className="mx-auto mb-3 opacity-30" />
              <p>暂无代码记录</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div>
          {selectedCode ? (
            <GlassCard hover={false} className="sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-semibold text-white">{selectedCode.project_name}</h3>
                <MetricBadge status={selectedCode.status} />
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">数据集</span>
                  <span className="text-white">{selectedCode.dataset || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">模型架构</span>
                  <span className="text-white">{selectedCode.model_arch || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">创建时间</span>
                  <span className="text-white font-mono">{formatDate(selectedCode.created_at)}</span>
                </div>
              </div>

              <div className="border-t border-navy-lighter pt-4">
                <h4 className="text-sm font-medium text-slate-light mb-2">原始日志（前 20 行）</h4>
                <div className="p-3 rounded-lg bg-navy-dark border border-navy-lighter max-h-64 overflow-y-auto">
                  <pre className="text-xs font-mono text-slate whitespace-pre-wrap">
                    {selectedCode.raw_log?.split('\n').slice(0, 20).join('\n')}
                    {(selectedCode.raw_log?.split('\n').length || 0) > 20 && '\n...'}
                  </pre>
                </div>
              </div>

              {selectedCode.code_snippets?.length > 0 && (
                <div className="border-t border-navy-lighter pt-4 mt-4">
                  <h4 className="text-sm font-medium text-slate-light mb-2">
                    提取的代码 ({selectedCode.code_snippets.length})
                  </h4>
                  {selectedCode.code_snippets.map((snippet, i) => (
                    <div key={i} className="mb-2 p-2 rounded bg-navy-dark border border-navy-lighter">
                      <div className="text-xs text-accent mb-1">{snippet.title}</div>
                      <pre className="text-xs font-mono text-slate truncate">{snippet.code.substring(0, 100)}...</pre>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          ) : (
            <div className="text-center text-slate py-12">
              <Eye size={48} className="mx-auto mb-3 opacity-30" />
              <p>选择左侧卡片查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeRepo
