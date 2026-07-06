import React from 'react'
import { motion } from 'framer-motion'

const NeonButton = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseStyles = "px-6 py-3 rounded-lg font-mono text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: `
      bg-transparent border border-accent text-accent
      hover:bg-accent/10 hover:shadow-[0_0_20px_rgba(100,255,218,0.3)]
      active:bg-accent/20
    `,
    secondary: `
      bg-navy-light border border-navy-lighter text-slate-light
      hover:border-slate hover:text-white
    `,
    danger: `
      bg-transparent border border-red-400 text-red-400
      hover:bg-red-400/10 hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]
    `,
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  )
}

export default NeonButton
