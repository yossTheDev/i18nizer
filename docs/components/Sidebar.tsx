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
    <div className="py-8 px-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-black/50 dark:text-white/50 flex items-center gap-2">
          <div className="w-3 h-3 bg-celeste border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          SYSTEM.NAV
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 text-black dark:text-white hover:bg-celeste hover:text-black transition-all border-2 border-black shadow-brutal active:shadow-none active:translate-x-0.5 active:translate-y-0.5">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <nav className="space-y-2 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={clsx(
                'group flex items-center px-4 py-3 text-xs font-black transition-all duration-200 relative uppercase tracking-widest border-2',
                isActive
                  ? 'text-black bg-celeste border-black shadow-brutal -translate-x-1 -translate-y-1'
                  : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-celeste/20 border-transparent hover:border-black/10 dark:hover:border-white/10'
              )}
            >
              <item.icon className={clsx(
                'mr-3 h-4 w-4 transition-colors duration-200',
                isActive ? 'text-black' : 'text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white'
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <ChevronRight className="h-3 w-3 stroke-[3px]" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-10">
        <div className="border-[3px] border-black dark:border-white bg-white dark:bg-black p-6 shadow-brutal dark:shadow-brutal-light relative group">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-celeste border-2 border-black" />
            <h3 className="text-[11px] font-black text-black dark:text-white uppercase tracking-widest relative z-10">Broadcast</h3>
          </div>
          <p className="text-[11px] text-black/70 dark:text-white/70 mb-5 leading-relaxed relative z-10 font-bold">
            v0.7.2 stable release is now live with enhanced AI translation logic.
          </p>
          <Link
            href="/changelog"
            onClick={onClose}
            className="inline-flex items-center w-full justify-center text-[10px] font-black uppercase tracking-widest text-black bg-celeste hover:bg-white border-2 border-black py-2.5 transition-all duration-200 relative z-10 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1"
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
        "fixed left-0 top-20 z-30 hidden h-[calc(100vh-5rem)] overflow-y-auto border-r-[3px] border-black dark:border-white bg-white dark:bg-black lg:block custom-scrollbar",
        isOpen ? "w-72" : "w-0 border-none opacity-0 pointer-events-none"
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
