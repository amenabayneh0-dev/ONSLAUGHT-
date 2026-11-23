import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import { RouterProvider, useRouter } from './router.jsx'
import { routes } from './routes.js'

const AdminShell = lazy(() => import('./components/admin/AdminShell.jsx'))

function Shell() {
  const { path } = useRouter()
  const route = routes.find((r) => r.path === path) ?? routes[0]
  const Page = route.component
  if (route.admin) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-ons-black" aria-hidden="true" />}>
        <AdminShell><Page /></AdminShell>
      </Suspense>
    )
  }
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ons-silver focus:px-4 focus:py-2 focus:text-ons-black"
      >
        Skip to content
      </a>
      <Navbar />
      <motion.main id="main" key={path} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
        <Suspense fallback={<div className="min-h-screen bg-ons-black" aria-hidden="true" />}>
          <Page />
        </Suspense>
      </motion.main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <RouterProvider routes={routes}>
      <Shell />
    </RouterProvider>
  )
}
