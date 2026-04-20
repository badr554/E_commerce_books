export function sanitizeInput(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

export function sanitizeObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, sanitizeInput(value)])
  )
}
