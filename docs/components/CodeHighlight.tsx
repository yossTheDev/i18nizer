'use client'

import { useEffect } from 'react'
import hljs from 'highlight.js/lib/core'

// Import commonly used languages
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import tsx from 'highlight.js/lib/languages/typescript' // TSX uses TypeScript highlighter
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml' // For HTML/JSX

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('tsx', tsx)
hljs.registerLanguage('jsx', tsx)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)

export function CodeHighlight() {
  useEffect(() => {
    // Highlight all code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      // Only highlight if not already highlighted
      if (!block.classList.contains('hljs')) {
        hljs.highlightElement(block as HTMLElement)
      }
    })
  }, [])

  return null
}
