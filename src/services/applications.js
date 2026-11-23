import { toApplicationRecord } from '../lib/application.js'

/**
 * Application submission service.
 *
 * Supabase is OFF until both env variables are set (see .env.example):
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
 * With them set, applications are inserted through Supabase's REST API
 * (no SDK needed). Without them, NOTHING is saved or sent, and the result says
 * so (`saved: false`) so the UI can never claim otherwise.
 *
 * Result: { ok: true, saved, record } | { ok: false, reason: 'duplicate' | 'network' | 'server' }
 */
const URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '')
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const TABLE = 'applications'

export const backendConnected = Boolean(URL && KEY)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export async function submitApplication(values) {
  const record = toApplicationRecord(values)

  if (!backendConnected) {
    await sleep(600) // brief pause so the loading state is visible
    return { ok: true, saved: false, record }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(`${URL}/rest/v1/${TABLE}`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal', // anonymous users can insert but not read rows back
      },
      body: JSON.stringify(record),
    })
    if (res.ok) return { ok: true, saved: true, record }
    const body = await res.json().catch(() => null)
    if (res.status === 409 || body?.code === '23505') return { ok: false, reason: 'duplicate' }
    return { ok: false, reason: 'server' }
  } catch {
    return { ok: false, reason: 'network' }
  } finally {
    clearTimeout(timer)
  }
}
