import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'
import { DocLayout } from '@/components/DocLayout'

// Helper function to generate heading IDs
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^\w-]/g, '')
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
    ...components,
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
    table: ({ children }: { children: ReactNode }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: { children: ReactNode }) => (
      <thead className="bg-gray-50 dark:bg-gray-800">
        {children}
      </thead>
    ),
    tbody: ({ children }: { children: ReactNode }) => (
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
        {children}
      </tbody>
    ),
    tr: ({ children }: { children: ReactNode }) => (
      <tr>
        {children}
      </tr>
    ),
    th: ({ children }: { children: ReactNode }) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }: { children: ReactNode }) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
        {children}
      </td>
    ),
  }
}
