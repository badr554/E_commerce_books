export function getCookie(name) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=')
}

export function getCsrfToken() {
  const metaToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content')

  return (
    metaToken ||
    decodeURIComponent(getCookie('XSRF-TOKEN') || '') ||
    sessionStorage.getItem('csrfToken') ||
    ''
  )
}

export function attachCsrfToken(config) {
  const method = (config.method || 'get').toLowerCase()
  const safeMethods = ['get', 'head', 'options']

  if (safeMethods.includes(method)) return config

  const csrfToken = getCsrfToken()
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken
  }

  return config
}
