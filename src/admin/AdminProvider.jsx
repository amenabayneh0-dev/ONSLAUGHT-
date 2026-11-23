import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { createSeed } from './seed.js'
import { clearDraft, loadDraft, saveDraft } from './storage.js'

const Ctx = createContext(null)
export const useAdmin = () => useContext(Ctx)

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
const log = (state, entity, action, text) => ({ ...state, activity: [{ id: uid(), at: new Date().toISOString(), entity, action, text }, ...state.activity].slice(0, 100) })

function reducer(state, a) {
  switch (a.type) {
    case 'upsert': {
      const list = state[a.entity]
      const exists = list.some((x) => x.id === a.item.id)
      const next = exists ? list.map((x) => (x.id === a.item.id ? a.item : x)) : [...list, a.item]
      return log({ ...state, [a.entity]: next }, a.entity, exists ? 'updated' : 'added', a.text)
    }
    case 'remove':
      return log({ ...state, [a.entity]: state[a.entity].filter((x) => x.id !== a.id) }, a.entity, 'deleted', a.text)
    case 'set':
      return log({ ...state, [a.entity]: a.value }, a.entity, a.action ?? 'updated', a.text)
    case 'replaceAll':
      return log({ ...a.state, activity: state.activity }, 'system', a.action, a.text)
    default:
      return state
  }
}

export default function AdminProvider({ children }) {
  const initial = useRef(null)
  if (!initial.current) initial.current = loadDraft()
  const [state, dispatch] = useReducer(reducer, initial.current.state)
  const [persist, setPersist] = useState({ ok: true, bytes: 0, error: null })
  const [toasts, setToasts] = useState([])
  const [epoch, setEpoch] = useState(0) // bumps on reset/restore so open forms re-initialise
  const first = useRef(true)

  const toast = useCallback((message, kind = 'ok') => {
    const id = uid()
    setToasts((t) => [...t.slice(-2), { id, message, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'error' ? 7000 : 3500)
  }, [])

  // Save after every change (skipping the untouched seed), and report failures honestly.
  useEffect(() => {
    if (first.current) { first.current = false; if (!initial.current.fromStorage) return }
    const res = saveDraft(state)
    setPersist(res)
    if (!res.ok) toast('NOT saved: browser storage is full or unavailable. This change exists only on this screen.', 'error')
  }, [state, toast])

  const actions = useMemo(() => ({
    upsert: (entity, item, text) => dispatch({ type: 'upsert', entity, item, text }),
    remove: (entity, id, text) => dispatch({ type: 'remove', entity, id, text }),
    set: (entity, value, text, action) => dispatch({ type: 'set', entity, value, text, action }),
    replaceAll: (next, text, action = 'import') => { dispatch({ type: 'replaceAll', state: next, text, action }); setEpoch((e) => e + 1) },
    reset: () => { clearDraft(); dispatch({ type: 'replaceAll', state: createSeed(), text: 'Draft reset to the website data', action: 'reset' }); setEpoch((e) => e + 1) },
    newId: uid,
  }), [])

  const value = useMemo(() => ({ state, actions, persist, toast, toasts, epoch }), [state, actions, persist, toast, toasts, epoch])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
