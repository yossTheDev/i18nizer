'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from the page
    const extractedHeadings: Heading[] = []
    const elements = document.querySelectorAll('h2, h3, h4')
    
    elements.forEach((element) => {
      const id = element.id || element.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || ''
      
      // Set id if it doesn't exist
      if (!element.id && id) {
        element.id = id
      }
      
      if (id) {
        extractedHeadings.push({
          id: element.id,
          text: element.textContent || '',
          level: parseInt(element.tagName.substring(1)),
        })
      }
    })
    
    setHeadings(extractedHeadings)
  }, [])

  useEffect(() => {
    // Intersection Observer for active section tracking
    const observer = new IntersectionObserver(
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

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
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
