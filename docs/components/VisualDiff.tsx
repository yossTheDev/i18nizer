'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

export const VisualDiff = () => {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 3)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const steps = [
    {
      title: 'Original Source',
      code: `<h1>Hello World</h1>\n<p>Welcome to our application!</p>`,
      type: 'input'
    },
    {
      title: 'AI Transformation',
      code: `<h1>{t('helloWorld')}</h1>\n<p>{t('welcomeMessage')}</p>`,
      type: 'process'
    },
    {
      title: 'Generated Locales',
      code: `{\n  "helloWorld": "Hola Mundo",\n  "welcomeMessage": "¡Bienvenido a nuestra aplicación!"\n}`,
      type: 'output'
    }
  ]

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
        </div>
        <div className="text-[10px] font-mono font-bold text-celeste/60 uppercase tracking-widest">
          {steps[step].title}
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                step === i ? 'bg-celeste w-4' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="p-8 h-48 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.pre
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-sm font-mono text-celeste/80 leading-relaxed whitespace-pre"
          >
            <code>{steps[step].code}</code>
          </motion.pre>
        </AnimatePresence>
      </div>
      <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
           {step === 0 && <span>Ready to extract</span>}
           {step === 1 && <span className="text-celeste">Applying transformations...</span>}
           {step === 2 && <span className="text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Successfully translated</span>}
        </div>
        <ArrowRight className={`w-4 h-4 text-celeste/40 transition-transform duration-500 ${step === 1 ? 'translate-x-2' : ''}`} />
      </div>
    </div>
  )
}
