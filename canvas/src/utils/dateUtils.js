/**
 * Formatea una fecha a un formato relativo
 */
export function timeAgo(date) {
  const now = new Date()
  const past = new Date(date)
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (seconds < 5) return 'ahora'
  if (seconds < 60) return `hace ${seconds} segundos`
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} minutos`
  if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} horas`

  if (seconds < 2592000) {
    return `hace ${Math.floor(seconds / 86400)} días`
  }

  if (seconds < 31536000) {
    return `hace ${Math.floor(seconds / 2592000)} meses`
  }

  return `hace ${Math.floor(seconds / 31536000)} años`
}

/**
 * Formatea fecha
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Formatea hora
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  })
}