import 'server-only'

type ConfirmationResult = 'sent' | 'skipped' | 'failed'

export async function sendWaitlistConfirmation(email: string): Promise<ConfirmationResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.WAITLIST_FROM_EMAIL

  if (!apiKey || !from) return 'skipped'

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Your Poke early-access spot is saved',
        text: [
          'You’re on the Poke early-access list.',
          '',
          'We’ll let you know when it’s time to turn awkward invoice follow-ups into friendly, automatic nudges.',
          '',
          'Less chasing. More creating.',
          '— Poke',
        ].join('\n'),
        html: `
          <div style="background:#f4f3ef;color:#111;font-family:Arial,sans-serif;padding:40px 20px">
            <div style="background:#fff;border:2px solid #111;border-radius:14px;box-shadow:6px 6px 0 #111;margin:0 auto;max-width:520px;padding:32px">
              <p style="font-size:28px;font-weight:800;margin:0 0 28px">Poke.</p>
              <h1 style="font-size:30px;line-height:1.1;margin:0 0 18px">Your early-access spot is saved.</h1>
              <p style="color:#656367;font-size:16px;line-height:1.5;margin:0 0 22px">
                We’ll let you know when it’s time to turn awkward invoice follow-ups into friendly, automatic nudges.
              </p>
              <p style="background:#ffde00;border:2px solid #111;border-radius:8px;font-weight:700;margin:0;padding:14px 16px">
                Less chasing. More creating.
              </p>
            </div>
          </div>
        `,
      }),
    })

    return response.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
