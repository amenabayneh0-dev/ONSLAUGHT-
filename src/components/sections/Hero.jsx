import { useState } from 'react'
import { motion } from 'framer-motion'
import { ImageIcon, ChevronDown } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { site } from '../../data/site.js'

const ease = [0.22, 0.7, 0.2, 1]

function HeroBackground() {
  const [failed, setFailed] = useState(false)
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-ons-graphite" aria-hidden={!failed}>
      {!failed ? (
        <motion.img
          src={site.heroImage}
          alt=""
          onError={() => setFailed(true)}
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease }}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      ) : (
        // Clear placeholder for the real PUBG photograph
        <div
          role="img"
          aria-label="Placeholder for a PUBG background photograph"
          className="absolute inset-0 bg-[linear-gradient(rgba(192,192,192,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(192,192,192,.05)_1px,transparent_1px)] bg-[size:64px_64px]"
        >
          <div className="absolute right-6 top-28 flex max-w-[16rem] items-start gap-3 border border-dashed border-ons-silver/40 bg-ons-black/50 p-4 text-xs leading-relaxed text-ons-silver/80 backdrop-blur-sm sm:right-10 lg:right-16 lg:max-w-xs lg:text-sm">
            <ImageIcon size={18} className="mt-0.5 shrink-0" />
            <span>
              Your PUBG photograph goes here. Save it as <code className="text-ons-white">public/images/hero.jpg</code>.
            </span>
          </div>
        </div>
      )}

      {/* Cinematic overlays: base tint, vignette, and a floor that grounds the type */}
      <div className="absolute inset-0 bg-ons-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,transparent_0%,rgba(5,5,5,.75)_75%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ons-black via-ons-black/80 to-transparent" />
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden" aria-labelledby="hero-title">
      <HeroBackground />

      <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-36 lg:px-10 lg:pb-28">
        {/* The one orchestrated moment: wordmark wipes in, then a single metallic sheen passes */}
        <motion.h1
          id="hero-title"
          initial={{ clipPath: 'inset(-10% 100% -10% -10%)', y: 24 }}
          animate={{ clipPath: 'inset(-10% -50% -10% -10%)', y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.15 }}
          className="silver-text silver-text-sheen inline-block font-display whitespace-nowrap text-[clamp(3.5rem,19vw,16rem)] font-black leading-[0.82] tracking-[0.02em]"
        >
          ONSLAUGHT
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.9 }}
          className="mt-8 max-w-xl font-display text-3xl font-semibold tracking-wide text-ons-white sm:text-4xl"
        >
          {site.slogan}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-3 max-w-md text-base text-ons-silver"
        >
          {site.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 1.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button href="/roster">Explore Our Team</Button>
          <Button href="/recruitment" variant="ghost">Join ONS</Button>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to statistics"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 right-6 hidden text-ons-silver/70 transition-colors hover:text-ons-white sm:block lg:right-10"
      >
        <ChevronDown size={28} className="motion-safe:animate-bounce" />
      </motion.button>
    </section>
  )
}
