'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Terminal, Zap, Globe, Cpu, RefreshCw, Layout, ArrowRight } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Particles } from '@/components/Particles'
import { VisualDiff } from '@/components/VisualDiff'

export default function Home() {
  return (
    <div className="space-y-32 pb-20 relative">
      <Particles />
      {/* Hero Section */}
      <section className="relative text-center py-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-celeste/10 border border-celeste/20 mb-6 text-celeste text-xs font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-celeste opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-celeste"></span>
            </span>
            v0.7.2 is now stable
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-white leading-tight">
            I18N WITHOUT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-celeste via-white to-celeste">
              THE FRICTION.
            </span>
          </h1>
          <p className="text-xl text-terminal-white/50 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            The intelligent CLI that automates internationalization for React & Next.js using AI.
            Extract, translate, and rewrite in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/getting-started"
              className="group px-8 py-4 bg-celeste text-black rounded-2xl hover:bg-white transition-all font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(178,255,255,0.4)] hover:shadow-[0_0_40px_rgba(178,255,255,0.6)]"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://github.com/yossTheDev/i18nizer"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all font-bold flex items-center gap-2 backdrop-blur-md"
            >
              <FaGithub className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </motion.div>
      </section>

      {/* Transformation Demo */}
      <section className="relative">
        <div className="absolute inset-0 bg-celeste/5 blur-[120px] rounded-full" />
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-white tracking-tight">
              Watch the <span className="text-celeste">Magic</span> Happen
            </h2>
            <p className="text-lg text-terminal-white/60 mb-8 leading-relaxed">
              i18nizer analyzes your code, identifies translatable strings, generates optimized keys,
              and rewrites the component using your preferred i18n library.
            </p>
            <ul className="space-y-4">
              {[
                "Automatic string extraction",
                "AI-powered camelCase key generation",
                "Dynamic JSON locale file creation",
                "Zero-config pluralization detection"
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-terminal-white/80 font-medium"
                >
                  <div className="w-5 h-5 rounded-full bg-celeste/20 flex items-center justify-center border border-celeste/30">
                    <Zap className="w-3 h-3 text-celeste" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="relative">
             <VisualDiff />
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Core Intelligence</h2>
          <p className="text-terminal-white/50">Everything you need to go global without breaking your flow.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Cpu className="w-6 h-6 text-celeste" />}
            title="AI Multimodal"
            description="Seamlessly switch between OpenAI, Gemini, or Hugging Face models for high-quality translations."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Instant Rewrite"
            description="Our TS-morph powered engine rewrites your components instantly with zero syntax errors."
          />
          <FeatureCard
            icon={<RefreshCw className="w-6 h-6 text-green-400" />}
            title="Smart Cache"
            description="Deterministic hashing ensures you never pay for the same translation twice. Consistent & fast."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-blue-400" />}
            title="Auto Plurals"
            description="Automatically detects plural logic in your JSX and converts them to ICU message formats."
          />
          <FeatureCard
            icon={<Layout className="w-6 h-6 text-magenta-400" />}
            title="Framework Agnostic"
            description="Compatible with next-intl, i18next, and react-i18next. Use what you love."
          />
          <FeatureCard
            icon={<Terminal className="w-6 h-6 text-cyan-400" />}
            title="CLI First"
            description="A developer-centric experience. Pipe it, script it, or use it interactively."
          />
        </div>
      </section>

      {/* Quick Start Terminal */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-black/80 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
            </div>
            <div className="mx-auto text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Quick Installation</div>
          </div>
          <div className="p-8 font-mono text-sm space-y-4">
            <div className="flex gap-4">
              <span className="text-celeste">$</span>
              <span className="text-terminal-white">npm install -g i18nizer</span>
            </div>
            <div className="flex gap-4">
              <span className="text-celeste">$</span>
              <span className="text-terminal-white">i18nizer start</span>
            </div>
            <div className="flex gap-4">
              <span className="text-celeste text-opacity-50">?</span>
              <span className="text-celeste">Select source directory:</span>
              <span className="text-terminal-white">src</span>
            </div>
            <div className="flex gap-4">
              <span className="text-celeste">$</span>
              <span className="text-terminal-white">i18nizer translate src/app/page.tsx</span>
            </div>
            <div className="pt-4 text-green-400 font-bold">
              ✓ 12 strings extracted <br />
              ✓ Translations generated (en, es) <br />
              ✓ Component rewritten successfully!
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.05] hover:border-celeste/20 transition-all duration-300 backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1.5 h-1.5 rounded-full bg-celeste shadow-[0_0_8px_rgba(178,255,255,0.8)]" />
      </div>
      <div className="mb-6 p-3 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-terminal-white/40 leading-relaxed text-sm group-hover:text-terminal-white/60 transition-colors">{description}</p>
    </div>
  )
}
