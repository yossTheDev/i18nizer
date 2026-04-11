'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Terminal, Zap, Globe, Cpu, RefreshCw, Layout, ArrowRight } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { VisualDiff } from '@/components/VisualDiff'

export default function Home() {
  return (
    <div className="space-y-32 pb-20 relative bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative text-center py-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-celeste border-2 border-black mb-6 text-black text-xs font-black uppercase tracking-widest shadow-brutal">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full bg-black"></span>
            </span>
            v0.7.2 is now stable
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-black dark:text-white leading-tight uppercase">
            I18N WITHOUT <br />
            <span className="bg-celeste text-black px-4 shadow-brutal inline-block mt-2">
              THE FRICTION.
            </span>
          </h1>
          <p className="text-xl text-black/60 dark:text-white/60 mb-10 max-w-2xl mx-auto font-bold leading-relaxed">
            The intelligent CLI that automates internationalization for React & Next.js using AI.
            Extract, translate, and rewrite in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/getting-started"
              className="group px-8 py-4 bg-celeste text-black border-2 border-black transition-all font-black flex items-center gap-2 shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              GET STARTED
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://github.com/yossTheDev/i18nizer"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white transition-all font-black flex items-center gap-2 hover:bg-celeste hover:text-black hover:border-black"
            >
              <FaGithub className="w-5 h-5" />
              VIEW ON GITHUB
            </a>
          </div>
        </motion.div>
      </section>

      {/* Transformation Demo */}
      <section className="relative">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6 text-black dark:text-white tracking-tighter uppercase">
              Watch the <span className="bg-celeste text-black px-2">Magic</span> Happen
            </h2>
            <p className="text-lg text-black/70 dark:text-white/70 mb-8 leading-relaxed font-bold">
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
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-black dark:text-white font-black uppercase tracking-tight"
                >
                  <div className="w-6 h-6 bg-celeste flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Zap className="w-3 h-3 text-black" />
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
          <h2 className="text-4xl font-black text-black dark:text-white mb-4 uppercase tracking-tighter">Core Intelligence</h2>
          <p className="text-black/50 dark:text-white/50 font-bold uppercase">Everything you need to go global without breaking your flow.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Cpu className="w-6 h-6 text-black" />}
            title="AI Multimodal"
            description="Seamlessly switch between OpenAI, Gemini, or Hugging Face models for high-quality translations."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-black" />}
            title="Instant Rewrite"
            description="Our TS-morph powered engine rewrites your components instantly with zero syntax errors."
          />
          <FeatureCard
            icon={<RefreshCw className="w-6 h-6 text-black" />}
            title="Smart Cache"
            description="Deterministic hashing ensures you never pay for the same translation twice. Consistent & fast."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-black" />}
            title="Auto Plurals"
            description="Automatically detects plural logic in your JSX and converts them to ICU message formats."
          />
          <FeatureCard
            icon={<Layout className="w-6 h-6 text-black" />}
            title="Framework Agnostic"
            description="Compatible with next-intl, i18next, and react-i18next. Use what you love."
          />
          <FeatureCard
            icon={<Terminal className="w-6 h-6 text-black" />}
            title="CLI First"
            description="A developer-centric experience. Pipe it, script it, or use it interactively."
          />
        </div>
      </section>

      {/* Quick Start Terminal */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-black border-2 border-black dark:border-white shadow-brutal dark:shadow-brutal-light overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 bg-celeste border-b-2 border-black">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 border border-black bg-red-500" />
              <div className="w-3 h-3 border border-black bg-yellow-500" />
              <div className="w-3 h-3 border border-black bg-green-500" />
            </div>
            <div className="mx-auto text-[10px] font-black text-black uppercase tracking-[0.3em]">Quick Installation</div>
          </div>
          <div className="p-8 font-mono text-sm space-y-4 text-white">
            <div className="flex gap-4">
              <span className="text-celeste font-bold">$</span>
              <span>npm install -g i18nizer</span>
            </div>
            <div className="flex gap-4">
              <span className="text-celeste font-bold">$</span>
              <span>i18nizer start</span>
            </div>
            <div className="flex gap-4">
              <span className="text-celeste text-opacity-50">?</span>
              <span className="text-celeste font-bold">Select source directory:</span>
              <span>src</span>
            </div>
            <div className="flex gap-4">
              <span className="text-celeste font-bold">$</span>
              <span>i18nizer translate src/app/page.tsx</span>
            </div>
            <div className="pt-4 text-green-400 font-bold uppercase">
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
    <div className="group relative bg-white dark:bg-black border-2 border-black dark:border-white p-8 shadow-brutal dark:shadow-brutal-light hover:bg-celeste transition-all duration-200">
      <div className="mb-6 p-3 bg-celeste border-2 border-black w-fit group-hover:bg-white transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {icon}
      </div>
      <h3 className="text-xl font-black text-black dark:text-white mb-3 tracking-tighter uppercase group-hover:text-black">{title}</h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed text-sm font-bold group-hover:text-black/80 transition-colors">{description}</p>
    </div>
  )
}
