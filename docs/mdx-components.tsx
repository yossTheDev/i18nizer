import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {children}
      </div>
    ),
    ...components,
  }
}
