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
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-black border-b-2 border-black dark:border-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="p-2 lg:hidden text-black dark:text-white hover:bg-celeste hover:text-black transition-colors border-2 border-transparent hover:border-black"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-celeste p-1.5 border-2 border-black transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-brutal">
                <Terminal className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-black tracking-tighter text-black dark:text-white hidden sm:inline-block uppercase">
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
              className="p-2 text-black dark:text-white hover:bg-celeste hover:text-black transition-colors border-2 border-transparent hover:border-black"
              aria-label="GitHub"
            >
              <FaGithub className="w-6 h-6" />
            </a>

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-black dark:text-white hover:bg-celeste hover:text-black transition-colors border-2 border-transparent hover:border-black"
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
