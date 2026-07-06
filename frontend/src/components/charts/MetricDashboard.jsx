import React from 'react'
import { Activity, MemoryStick, Clock, TrendingDown } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

const MetricDashboard = ({ metrics = {} }) => {
  const cards = [
    { 
      icon: Activity, 
      label: 'GPU 利用率', 
      value: metrics.gpu_util || '0%', 
      color: 'text-accent',
      bg: 'bg-accent/10'
    },
    { 
      icon: MemoryStick, 
      label: '显存占用', 
      value: metrics.vram || '0 GB', 
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    { 
      icon: TrendingDown, 
      label: '当前 Loss', 
      value: metrics.current_loss?.toFixed(4) || '-', 
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    { 
      icon: Clock, 
      label: '预估剩余', 
      value: metrics.eta || '-', 
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <GlassCard key={i} hover={false} className="text-center">
          <div className={`inline-flex p-2 rounded-lg ${card.bg} ${card.color} mb-3`}>
            <card.icon size={20} />
          </div>
          <div className={`text-2xl font-display font-bold ${card.color} mb-1`}>
            {card.value}
          </div>
          <div className="text-xs text-slate">{card.label}</div>
        </GlassCard>
      ))}
    </div>
  )
}

export default MetricDashboard
