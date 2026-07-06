import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Activity } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import LossCurve from '../components/charts/LossCurve'
import DataHistogram from '../components/charts/DataHistogram'
import MetricDashboard from '../components/charts/MetricDashboard'
import { useApi } from '../hooks/useApi'

const Visualization = () => {
  const [logs, setLogs] = useState([])
  const [selectedLogId, setSelectedLogId] = useState('')
  const [metricsData, setMetricsData] = useState([])
  const [histogramData, setHistogramData] = useState([])
  const { get, loading } = useApi()

  useEffect(() => {
    get('/api/codes').then(data => {
      if (Array.isArray(data)) {
        setLogs(data)
        if (data.length > 0) {
          setSelectedLogId(String(data[0].id))
        }
      }
    }).catch(console.error)
    
    get('/api/viz/histogram').then(data => {
      if (data?.categories) setHistogramData(data.categories)
    }).catch(console.error)
  }, [get])

  useEffect(() => {
    if (!selectedLogId) return
    get(`/api/viz/metrics/${selectedLogId}`).then(data => {
      if (data?.data) setMetricsData(data.data)
    }).catch(console.error)
  }, [selectedLogId, get])

  const dashboardMetrics = {
    gpu_util: '87%',
    vram: '18.2 GB',
    current_loss: metricsData.length > 0 ? metricsData[metricsData.length - 1].train_loss : null,
    eta: '12 min',
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <BarChart3 size={24} className="text-accent" />
          数据可视化
        </h1>
        <p className="text-sm text-slate mt-1">训练指标曲线、数据分布与监控仪表盘</p>
      </div>

      {/* Metric Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <MetricDashboard metrics={dashboardMetrics} />
      </motion.div>

      {/* Loss Curve */}
      <GlassCard hover={false} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-accent" />
            <h3 className="text-white font-medium">Loss / Accuracy 曲线</h3>
          </div>
          <select
            value={selectedLogId}
            onChange={(e) => setSelectedLogId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-navy-dark border border-navy-lighter text-white text-sm focus:outline-none focus:border-accent/50"
          >
            {logs.map(log => (
              <option key={log.id} value={log.id}>{log.project_name}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="text-center text-slate py-12">加载中...</div>
        ) : (
          <LossCurve data={metricsData} />
        )}
      </GlassCard>

      {/* Data Histogram */}
      <GlassCard hover={false}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-accent" />
          <h3 className="text-white font-medium">数据分布</h3>
        </div>
        <DataHistogram data={histogramData} />
      </GlassCard>
    </div>
  )
}

export default Visualization
