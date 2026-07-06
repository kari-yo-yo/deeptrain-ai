import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const LossCurve = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate">
        暂无数据
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,255,218,0.1)" />
        <XAxis 
          dataKey="epoch" 
          stroke="#8892b0" 
          tick={{ fill: '#8892b0', fontSize: 12 }}
          label={{ value: 'Epoch', position: 'insideBottom', offset: -5, fill: '#8892b0' }}
        />
        <YAxis 
          stroke="#8892b0" 
          tick={{ fill: '#8892b0', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#112240', 
            border: '1px solid #233554',
            borderRadius: '8px',
            color: '#e6f1ff'
          }}
        />
        <Legend wrapperStyle={{ color: '#8892b0' }} />
        <Line type="monotone" dataKey="train_loss" stroke="#64ffda" strokeWidth={2} dot={false} name="Train Loss" />
        <Line type="monotone" dataKey="val_loss" stroke="#00d4ff" strokeWidth={2} dot={false} name="Val Loss" />
        <Line type="monotone" dataKey="accuracy" stroke="#a78bfa" strokeWidth={2} dot={false} name="Accuracy" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LossCurve
