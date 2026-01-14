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

// Heading components with auto-generated IDs
function createHeading(level: number, usedIds: Map<string, number>) {
  return ({ children }: { children?: ReactNode }) => {
    const text = typeof children === 'string' ? children : String(children)
    const baseId = generateId(text)
    const count = usedIds.get(baseId) || 0
    const id = count === 0 ? baseId : `${baseId}-${count}`
    usedIds.set(baseId, count + 1)
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

    return (
      <Tag id={id}>
        {children}
      </Tag>
    )
  }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  // Create a new Map for each page to track used IDs
  const usedIds = new Map<string, number>()
  
  return {
    wrapper: ({ children }: { children: ReactNode }) => (
      <DocLayout>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {children}
        </div>
      </DocLayout>
    ),
    h2: createHeading(2, usedIds),
    h3: createHeading(3, usedIds),
    h4: createHeading(4, usedIds),
    ...components,
  }
}
