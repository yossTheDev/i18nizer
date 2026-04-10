'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function TerminalPre({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="my-8 rounded-2xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="mx-auto text-[10px] font-mono font-bold text-white/20 uppercase tracking-widest">
          Terminal
        </div>
      </div>
      <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed custom-scrollbar">
        {children}
      </pre>
    </motion.div>
  )
}
