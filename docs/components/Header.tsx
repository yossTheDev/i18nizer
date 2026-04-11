'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState, useRef } from 'react'
import { FaGithub } from 'react-icons/fa'
import { Sun, Moon, Terminal, Menu, Monitor, ChevronDown } from 'lucide-react'
import { CommandPalette } from './CommandPalette'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface HeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
  ]

  const currentTheme = themes.find((t) => t.id === theme) || themes[2]

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black dark:border-white hover:bg-celeste hover:text-black transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal dark:hover:shadow-brutal-light"
      >
        <currentTheme.icon className="w-4 h-4" />
        <span className="hidden md:inline">{currentTheme.name}</span>
        <ChevronDown className={clsx("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-3 w-40 border-[3px] border-black dark:border-white bg-white dark:bg-black shadow-brutal dark:shadow-brutal-light z-50 overflow-hidden"
          >
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id)
                  setIsOpen(false)
                }}
                className={clsx(
                  "flex w-full items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors",
                  theme === t.id
                    ? "bg-celeste text-black"
                    : "hover:bg-celeste/20 text-black dark:text-white"
                )}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-black border-b-[3px] border-black dark:border-white shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="p-2 lg:hidden text-black dark:text-white hover:bg-celeste hover:text-black transition-all border-2 border-black shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-celeste p-2 border-2 border-black transition-all group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-brutal">
                <Terminal className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-black dark:text-white hidden sm:inline-block uppercase leading-none">
                i18nizer
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center max-w-md">
            <CommandPalette />
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/yossTheDev/i18nizer"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-black dark:text-white hover:bg-celeste hover:text-black transition-all border-2 border-black shadow-brutal dark:shadow-brutal-light hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              aria-label="GitHub"
            >
              <FaGithub className="w-6 h-6" />
            </a>

            {mounted && <ThemeSelector />}
          </div>
        </div>
      </div>
    </header>
  )
}
