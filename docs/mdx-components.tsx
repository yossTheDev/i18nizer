import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'
import { DocLayout } from '@/components/DocLayout'

// Helper function to generate heading IDs
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

// Track used IDs to make them unique
const usedIds = new Map<string, number>()

function getUniqueId(text: string): string {
  const baseId = generateId(text)
  const count = usedIds.get(baseId) || 0
  usedIds.set(baseId, count + 1)
  
  return count === 0 ? baseId : `${baseId}-${count}`
}

// Heading components with auto-generated IDs
function createHeading(level: number) {
  return ({ children }: { children?: ReactNode }) => {
    const text = typeof children === 'string' ? children : String(children)
    const id = getUniqueId(text)
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

    return (
      <Tag id={id}>
        {children}
      </Tag>
    )
  }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  // Reset used IDs for each page
  usedIds.clear()
  
  return {
    wrapper: ({ children }: { children: ReactNode }) => (
      <DocLayout>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {children}
        </div>
      </DocLayout>
    ),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    ...components,
  }
}
