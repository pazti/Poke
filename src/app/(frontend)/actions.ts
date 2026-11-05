'use server'

import { sendWaitlistConfirmation } from '@/lib/waitlist-email'
import { createSupabaseServerClient } from '@/lib/supabase'

type WaitlistSource = 'hero' | 'final'

const allowedSources = new Set<WaitlistSource>(['hero', 'final'])
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type WaitlistState = {
  message: string
  status: 'idle' | 'success' | 'error'
}

export async function joinWaitlist(
  _previousState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const honeypot = formData.get('website')
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return {
      message: 'You’re on the list. We’ll send the first Poke your way soon.',
      status: 'success',
    }
  }

  const rawEmail = formData.get('email')
  const rawSource = formData.get('source')
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
  const source = typeof rawSource === 'string' ? rawSource : ''

  if (email.length > 254 || !emailPattern.test(email)) {
    return { message: 'Enter a valid email address to join the waitlist.', status: 'error' }
  }

  if (!allowedSources.has(source as WaitlistSource)) {
    return { message: 'This signup form could not be verified. Please try again.', status: 'error' }
  }

  try {
    const { error } = await createSupabaseServerClient()
      .from('waitlist_signups')
      .insert({
        email,
        source: source as WaitlistSource,
      })

    if (error?.code === '23505') {
      return {
        message: 'You’re already on the list. We’ll be in touch when Poke is ready.',
        status: 'success',
      }
    }

    if (error) {
      return {
        message: 'We couldn’t save your spot just now. Please try again in a moment.',
        status: 'error',
      }
    }

    await sendWaitlistConfirmation(email)

    return {
      message: 'You’re on the list. We’ll send the first Poke your way soon.',
      status: 'success',
    }
  } catch {
    return {
      message: 'We couldn’t save your spot just now. Please try again in a moment.',
      status: 'error',
    }
  }
}
