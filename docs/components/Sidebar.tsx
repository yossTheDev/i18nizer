'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  ChevronRight,
  Terminal,
  BookOpen,
  Settings,
  Layers,
  List,
  Users,
  FileText,
  X
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Terminal },
  { name: 'Getting Started', href: '/getting-started', icon: Terminal },
  { name: 'CLI Commands', href: '/cli-commands', icon: List },
  { name: 'Configuration', href: '/configuration', icon: Settings },
  { name: 'Examples', href: '/examples', icon: BookOpen },
  { name: 'Advanced Features', href: '/advanced-features', icon: Layers },
  { name: 'Architecture', href: '/architecture', icon: Layers },
  { name: 'Changelog', href: '/changelog', icon: FileText },
  { name: 'Contributing', href: '/contributing', icon: Users },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <div className="py-6 px-4">
      <div className="flex items-center justify-between mb-4 px-3 py-2">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500 dark:text-terminal-white/40 flex items-center gap-2">
          <ChevronRight className="w-3 h-3" />
          Navigation
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-terminal-white/40 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={clsx(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-terminal-blue/10 dark:text-terminal-blue border border-primary-100 dark:border-terminal-blue/20 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-terminal-white/70 dark:hover:text-white dark:hover:bg-white/5'
              )}
            >
              <item.icon className={clsx(
                'mr-3 h-4 w-4 transition-colors',
                isActive ? 'text-primary-600 dark:text-terminal-blue' : 'text-gray-400 group-hover:text-gray-500 dark:text-terminal-white/40 dark:group-hover:text-terminal-white'
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 dark:from-terminal-blue dark:to-blue-600 p-4 shadow-lg overflow-hidden relative group">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl transition-transform group-hover:scale-150" />
        <h3 className="text-sm font-bold text-white mb-1 relative z-10">New version out!</h3>
        <p className="text-xs text-primary-50 dark:text-blue-50 mb-3 relative z-10">
          Check out the new features in v0.7.2 including AI model support.
        </p>
        <Link
          href="/changelog"
          onClick={onClose}
          className="inline-flex items-center text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors relative z-10"
        >
          Changelog
          <ChevronRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-gray-200 dark:border-terminal-gray/20 bg-white/50 dark:bg-terminal-bg/50 backdrop-blur-xl lg:block custom-scrollbar">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-terminal-bg shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto custom-scrollbar',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {sidebarContent}
      </aside>
    </>
  )
}
