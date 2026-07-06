import React from 'react'
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const statusConfig = {
  success: { icon: CheckCircle, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30' },
  running: { icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  failed: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
}

const MetricBadge = ({ status = 'success', label, value }) => {
  const config = statusConfig[status] || statusConfig.success
  const Icon = config.icon

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bg} ${config.border}`}>
      <Icon size={14} className={config.color} />
      {label && <span className="text-xs text-slate-light">{label}</span>}
      {value && <span className={`text-xs font-mono font-medium ${config.color}`}>{value}</span>}
    </div>
  )
}

export default MetricBadge
