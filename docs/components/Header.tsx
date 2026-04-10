'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { Sun, Moon, Terminal, Menu } from 'lucide-react'
import { CommandPalette } from './CommandPalette'

interface HeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full glass">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="p-2 lg:hidden text-terminal-white/70 hover:text-white transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-celeste p-1.5 rounded-lg transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(178,255,255,0.5)]">
                <Terminal className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white hidden sm:inline-block">
                i18nizer
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center max-w-md">
            <CommandPalette />
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/yossTheDev/i18nizer"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-terminal-white/70 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-6 h-6" />
            </a>

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-terminal-white/70 hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
