const USERS_KEY = 'cookie-clicker-users'
const SESSION_KEY = 'cookie-clicker-session'

export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function loadSession() {
  return localStorage.getItem(SESSION_KEY)
}

export function saveSession(username) {
  localStorage.setItem(SESSION_KEY, username)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
