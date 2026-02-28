const DEFAULT_ADMIN_EMAILS = ['kelajakmerosi@gmail.com']

const normalizeEmail = (value) => String(value || '').trim().toLowerCase()

const normalizePhone = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (raw.startsWith('+')) return raw
  const digitsOnly = raw.replace(/\D/g, '')
  if (digitsOnly.startsWith('998') && digitsOnly.length === 12) return `+${digitsOnly}`
  return raw
}

const parseList = (rawValue, normalizer) =>
  String(rawValue || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => normalizer(entry))

const getAdminEmails = () => {
  const configured = parseList(process.env.ADMIN_EMAILS, normalizeEmail)
  if (configured.length > 0) return new Set(configured)
  return new Set(DEFAULT_ADMIN_EMAILS.map((email) => normalizeEmail(email)))
}

const getAdminPhones = () => {
  const configured = parseList(process.env.ADMIN_PHONES, normalizePhone)
  return new Set(configured)
}

const isConfiguredAdmin = (user) => {
  if (!user || typeof user !== 'object') return false
  const email = normalizeEmail(user.email)
  const phone = normalizePhone(user.phone)
  const emails = getAdminEmails()
  const phones = getAdminPhones()

  return Boolean((email && emails.has(email)) || (phone && phones.has(phone)))
}

module.exports = {
  isConfiguredAdmin,
  getAdminEmails,
  getAdminPhones,
  normalizeEmail,
  normalizePhone,
}
