import { useRef, useState } from 'react'
import { ChevronDown, ImagePlus, Plus, Trash2, User } from 'lucide-react'
import FormField, { inputClass } from '../recruitment/FormField.jsx'
import { Btn, IconBtn } from './ui.jsx'
import { fileToDataUrl, isDataUrl, kb } from '../../admin/images.js'

let n = 0
const useId = (p) => useRef(`${p}-${++n}`).current

export function TextField({ label, value, onChange, error, hint, required, placeholder, type = 'text', inputMode, maxLength, autoFocus, disabled }) {
  const id = useId('f')
  return (
    <FormField id={id} label={label} required={required} hint={hint} error={error}>
      {(aria) => <input {...aria} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode} maxLength={maxLength} disabled={disabled} data-autofocus={autoFocus ? '' : undefined} className={inputClass(error)} autoComplete="off" />}
    </FormField>
  )
}

export function AreaField({ label, value, onChange, error, hint, required, rows = 4, placeholder, maxLength }) {
  const id = useId('f')
  return (
    <FormField id={id} label={label} required={required} hint={hint} error={error} counter={maxLength ? <span className="text-xs font-normal text-ons-silver/60">{value.length}/{maxLength}</span> : undefined}>
      {(aria) => <textarea {...aria} value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className={`${inputClass(error)} resize-y`} />}
    </FormField>
  )
}

export function SelectField({ label, value, onChange, options, error, hint, required, placeholder }) {
  const id = useId('f')
  return (
    <FormField id={id} label={label} required={required} hint={hint} error={error}>
      {(aria) => (
        <>
          <select {...aria} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass(error)} appearance-none pr-11`}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((o) => <option key={o.value} value={o.value} className="bg-ons-black text-ons-white">{o.label}</option>)}
          </select>
          <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ons-silver" />
        </>
      )}
    </FormField>
  )
}

export function CheckField({ label, checked, onChange, hint }) {
  const id = useId('c')
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-ons-silver">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-[#C0C0C0]" />
      <span><span className="font-semibold text-ons-white">{label}</span>{hint && <span className="block text-xs text-ons-silver/70">{hint}</span>}</span>
    </label>
  )
}

/** Editable list of small records (achievements, awards, social links...). */
export function RepeatField({ label, items, onChange, fields, newItem, addLabel = 'Add', error, emptyText = 'Nothing added yet.' }) {
  const set = (i, key, v) => onChange(items.map((it, j) => (j === i ? { ...it, [key]: v } : it)))
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-ons-white">{label}</legend>
      {items.length === 0 && <p className="mb-3 text-sm text-ons-silver/70">{emptyText}</p>}
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 border border-ons-silver/15 bg-ons-black/40 p-3">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              {fields.map((f) => (
                f.options ? (
                  <label key={f.key} className="block text-xs text-ons-silver">{f.label}
                    <span className="relative mt-1 block">
                      <select aria-label={`${f.label} ${i + 1}`} value={it[f.key]} onChange={(e) => set(i, f.key, e.target.value)} className={`${inputClass(false)} appearance-none py-2.5 pr-10 text-sm`}>
                        {f.options.map((o) => <option key={o.value} value={o.value} className="bg-ons-black">{o.label}</option>)}
                      </select>
                      <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ons-silver" />
                    </span>
                  </label>
                ) : (
                  <label key={f.key} className={`block text-xs text-ons-silver ${f.wide ? 'sm:col-span-2' : ''}`}>{f.label}
                    <input aria-label={`${f.label} ${i + 1}`} value={it[f.key]} onChange={(e) => set(i, f.key, e.target.value)} placeholder={f.placeholder} className={`${inputClass(false)} mt-1 py-2.5 text-sm`} autoComplete="off" />
                  </label>
                )
              ))}
            </div>
            <IconBtn label={`Remove ${label.toLowerCase()} ${i + 1}`} onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 size={15} /></IconBtn>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 text-sm text-ons-white" role="alert">{error}</p>}
      <Btn className="mt-3" onClick={() => onChange([...items, newItem()])}><Plus size={15} /> {addLabel}</Btn>
    </fieldset>
  )
}

/** Image manager: upload (resized, stored in the draft), or point to a /path or https link. */
export function ImageField({ label, value, onChange, error, maxSize = 1600, shape = 'aspect-[4/5]', hint }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState('')
  const [failed, setFailed] = useState(false)
  const id = useId('img')

  async function pick(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true); setProblem('')
    try { const r = await fileToDataUrl(file, { maxSize }); onChange(r.dataUrl); setFailed(false) }
    catch (err) { setProblem(err.message) }
    finally { setBusy(false) }
  }

  const shown = value && !failed
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-ons-white">{label}</legend>
      <div className="flex gap-4">
        <div className={`${shape} w-28 shrink-0 overflow-hidden border border-ons-silver/25 bg-ons-black`}>
          {shown ? <img src={value} alt="" onError={() => setFailed(true)} className="h-full w-full object-cover" /> : <div aria-hidden="true" className="texture-diagonal flex h-full w-full items-center justify-center text-ons-silver/50"><User size={28} strokeWidth={1} /></div>}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} className="sr-only" aria-label={`Upload ${label.toLowerCase()}`} tabIndex={-1} />
            <Btn onClick={() => input.current?.click()} disabled={busy}><ImagePlus size={15} /> {busy ? 'Processing…' : value ? 'Replace image' : 'Upload image'}</Btn>
            {value && <Btn variant="ghost" onClick={() => { onChange(''); setFailed(false) }}>Remove</Btn>}
          </div>
          {isDataUrl(value) ? (
            <p className="text-xs text-ons-silver">Uploaded image, {kb(value.length * 0.75)}. Stored in this draft; export it to add it to the website.</p>
          ) : (
            <div>
              <label htmlFor={id} className="text-xs text-ons-silver">Or a path or link</label>
              <input id={id} value={value} onChange={(e) => { onChange(e.target.value); setFailed(false) }} placeholder="/images/roster/name.jpg" className={`${inputClass(error)} mt-1 py-2.5 text-sm`} autoComplete="off" aria-invalid={error ? 'true' : undefined} />
            </div>
          )}
          {hint && <p className="text-xs text-ons-silver/70">{hint}</p>}
        </div>
      </div>
      {(problem || error) && <p className="mt-2 text-sm text-ons-white" role="alert">{problem || error}</p>}
    </fieldset>
  )
}
