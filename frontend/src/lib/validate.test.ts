import { validateContact, isConfigured } from './validate'

const valid = { name: 'Olena', email: 'olena@example.com', message: 'Hello there.' }

describe('validateContact', () => {
  it('accepts a complete message', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('asks for a name when it is missing', () => {
    expect(validateContact({ ...valid, name: '  ' }).name).toBe('Please add your name.')
  })

  it('asks for an email when it is missing', () => {
    expect(validateContact({ ...valid, email: '' }).email).toBe(
      'Please add an email address so I can reply.'
    )
  })

  it('explains what is wrong with a malformed email', () => {
    expect(validateContact({ ...valid, email: 'olena@' }).email).toBe(
      'That does not look like an email address.'
    )
  })

  it('asks for a message when it is empty', () => {
    expect(validateContact({ ...valid, message: '' }).message).toBe(
      'Please write a short message.'
    )
  })

  it('rejects a message too short to mean anything', () => {
    expect(validateContact({ ...valid, message: 'hi' }).message).toBe(
      'Please write at least 10 characters.'
    )
  })

  it('reports every problem at once rather than one at a time', () => {
    const errors = validateContact({ name: '', email: '', message: '' })
    expect(Object.keys(errors)).toHaveLength(3)
  })
})

describe('isConfigured', () => {
  it('is true when all three EmailJS keys are present', () => {
    expect(
      isConfigured({
        VITE_EMAILJS_SERVICE_ID: 's',
        VITE_EMAILJS_TEMPLATE_ID: 't',
        VITE_EMAILJS_PUBLIC_KEY: 'k',
      })
    ).toBe(true)
  })

  it('is false when any key is missing', () => {
    expect(
      isConfigured({ VITE_EMAILJS_SERVICE_ID: 's', VITE_EMAILJS_TEMPLATE_ID: 't' })
    ).toBe(false)
  })

  it('is false when a key is present but blank', () => {
    expect(
      isConfigured({
        VITE_EMAILJS_SERVICE_ID: 's',
        VITE_EMAILJS_TEMPLATE_ID: '  ',
        VITE_EMAILJS_PUBLIC_KEY: 'k',
      })
    ).toBe(false)
  })
})
