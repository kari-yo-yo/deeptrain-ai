import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

const CodeBlock = ({ code, language = 'python', title = '' }) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-navy-lighter bg-[#1a1a2e]">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-navy-light border-b border-navy-lighter">
          <span className="text-xs font-mono text-slate">{title}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate hover:text-accent transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? '已复制' : '复制'}
          </button>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          fontSize: '0.85rem',
          lineHeight: '1.6',
          background: 'transparent',
        }}
        showLineNumbers
        lineNumberStyle={{
          color: '#4a5568',
          paddingRight: '1rem',
          minWidth: '2.5rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlock
