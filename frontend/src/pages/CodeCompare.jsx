import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitCompare, ArrowRight } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useApi } from '../hooks/useApi'

const CodeCompare = () => {
  const [codes, setCodes] = useState([])
  const [sourceId, setSourceId] = useState('')
  const [targetId, setTargetId] = useState('')
  const [diffResult, setDiffResult] = useState(null)
  const { get, loading } = useApi()

  useEffect(() => {
    get('/api/codes').then(data => {
      if (Array.isArray(data)) setCodes(data)
    }).catch(console.error)
  }, [get])

  const handleCompare = async () => {
    if (!sourceId || !targetId) return
    try {
      const data = await get(`/api/codes/${sourceId}/diff?target_id=${targetId}`)
      setDiffResult(data)
    } catch (e) {
      console.error('Diff failed', e)
    }
  }

  const computeLineDiff = (source, target) => {
    const sourceLines = source.split('\n')
    const targetLines = target.split('\n')
    const maxLen = Math.max(sourceLines.length, targetLines.length)
    const result = []
    
    for (let i = 0; i < maxLen; i++) {
      const s = sourceLines[i] || ''
      const t = targetLines[i] || ''
      if (s === t) {
        result.push({ type: 'same', line: i + 1, content: s })
      } else if (!t) {
        result.push({ type: 'removed', line: i + 1, content: s })
      } else if (!s) {
        result.push({ type: 'added', line: i + 1, content: t })
      } else {
        result.push({ type: 'removed', line: i + 1, content: s })
        result.push({ type: 'added', line: i + 1, content: t })
      }
    }
    return result
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <GitCompare size={24} className="text-accent" />
          代码对比
        </h1>
        <p className="text-sm text-slate mt-1">选择两个版本，查看代码差异</p>
      </div>

      <GlassCard hover={false} className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs text-slate mb-1">源版本</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-navy-dark border border-navy-lighter text-white text-sm focus:outline-none focus:border-accent/50"
            >
              <option value="">选择版本</option>
              {codes.map(c => (
                <option key={c.id} value={c.id}>{c.project_name} ({new Date(c.created_at).toLocaleDateString()})</option>
              ))}
            </select>
          </div>
          <ArrowRight size={20} className="text-slate mt-5" />
          <div className="flex-1">
            <label className="block text-xs text-slate mb-1">目标版本</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-navy-dark border border-navy-lighter text-white text-sm focus:outline-none focus:border-accent/50"
            >
              <option value="">选择版本</option>
              {codes.map(c => (
                <option key={c.id} value={c.id}>{c.project_name} ({new Date(c.created_at).toLocaleDateString()})</option>
              ))}
            </select>
          </div>
          <div className="mt-5">
            <NeonButton onClick={handleCompare} disabled={!sourceId || !targetId || loading}>
              对比
            </NeonButton>
          </div>
        </div>
      </GlassCard>

      {diffResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 p-3 rounded-lg bg-navy-light border border-navy-lighter">
              <div className="text-xs text-slate">源版本</div>
              <div className="text-white font-medium">{diffResult.source.project_name}</div>
            </div>
            <div className="flex-1 p-3 rounded-lg bg-navy-light border border-navy-lighter">
              <div className="text-xs text-slate">目标版本</div>
              <div className="text-white font-medium">{diffResult.target.project_name}</div>
            </div>
          </div>

          {diffResult.source.code_snippets.map((s, i) => {
            const t = diffResult.target.code_snippets[i]
            if (!t) return null
            const diffLines = computeLineDiff(s.code, t.code)
            return (
              <GlassCard key={i} hover={false} className="mb-4">
                <div className="text-sm font-medium text-white mb-3">{s.title}</div>
                <div className="rounded-lg overflow-hidden border border-navy-lighter">
                  <table className="w-full text-xs font-mono">
                    <tbody>
                      {diffLines.map((line, j) => (
                        <tr key={j} className={
                          line.type === 'added' ? 'bg-green-400/10' :
                          line.type === 'removed' ? 'bg-red-400/10' :
                          'bg-navy-dark'
                        }>
                          <td className="py-1 px-2 w-8 text-right text-slate select-none">{line.line}</td>
                          <td className="py-1 px-2 w-6 text-center select-none">
                            {line.type === 'added' ? <span className="text-green-400">+</span> :
                             line.type === 'removed' ? <span className="text-red-400">-</span> :
                             <span className="text-slate"> </span>}
                          </td>
                          <td className={`py-1 px-2 whitespace-pre ${
                            line.type === 'added' ? 'text-green-400' :
                            line.type === 'removed' ? 'text-red-400' :
                            'text-slate-light'
                          }`}>
                            {line.content || ' '}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

export default CodeCompare
