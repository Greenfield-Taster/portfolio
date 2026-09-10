import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { Section } from '../../components/Section/Section'
import { Button } from '../../components/Button/Button'
import { profile } from '../../data/profile'
import { validateContact, isConfigured } from '../../lib/validate'
import type { ContactDraft, FieldErrors } from '../../lib/validate'
import './Contact.scss'

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unconfigured'

const EMPTY: ContactDraft = { name: '', email: '', message: '' }

export function Contact() {
  const [draft, setDraft] = useState<ContactDraft>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  const set = (field: keyof ContactDraft) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setDraft((prev) => ({ ...prev, [field]: event.target.value }))

  async function onSubmit(event: FormEvent) {
    event.preventDefault()

    // In-flight guard: a disabled submit button does not stop a second
    // submission triggered by pressing Enter in a focused text field, so
    // this check is the real backstop against overlapping sends.
    if (status === 'sending') return

    const found = validateContact(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setStatus('idle')
      return
    }

    const env = import.meta.env as unknown as Record<string, string | undefined>
    if (!isConfigured(env)) {
      setStatus('unconfigured')
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(
        env.VITE_EMAILJS_SERVICE_ID!,
        env.VITE_EMAILJS_TEMPLATE_ID!,
        { from_name: draft.name, reply_to: draft.email, message: draft.message },
        { publicKey: env.VITE_EMAILJS_PUBLIC_KEY! }
      )
      setStatus('sent')
      setDraft(EMPTY)
    } catch {
      // The visitor's message is kept in `draft` on purpose — a failed send
      // must never discard what they wrote.
      setStatus('error')
    }
  }

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Get in touch"
      lede="Open to full-time roles and to project work. I reply to everything."
    >
      <div className="contact" data-reveal>
        <ul className="contact__direct">
          <li>
            <span className="u-label">Email</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <span className="u-label">LinkedIn</span>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              anastasiia-horbachova
            </a>
          </li>
          <li>
            <span className="u-label">GitHub</span>
            <a href={profile.github} target="_blank" rel="noreferrer">
              Greenfield-Taster
            </a>
          </li>
          <li>
            <span className="u-label">CV</span>
            <a href={profile.cvPath} download>
              Download PDF
            </a>
          </li>
        </ul>

        <form className="contact__form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={draft.name}
              onChange={set('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'err-name' : undefined}
            />
            {errors.name && (
              <em id="err-name" className="field__error">
                {errors.name}
              </em>
            )}
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={draft.email}
              onChange={set('email')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'err-email' : undefined}
            />
            {errors.email && (
              <em id="err-email" className="field__error">
                {errors.email}
              </em>
            )}
          </label>

          <label className="field">
            <span>Message</span>
            <textarea
              rows={5}
              value={draft.message}
              onChange={set('message')}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'err-message' : undefined}
            />
            {errors.message && (
              <em id="err-message" className="field__error">
                {errors.message}
              </em>
            )}
          </label>

          <div className="contact__actions">
            <Button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </Button>
          </div>

          <p className="contact__status" role="status">
            {status === 'sent' && 'Thank you — your message is on its way.'}
            {status === 'error' && `Sending failed. Please email me directly at ${profile.email}.`}
            {status === 'unconfigured' &&
              `The form is not connected yet — please email me directly at ${profile.email}.`}
          </p>
        </form>
      </div>
    </Section>
  )
}
