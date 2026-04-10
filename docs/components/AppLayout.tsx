'use client'

import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Breadcrumbs } from './Breadcrumbs'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex-1 flex max-w-[1400px] mx-auto w-full">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 lg:pl-64 w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
