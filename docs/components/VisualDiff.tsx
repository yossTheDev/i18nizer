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
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-black border-2 border-black dark:border-white shadow-brutal dark:shadow-brutal-light overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black dark:border-white bg-celeste">
        <div className="flex gap-2">
          <div className="w-3 h-3 border border-black bg-red-500" />
          <div className="w-3 h-3 border border-black bg-yellow-500" />
          <div className="w-3 h-3 border border-black bg-green-500" />
        </div>
        <div className="text-[10px] font-mono font-black text-black uppercase tracking-widest">
          {steps[step].title}
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 border border-black transition-all duration-500 ${
                step === i ? 'bg-black w-4' : 'bg-white'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="p-8 h-48 flex items-center justify-center bg-black">
        <AnimatePresence mode="wait">
          <motion.pre
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-sm font-mono text-celeste leading-relaxed whitespace-pre font-bold"
          >
            <code>{steps[step].code}</code>
          </motion.pre>
        </AnimatePresence>
      </div>
      <div className="px-6 py-4 border-t-2 border-black dark:border-white bg-white dark:bg-black flex justify-between items-center">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-black dark:text-white">
           {step === 0 && <span>Ready to extract</span>}
           {step === 1 && <span className="text-black dark:text-celeste">Applying transformations...</span>}
           {step === 2 && <span className="text-green-600 dark:text-green-400 flex items-center gap-1"><Check className="w-3 h-3 stroke-[4px]" /> Successfully translated</span>}
        </div>
        <ArrowRight className={`w-4 h-4 text-black dark:text-white transition-transform duration-500 ${step === 1 ? 'translate-x-2' : ''}`} />
      </div>
    </div>
  )
}
