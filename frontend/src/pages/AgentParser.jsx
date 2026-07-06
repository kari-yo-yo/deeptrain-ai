import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Wand2, Save, AlertTriangle, Code2, BarChart3, FileText } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import CodeBlock from '../components/ui/CodeBlock'
import MetricBadge from '../components/ui/MetricBadge'
import { useApi } from '../hooks/useApi'
import { MODEL_ARCHITECTURES, DATASETS } from '../utils/constants'

const TABS = [
  { key: 'overview', label: '概览', icon: FileText },
  { key: 'metrics', label: '训练指标', icon: BarChart3 },
  { key: 'codes', label: '提取代码', icon: Code2 },
  { key: 'errors', label: '异常检测', icon: AlertTriangle },
]

const AgentParser = () => {
  const [rawLog, setRawLog] = useState('')
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [projectName, setProjectName] = useState('')
  const [dataset, setDataset] = useState('')
  const [modelArch, setModelArch] = useState('')
  const { post, loading, isStaticMode } = useApi()

  const handleParse = async () => {
    if (!rawLog.trim()) return
    if (isStaticMode) {
      alert('智能解析功能需要连接后端服务。请配置 VITE_API_BASE_URL 环境变量后重新构建。')
      return
    }
    try {
      const data = await post('/api/agent/parse', { raw_log: rawLog })
      setResult(data)
      setActiveTab('overview')
    } catch (e) {
      console.error('Parse failed', e)
    }
  }

  const handleSave = async () => {
    if (!rawLog.trim()) return
    if (isStaticMode) {
      alert('保存功能需要连接后端服务。请配置 VITE_API_BASE_URL 环境变量后重新构建。')
      return
    }
    try {
      const formData = new URLSearchParams()
      formData.append('project_name', projectName || '未命名项目')
      formData.append('dataset', dataset)
      formData.append('model_arch', modelArch)
      formData.append('raw_log', rawLog)
      
      const response = await fetch('/api/agent/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      })
      if (response.ok) {
        alert('保存成功！')
      }
    } catch (e) {
      console.error('Save failed', e)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Cpu size={24} className="text-accent" />
          Agent 实验室
        </h1>
        <p className="text-sm text-slate mt-1">粘贴 AutoDL 终端运行日志，AI 自动解析并归档</p>
      </div>

      {/* Input Section */}
      <GlassCard hover={false} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-light mb-2">运行日志</label>
          <textarea
            value={rawLog}
            onChange={(e) => setRawLog(e.target.value)}
            placeholder="在此粘贴你的训练日志...\n例如：\nEpoch 1/10\nloss: 2.3456, accuracy: 0.1234\n..."
            className="w-full h-48 p-4 rounded-lg bg-navy-dark border border-navy-lighter text-white placeholder-slate font-mono text-sm resize-y focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs text-slate mb-1">项目名称</label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="未命名项目"
              className="w-full px-3 py-2 rounded-lg bg-navy-dark border border-navy-lighter text-white text-sm focus:outline-none focus:border-accent/50"
            />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1">数据集</label>
            <select
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-navy-dark border border-navy-lighter text-white text-sm focus:outline-none focus:border-accent/50"
            >
              <option value="">选择数据集</option>
              {DATASETS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate mb-1">模型架构</label>
            <select
              value={modelArch}
              onChange={(e) => setModelArch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-navy-dark border border-navy-lighter text-white text-sm focus:outline-none focus:border-accent/50"
            >
              <option value="">选择模型</option>
              {MODEL_ARCHITECTURES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <NeonButton onClick={handleParse} disabled={loading || !rawLog.trim()}>
            <Wand2 size={16} className="inline mr-2" />
            {loading ? '解析中...' : '智能解析'}
          </NeonButton>
          <NeonButton variant="secondary" onClick={handleSave} disabled={!rawLog.trim()}>
            <Save size={16} className="inline mr-2" />
            保存到仓库
          </NeonButton>
        </div>
      </GlassCard>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Status Badge */}
            <div className="mb-4 flex items-center gap-3">
              <MetricBadge status={result.status} label="解析状态" />
              {result.errors.length > 0 && (
                <MetricBadge status="failed" label="异常" value={result.errors.length} />
              )}
              <span className="text-xs text-slate">
                共 {result.meta.total_lines} 行 · {result.epochs.length} 个 epoch · {result.code_blocks.length} 个代码块
              </span>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-navy-lighter pb-2">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-accent/10 text-accent'
                      : 'text-slate hover:text-white hover:bg-navy-light'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <GlassCard hover={false}>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(result.meta).filter(([k]) => !['total_lines', 'log_size'].includes(k)).map(([key, value]) => (
                    <div key={key} className="p-3 rounded-lg bg-navy-dark border border-navy-lighter">
                      <div className="text-xs text-slate uppercase">{key}</div>
                      <div className="text-white font-mono">{value}</div>
                    </div>
                  ))}
                  {Object.entries(result.meta).filter(([k]) => !['total_lines', 'log_size'].includes(k)).length === 0 && (
                    <div className="col-span-2 text-slate text-sm">未提取到元数据</div>
                  )}
                </div>
              )}

              {activeTab === 'metrics' && (
                <div className="overflow-x-auto">
                  {result.epochs.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-navy-lighter text-slate">
                          <th className="text-left py-2 px-3">Epoch</th>
                          <th className="text-left py-2 px-3">Loss</th>
                          <th className="text-left py-2 px-3">Accuracy</th>
                          <th className="text-left py-2 px-3">LR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.epochs.map((ep, i) => (
                          <tr key={i} className="border-b border-navy-lighter/50 text-white">
                            <td className="py-2 px-3 font-mono">{ep.epoch ?? '-'}</td>
                            <td className="py-2 px-3 font-mono text-accent">{ep.train_loss?.toFixed(4) ?? '-'}</td>
                            <td className="py-2 px-3 font-mono">{ep.accuracy?.toFixed(4) ?? '-'}</td>
                            <td className="py-2 px-3 font-mono text-slate">{ep.learning_rate?.toExponential(2) ?? '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-slate text-sm">未检测到训练指标</div>
                  )}
                </div>
              )}

              {activeTab === 'codes' && (
                <div className="space-y-4">
                  {result.code_blocks.length > 0 ? (
                    result.code_blocks.map((block, i) => (
                      <CodeBlock key={i} code={block.code} language={block.language} title={`代码片段 ${i+1}`} />
                    ))
                  ) : (
                    <div className="text-slate text-sm">未提取到代码块</div>
                  )}
                </div>
              )}

              {activeTab === 'errors' && (
                <div className="space-y-2">
                  {result.errors.length > 0 ? (
                    result.errors.map((err, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-sm">
                        <AlertTriangle size={16} />
                        {err}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-accent text-sm">
                      <CheckCircle size={16} />
                      未检测到异常
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AgentParser
