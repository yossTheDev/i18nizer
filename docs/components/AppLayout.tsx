'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Breadcrumbs } from './Breadcrumbs'
import { usePathname } from 'next/navigation'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Manage sidebar state based on route and device
  useEffect(() => {
    if (isLandingPage) {
      setIsSidebarOpen(false)
    } else if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true)
    }
  }, [isLandingPage])

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} showMenuButton={!isLandingPage} />
      <div className="flex-1 flex max-w-[1400px] mx-auto w-full">
        {!isLandingPage && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        )}
        <main className={clsx(
          "flex-1 w-full",
          !isLandingPage && isSidebarOpen ? "lg:pl-72" : "lg:pl-0"
        )}>
          <div className={clsx(
            "px-4 sm:px-6 lg:px-8 py-8",
            isLandingPage ? "max-w-7xl mx-auto" : ""
          )}>
            {!isLandingPage && <Breadcrumbs />}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
