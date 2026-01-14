import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    wrapper: ({ children }: { children: ReactNode }) => (
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {children}
      </div>
    ),
    ...components,
  }
}
