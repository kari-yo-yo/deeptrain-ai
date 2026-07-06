import React from 'react'
import { motion } from 'framer-motion'

const GlassCard = ({ children, className = '', hover = true, onClick }) => {
  return (
    <motion.div
      className={`
        glass rounded-xl p-5 
        ${hover ? 'glass-hover transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard
