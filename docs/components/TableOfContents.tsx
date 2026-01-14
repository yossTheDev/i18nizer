'use client'

import { useEffect, useState, useRef } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

// Helper function to generate heading IDs (matches mdx-components.tsx)
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Extract headings from the page
    const extractedHeadings: Heading[] = []
    const elements = document.querySelectorAll('h2, h3, h4')
    
    elements.forEach((element) => {
      // Use the existing ID if available (set by mdx-components.tsx)
      const id = element.id
      
      if (id) {
        extractedHeadings.push({
          id,
          text: element.textContent || '',
          level: parseInt(element.tagName.substring(1)),
        })
      }
    })
    
    setHeadings(extractedHeadings)
  }, [])

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create Intersection Observer for active section tracking
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    )

    // Observe all heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element && observerRef.current) {
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [headings])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Update URL without triggering navigation
      window.history.pushState(null, '', `#${id}`)
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav 
      className="hidden xl:block sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto"
      aria-label="Table of contents"
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        On This Page
      </h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          const marginLeft = (heading.level - 2) * 16
          
          return (
            <li
              key={heading.id}
              style={{ marginLeft: `${marginLeft}px` }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`
                  block py-1 transition-colors hover:text-primary-600 dark:hover:text-primary-400
                  ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }
                `}
                aria-current={isActive ? 'location' : undefined}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
