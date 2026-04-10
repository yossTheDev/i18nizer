'use client'

import { useEffect, useState } from 'react'
import hljs from 'highlight.js/lib/core'
import { Check, Copy } from 'lucide-react'

// Import commonly used languages
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('tsx', typescript)
hljs.registerLanguage('jsx', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)

export function CodeHighlight() {
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    // Highlight all code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      if (!block.classList.contains('hljs')) {
        hljs.highlightElement(block as HTMLElement)

        // Add copy button
        const pre = block.parentElement
        if (pre && !pre.querySelector('.copy-button')) {
          pre.style.position = 'relative'
          pre.classList.add('group')

          const button = document.createElement('button')
          button.className = 'copy-button absolute right-4 top-4 p-2 rounded-lg bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 text-terminal-white/50 hover:text-white'
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'

          button.onclick = () => {
            const text = block.textContent || ''
            navigator.clipboard.writeText(text).then(() => {
              button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
              setTimeout(() => {
                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
              }, 2000)
            })
          }

          pre.appendChild(button)
        }
      }
    })
  }, [])

  return null
}
