import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const DataHistogram = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate">
        暂无数据
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,255,218,0.1)" />
        <XAxis 
          dataKey="name" 
          stroke="#8892b0" 
          tick={{ fill: '#8892b0', fontSize: 12 }}
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
        <Bar dataKey="count" fill="#64ffda" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default DataHistogram
