const TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_INPUT_BYTES = 12 * 1024 * 1024

/**
 * Reads an image file, shrinks it (so it fits in browser storage) and returns a JPEG data URL.
 * Throws an Error with a user-readable message on bad input.
 */
export async function fileToDataUrl(file, { maxSize = 1600, quality = 0.82 } = {}) {
  if (!TYPES.includes(file.type)) throw new Error('Choose a JPG, PNG or WebP image.')
  if (file.size > MAX_INPUT_BYTES) throw new Error('That image is over 12 MB. Choose a smaller one.')
  const bitmap = await createImageBitmap(file).catch(() => { throw new Error('That file could not be read as an image.') })
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale), h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, w, h) // flatten transparency
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()
  return { dataUrl: canvas.toDataURL('image/jpeg', quality), width: w, height: h }
}

export const isDataUrl = (s) => typeof s === 'string' && s.startsWith('data:image/')
export const validImageRef = (s) => !s || isDataUrl(s) || /^\/[^\s]*$/.test(s) || /^https?:\/\/[^\s]+$/.test(s)
export const kb = (bytes) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`)
