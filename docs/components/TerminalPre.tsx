'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function TerminalPre({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="my-8 border-2 border-black dark:border-white bg-black shadow-brutal dark:shadow-brutal-light"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-black dark:border-white bg-celeste">
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
    </motion.div>
  )
}
