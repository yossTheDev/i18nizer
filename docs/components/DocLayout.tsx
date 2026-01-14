'use client'

import { TableOfContents } from '@/components/TableOfContents'
import { CodeHighlight } from '@/components/CodeHighlight'
import type { ReactNode } from 'react'

export function DocLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CodeHighlight />
      <div className="flex gap-8">
        <article className="flex-1 min-w-0">
          {children}
        </article>
        <aside className="w-64 flex-shrink-0">
          <TableOfContents />
        </aside>
      </div>
    </>
  )
}
