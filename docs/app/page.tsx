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
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-celeste border-[3px] border-black mb-8 text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-brutal">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full bg-black animate-pulse"></span>
            </span>
            v0.7.2 STABLE RELEASE
          </div>
          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter text-black dark:text-white leading-[0.9] uppercase">
            I18N WITHOUT <br />
            <span className="bg-celeste text-black px-6 shadow-brutal inline-block mt-4 border-[3px] border-black">
              THE FRICTION.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-black/70 dark:text-white/70 mb-12 max-w-3xl mx-auto font-black leading-tight uppercase tracking-tight">
            The intelligent CLI that automates internationalization for React & Next.js using AI.
            Extract, translate, and rewrite in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link
              href="/getting-started"
              className="group px-10 py-5 bg-celeste text-black border-[3px] border-black transition-all font-black text-lg flex items-center gap-3 shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              GET STARTED
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://github.com/yossTheDev/i18nizer"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white dark:bg-black border-[3px] border-black dark:border-white text-black dark:text-white transition-all font-black text-lg flex items-center gap-3 shadow-brutal dark:shadow-brutal-light hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-celeste hover:text-black hover:border-black"
            >
              <FaGithub className="w-6 h-6" />
              VIEW ON GITHUB
            </a>
          </div>
        </motion.div>
      </section>

      {/* Transformation Demo */}
      <section className="relative px-4">
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="text-5xl font-black mb-8 text-black dark:text-white tracking-tighter uppercase leading-none">
              Watch the <br />
              <span className="bg-celeste text-black px-3 border-[3px] border-black shadow-brutal inline-block mt-2">Magic</span> Happen
            </h2>
            <p className="text-xl text-black/80 dark:text-white/80 mb-10 leading-snug font-black uppercase tracking-tight">
              i18nizer analyzes your code, identifies translatable strings, generates optimized keys,
              and rewrites the component using your preferred i18n library.
            </p>
            <ul className="space-y-6">
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
            icon={<Cpu className="w-8 h-8 text-black" />}
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
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-black border-[3px] border-black dark:border-white shadow-brutal dark:shadow-brutal-light overflow-hidden">
          <div className="flex items-center gap-2 px-8 py-5 bg-celeste border-b-[3px] border-black">
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 border-2 border-black bg-red-500" />
              <div className="w-3.5 h-3.5 border-2 border-black bg-yellow-500" />
              <div className="w-3.5 h-3.5 border-2 border-black bg-green-500" />
            </div>
            <div className="mx-auto text-[11px] font-black text-black uppercase tracking-[0.4em]">QUICK_INSTALLATION.SH</div>
          </div>
          <div className="p-10 font-mono text-sm md:text-base space-y-5 text-white">
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
    <div className="group relative bg-white dark:bg-black border-[3px] border-black dark:border-white p-10 shadow-brutal dark:shadow-brutal-light hover:bg-celeste transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-none">
      <div className="mb-8 p-4 bg-celeste border-[3px] border-black w-fit group-hover:bg-white transition-colors duration-200 shadow-brutal">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-black dark:text-white mb-4 tracking-tighter uppercase group-hover:text-black leading-none">{title}</h3>
      <p className="text-black/70 dark:text-white/70 leading-relaxed text-sm font-black uppercase tracking-tight group-hover:text-black/90 transition-colors">{description}</p>
    </div>
  )
}
