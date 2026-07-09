import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import Tutorials from './pages/Tutorials'
import Glossary from './pages/Glossary'
import AgentParser from './pages/AgentParser'
import CodeRepo from './pages/CodeRepo'
import CodeCompare from './pages/CodeCompare'
import Visualization from './pages/Visualization'
import GitHubSetup from './pages/GitHubSetup'

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

function App() {
  return (
    <div className="flex h-screen w-full bg-navy-dark overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/tutorials" element={<PageWrapper><Tutorials /></PageWrapper>} />
              <Route path="/glossary" element={<PageWrapper><Glossary /></PageWrapper>} />
              <Route path="/agent" element={<PageWrapper><AgentParser /></PageWrapper>} />
              <Route path="/codes" element={<PageWrapper><CodeRepo /></PageWrapper>} />
              <Route path="/compare" element={<PageWrapper><CodeCompare /></PageWrapper>} />
              <Route path="/viz" element={<PageWrapper><Visualization /></PageWrapper>} />
              <Route path="/github-setup" element={<PageWrapper><GitHubSetup /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="p-6"
    >
      {children}
    </motion.div>
  )
}

export default App
