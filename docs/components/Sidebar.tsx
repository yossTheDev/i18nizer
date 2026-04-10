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
        <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-celeste/40 flex items-center gap-2">
          <div className="w-1 h-1 bg-celeste rounded-full animate-pulse shadow-[0_0_8px_rgba(178,255,255,0.8)]" />
          System.Nav
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-terminal-white/40 hover:text-white transition-colors">
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
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 relative',
                isActive
                  ? 'text-celeste bg-celeste/5 border border-celeste/20 shadow-[0_0_15px_rgba(178,255,255,0.1)]'
                  : 'text-terminal-white/60 hover:text-terminal-white hover:bg-white/5 border border-transparent'
              )}
            >
              <item.icon className={clsx(
                'mr-3 h-4 w-4 transition-colors duration-300',
                isActive ? 'text-celeste' : 'text-terminal-white/30 group-hover:text-terminal-white/60'
              )} />
              <span className="flex-1 tracking-tight">{item.name}</span>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-celeste rounded-full shadow-[0_0_8px_rgba(178,255,255,0.8)]" />
              )}
              {isActive && (
                <ChevronRight className="h-3 w-3 opacity-50" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div className="rounded-2xl bg-gradient-to-br from-celeste/10 to-celeste/20 border border-celeste/20 p-5 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-celeste/10 rounded-full blur-2xl transition-transform group-hover:scale-150" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-celeste animate-pulse shadow-[0_0_8px_rgba(178,255,255,0.8)]" />
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest relative z-10">Broadcast</h3>
          </div>
          <p className="text-xs text-terminal-white/60 mb-4 leading-relaxed relative z-10">
            v0.7.2 stable release is now live with enhanced AI translation logic.
          </p>
          <Link
            href="/changelog"
            onClick={onClose}
            className="inline-flex items-center w-full justify-center text-[10px] font-bold uppercase tracking-tighter text-black bg-celeste hover:bg-white border border-celeste/30 py-2 rounded-xl transition-all duration-300 relative z-10 shadow-[0_0_15px_rgba(178,255,255,0.3)]"
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
        "fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] overflow-y-auto border-r border-white/5 bg-terminal-bg/60 backdrop-blur-2xl lg:block custom-scrollbar transition-all duration-500 ease-in-out",
        isOpen ? "w-64" : "w-0 border-none opacity-0 pointer-events-none"
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-72 bg-terminal-bg border-r border-white/5 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:hidden overflow-y-auto custom-scrollbar',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {sidebarContent}
      </aside>
    </>
  )
}
