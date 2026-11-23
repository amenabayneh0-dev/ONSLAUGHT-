import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Tiny dependency-free router. Normal mode uses real URLs (/about).
 * Setting VITE_HASH_ROUTER=true switches to #about style links, which is
 * only used for the single-file HTML preview.
 */
const HASH = import.meta.env.VITE_HASH_ROUTER === 'true'
const Ctx = createContext({ path: '/', navigate: () => {} })
export const useRouter = () => useContext(Ctx)

const norm = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/'
const hashName = (p) => (p === '/' ? 'home' : p.slice(1).replace(/\//g, '-')) // '/admin/players' -> 'admin-players'

export function RouterProvider({ routes, children }) {
  const known = useMemo(() => routes.map((r) => r.path), [routes])

  const read = useCallback(() => {
    if (!HASH) return norm(window.location.pathname)
    const name = window.location.hash.slice(1)
    return known.find((p) => hashName(p) === name) ?? null // unknown hashes (#stats, #main) are in-page anchors
  }, [known])

  const [path, setPath] = useState(() => read() ?? '/')

  useEffect(() => {
    const sync = () => {
      const next = read()
      if (next) setPath(next)
    }
    const evt = HASH ? 'hashchange' : 'popstate'
    window.addEventListener(evt, sync)
    return () => window.removeEventListener(evt, sync)
  }, [read])

  const navigate = useCallback(
    (to) => {
      const target = norm(to)
      if (HASH) {
        if (known.includes(target)) window.location.hash = hashName(target)
        return
      }
      if (target !== window.location.pathname) window.history.pushState({}, '', target)
      setPath(target)
    },
    [known],
  )

  // Turn internal <a href="/about"> clicks into client-side navigation,
  // so every existing link in Phase 01 keeps working without edits.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href]')
      if (!a || a.target || a.hasAttribute('download')) return
      const href = a.getAttribute('href')
      if (!href.startsWith('/') || href.startsWith('//')) return
      e.preventDefault()
      navigate(href.split(/[?#]/)[0])
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  const first = useRef(true)
  useEffect(() => {
    document.title = (routes.find((r) => r.path === path) ?? routes[0]).title
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [path, routes])

  const value = useMemo(() => ({ path, navigate }), [path, navigate])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
