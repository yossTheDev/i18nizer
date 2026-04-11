'use client'

import { ReactNode } from 'react'

export function TerminalPre({ children }: { children: ReactNode }) {
  return (
    <div
      className="my-8 border-[3px] border-black dark:border-white bg-black shadow-brutal dark:shadow-brutal-light"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b-[3px] border-black dark:border-white bg-neutral-100 dark:bg-neutral-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 border border-black bg-[#ff5f56]" />
          <div className="w-3 h-3 border border-black bg-[#ffbd2e]" />
          <div className="w-3 h-3 border border-black bg-[#27c93f]" />
        </div>
        <div className="mx-auto text-[10px] font-mono font-black text-black uppercase tracking-widest">
          Terminal
        </div>
      </div>
      <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed custom-scrollbar text-white">
        {children}
      </pre>
    </div>
  )
}
