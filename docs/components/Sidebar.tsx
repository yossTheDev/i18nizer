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
  { name: 'Introduction', href: '/getting-started', icon: Terminal },
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
    <div className="py-6 px-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 px-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/40 dark:text-white/40 flex items-center gap-2">
          <div className="w-2 h-2 bg-celeste border border-black" />
          System.Nav
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-black dark:text-white hover:bg-celeste hover:text-black transition-colors border border-transparent hover:border-black">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <nav className="space-y-1 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={clsx(
                'group flex items-center px-3 py-2 text-sm font-bold transition-all duration-200 relative uppercase tracking-tighter',
                isActive
                  ? 'text-black bg-celeste border-2 border-black shadow-brutal translate-x-1 -translate-y-1'
                  : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-celeste/20 border-2 border-transparent'
              )}
            >
              <item.icon className={clsx(
                'mr-3 h-4 w-4 transition-colors duration-200',
                isActive ? 'text-black' : 'text-black/30 dark:text-white/30 group-hover:text-black dark:group-hover:text-white'
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <ChevronRight className="h-3 w-3" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-5 shadow-brutal dark:shadow-brutal-light relative group">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-celeste border border-black" />
            <h3 className="text-[11px] font-black text-black dark:text-white uppercase tracking-widest relative z-10">Broadcast</h3>
          </div>
          <p className="text-xs text-black/60 dark:text-white/60 mb-4 leading-relaxed relative z-10">
            v0.7.2 stable release is now live with enhanced AI translation logic.
          </p>
          <Link
            href="/changelog"
            onClick={onClose}
            className="inline-flex items-center w-full justify-center text-[10px] font-black uppercase tracking-tighter text-black bg-celeste hover:bg-white border-2 border-black py-2 transition-all duration-200 relative z-10"
          >
            Read Patch Notes
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={clsx(
        "fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] overflow-y-auto border-r-2 border-black dark:border-white bg-white dark:bg-black lg:block custom-scrollbar transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 border-none opacity-0 pointer-events-none"
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-black border-r-2 border-black dark:border-white shadow-brutal transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto custom-scrollbar',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {sidebarContent}
      </aside>
    </>
  )
}
