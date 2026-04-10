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
        className="relative flex h-9 w-full items-center justify-start rounded-[0.5rem] bg-gray-100 dark:bg-terminal-black/50 border border-gray-200 dark:border-terminal-gray/30 px-3 text-sm text-gray-500 dark:text-terminal-white/50 sm:pr-12 md:w-40 lg:w-64 transition-all hover:bg-gray-200 dark:hover:bg-terminal-black"
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-terminal-gray/30 bg-gray-50 dark:bg-terminal-black px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
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
              className="relative w-full max-w-2xl overflow-hidden rounded-xl glass shadow-2xl"
            >
              <Command className="flex h-full w-full flex-col overflow-hidden bg-transparent">
                <div className="flex items-center border-b border-gray-200 dark:border-terminal-gray/20 px-3" cmdk-input-wrapper="">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <Command.Input
                    placeholder="Search documentation..."
                    className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <kbd className="hidden sm:inline-block pointer-events-none select-none rounded border border-gray-200 dark:border-terminal-gray/30 bg-gray-50 dark:bg-terminal-black px-1.5 font-mono text-[10px] font-medium opacity-100">
                    ESC
                  </kbd>
                </div>
                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                  <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
                  <Command.Group heading="Documentation" className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-terminal-white/50 uppercase tracking-wider">
                    {navigation.map((item) => (
                      <Command.Item
                        key={item.id}
                        onSelect={() => runCommand(() => router.push(item.href))}
                        className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary-500/10 aria-selected:text-primary-600 dark:aria-selected:bg-terminal-blue/10 dark:aria-selected:text-terminal-blue"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title.toUpperCase()}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-terminal-gray/20 px-4 py-2 text-[10px] text-gray-500 dark:text-terminal-white/30">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-gray-200 dark:border-terminal-gray/30 bg-gray-50 dark:bg-terminal-black px-1">↵</kbd>
                      to select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-gray-200 dark:border-terminal-gray/30 bg-gray-50 dark:bg-terminal-black px-1">↓</kbd>
                      <kbd className="rounded border border-gray-200 dark:border-terminal-gray/30 bg-gray-50 dark:bg-terminal-black px-1">↑</kbd>
                      to navigate
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
