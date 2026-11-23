import { Suspense, useEffect } from 'react'
import AdminProvider from '../../admin/AdminProvider.jsx'
import AdminLayout from './AdminLayout.jsx'

/** Wraps every /admin page with the draft store and dashboard chrome (no public navbar/footer). */
export default function AdminShell({ children }) {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
  return (
    <AdminProvider>
      <AdminLayout>
        <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>{children}</Suspense>
      </AdminLayout>
    </AdminProvider>
  )
}
