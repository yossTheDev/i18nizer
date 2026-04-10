'use client'

import { Command } from 'cmdk'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, Home, Terminal, Settings, Layers, List, Users, BookOpen } from 'lucide-react'

const navigation = [
  { id: 'home', title: 'Home', icon: Home, href: '/' },
  { id: 'getting-started', title: 'Getting Started', icon: Terminal, href: '/getting-started' },
  { id: 'cli-commands', title: 'CLI Commands', icon: List, href: '/cli-commands' },
  { id: 'configuration', title: 'Configuration', icon: Settings, href: '/configuration' },
  { id: 'examples', title: 'Examples', icon: BookOpen, href: '/examples' },
  { id: 'advanced-features', title: 'Advanced Features', icon: Layers, href: '/advanced-features' },
  { id: 'architecture', title: 'Architecture', icon: Layers, href: '/architecture' },
  { id: 'changelog', title: 'Changelog', icon: FileText, href: '/changelog' },
  { id: 'contributing', title: 'Contributing', icon: Users, href: '/contributing' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-full items-center justify-start rounded-xl bg-primary-500/[0.03] border border-primary-500/20 px-3 text-sm text-terminal-white/40 sm:pr-12 md:w-40 lg:w-64 transition-all hover:bg-primary-500/10 hover:border-primary-500/40"
      >
        <Search className="mr-2 h-3 w-3" />
        <span className="hidden lg:inline-flex text-[11px] uppercase tracking-wider font-bold">Quick Search...</span>
        <span className="inline-flex lg:hidden text-[11px] uppercase tracking-wider font-bold">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded-lg border border-primary-500/20 bg-primary-500/10 px-1.5 font-mono text-[9px] font-bold opacity-100 sm:flex text-primary-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] p-4 sm:p-6 md:p-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-terminal-bg/95 border border-primary-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              <Command className="flex h-full w-full flex-col overflow-hidden bg-transparent">
                <div className="flex items-center border-b border-white/5 px-4" cmdk-input-wrapper="">
                  <Search className="mr-3 h-4 w-4 shrink-0 text-primary-400" />
                  <Command.Input
                    placeholder="Type to search documentation..."
                    className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-terminal-white/20 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                  />
                  <kbd className="hidden sm:inline-block pointer-events-none select-none rounded-lg border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] font-bold opacity-100 text-terminal-white/40">
                    ESC
                  </kbd>
                </div>
                <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
                  <Command.Empty className="py-12 text-center text-sm text-terminal-white/30">
                    <div className="mb-2 text-xl">∅</div>
                    No results found.
                  </Command.Empty>
                  <Command.Group heading="System Navigation" className="px-2 py-3 text-[10px] font-bold text-primary-400/50 uppercase tracking-[0.2em]">
                    {navigation.map((item) => (
                      <Command.Item
                        key={item.id}
                        onSelect={() => runCommand(() => router.push(item.href))}
                        className="flex cursor-default select-none items-center rounded-xl px-3 py-3 text-sm outline-none aria-selected:bg-primary-500/10 aria-selected:text-primary-400 transition-colors duration-200 text-terminal-white/70"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title.toUpperCase()}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>
                <div className="flex items-center justify-between border-t border-white/5 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-terminal-white/20">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-primary-400/50">ENTER</kbd>
                      SELECT
                    </span>
                    <span className="flex items-center gap-1.5">
                      <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-primary-400/50">↑↓</kbd>
                      NAVIGATE
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Terminal className="h-3 w-3" />
                    Search Powered by cmdk
                  </span>
                </div>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
