/**
 * Draft persistence. Today this is the browser's localStorage, so the dashboard
 * edits a LOCAL DRAFT, not the live website. When a backend exists, this is the
 * seam to replace (load from / save to Supabase) without touching the screens.
 */
import { SEED_VERSION, createSeed } from './seed.js'

export const DRAFT_KEY = 'ons.admin.draft.v1'
export const STORAGE_LIMIT = 5 * 1024 * 1024 // typical browser localStorage budget

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return { state: createSeed(), fromStorage: false }
    const parsed = JSON.parse(raw)
    if (parsed?.version !== SEED_VERSION) return { state: createSeed(), fromStorage: false }
    return { state: { ...createSeed(), ...parsed }, fromStorage: true }
  } catch {
    return { state: createSeed(), fromStorage: false }
  }
}

/** Returns { ok, bytes, error }. Never throws; callers must surface failures. */
export function saveDraft(state) {
  try {
    const json = JSON.stringify(state)
    localStorage.setItem(DRAFT_KEY, json)
    return { ok: true, bytes: json.length * 2 }
  } catch (error) {
    return { ok: false, bytes: 0, error }
  }
}

export function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY) } catch { /* unavailable */ }
}
