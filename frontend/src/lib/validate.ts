export interface ContactDraft {
  name: string
  email: string
  message: string
}

export type FieldErrors = Partial<Record<keyof ContactDraft, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact(draft: ContactDraft): FieldErrors {
  const errors: FieldErrors = {}

  if (!draft.name.trim()) {
    errors.name = 'Please add your name.'
  }

  const email = draft.email.trim()
  if (!email) {
    errors.email = 'Please add an email address so I can reply.'
  } else if (!EMAIL.test(email)) {
    errors.email = 'That does not look like an email address.'
  }

  const message = draft.message.trim()
  if (!message) {
    errors.message = 'Please write a short message.'
  } else if (message.length < 10) {
    errors.message = 'Please write at least 10 characters.'
  }

  return errors
}

const KEYS = [
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_PUBLIC_KEY',
] as const

export function isConfigured(env: Record<string, string | undefined>): boolean {
  return KEYS.every((key) => Boolean(env[key]?.trim()))
}
