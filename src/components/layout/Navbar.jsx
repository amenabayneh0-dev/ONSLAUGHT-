import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import Button from '../ui/Button.jsx'
import { navLinks, joinLink } from '../../data/site.js'
import { useRouter } from '../../router.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef(null)
  const { path: current } = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Close the menu if the viewport grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'border-b border-ons-silver/15 bg-ons-black/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Logo />

        <ul className="hidden items-center gap-6 xl:gap-9 lg:flex">
          {navLinks.map((l) => {
            const active = l.href === current
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-ons-silver after:transition-transform after:duration-300 hover:text-ons-white ${
                    active
                      ? 'text-ons-white after:scale-x-100'
                      : 'text-ons-silver after:scale-x-0 hover:after:scale-x-100'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="hidden lg:block">
          <Button href={joinLink.href} size="sm">{joinLink.label}</Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="-mr-2 p-2 text-ons-white lg:hidden"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

    </header>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-ons-black lg:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col px-6 pb-10 pt-6">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                  className="border-b border-ons-silver/10"
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={l.href === current ? 'page' : undefined}
                    className="block py-5 font-display text-4xl font-extrabold tracking-wider text-ons-silver transition-colors hover:text-ons-white aria-[current=page]:text-ons-white"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-8">
                <Button href={joinLink.href} className="w-full" onClick={() => setOpen(false)}>
                  {joinLink.label}
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
