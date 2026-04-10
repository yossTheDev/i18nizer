'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs() {
  const pathname = usePathname()
  if (pathname === '/') return null

  const paths = pathname.split('/').filter(Boolean)

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-terminal-white/40 mb-6 font-mono" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`
        const isLast = index === paths.length - 1
        const title = path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 shrink-0" />
            {isLast ? (
              <span className="font-bold text-primary-600 dark:text-terminal-cyan" aria-current="page">
                {title}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {title}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
