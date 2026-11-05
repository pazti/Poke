'use client'

import { useActionState, useEffect, useState } from 'react'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Menu,
  MessageCircle,
  MousePointer2,
  Pointer,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import { joinWaitlist, type WaitlistState } from '../actions'

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>
  gtag?: (...args: unknown[]) => void
}

const initialWaitlistState: WaitlistState = {
  message: '',
  status: 'idle',
}

function trackEvent(name: string, properties: Record<string, string> = {}) {
  const analytics = window as AnalyticsWindow
  if (analytics.gtag) {
    analytics.gtag('event', name, properties)
    return
  }
  analytics.dataLayer ??= []
  analytics.dataLayer.push({ event: name, ...properties })
}

const invoices = [
  {
    name: 'Website redesign',
    client: 'Studio North',
    amount: '$2,400',
    status: 'Overdue',
    tone: 'red',
  },
  {
    name: 'Brand identity',
    client: 'Good Things',
    amount: '$1,650',
    status: 'Pending',
    tone: 'orange',
  },
  { name: 'Social templates', client: 'Daybreak', amount: '$800', status: 'Paid', tone: 'green' },
]

const steps = [
  {
    number: '01',
    title: 'Add the invoice.',
    description: 'The client, the amount, the due date. Give your money a place to land.',
    preview: 'INV–024    ·    $2,400    ·    Due Friday',
    tone: 'purple',
  },
  {
    number: '02',
    title: 'Set your nudge.',
    description: 'Start friendly. Get firmer if you need to. Poke handles the follow-through.',
    preview: 'Friendly · Firm · Final',
    tone: 'sand',
  },
  {
    number: '03',
    title: 'Get back to creating.',
    description: 'Reminders go out automatically. You get to focus on the work you love.',
    preview: 'Paid. That’s more like it.',
    tone: 'mint',
  },
]

const benefits = [
  {
    number: '01',
    title: 'Friendly first. Firm when needed.',
    copy: 'Escalating reminders that keep things clear, without making things personal.',
  },
  {
    number: '02',
    title: 'Your relationships, protected.',
    copy: 'A professional buffer between you, your client, and that overdue invoice.',
  },
  {
    number: '03',
    title: 'Set it once. Let it follow up.',
    copy: 'One less open tab in your brain. One more reason to get back to creating.',
  },
]

const promises = [
  {
    icon: MessageCircle,
    title: 'Sounds like you.',
    copy: 'Clear, human reminders that never read like a collections department.',
    detail: 'Friendly by default',
  },
  {
    icon: ShieldCheck,
    title: 'You stay in control.',
    copy: 'Review the cadence, pause a sequence, or take over whenever the moment calls for it.',
    detail: 'Your client, your call',
  },
  {
    icon: Clock3,
    title: 'Set once. Move on.',
    copy: 'Poke keeps an eye on the due date so you can keep your attention on the actual work.',
    detail: 'Less mental overhead',
  },
]

const faqs = [
  {
    question: 'Will my clients know the reminders are automated?',
    answer:
      'The messages are written to feel personal and professional, not robotic. You choose the tone and can review the reminder sequence before it starts.',
  },
  {
    question: 'Can I stop or change a reminder sequence?',
    answer:
      'Yes. You stay in control and can pause, edit, or end a sequence whenever a client replies or the situation changes.',
  },
  {
    question: 'Does Poke replace my invoicing tool?',
    answer:
      'No. Poke is designed to handle the follow-up layer around your existing invoices, so you can keep the tools and workflow you already use.',
  },
  {
    question: 'What does early access include?',
    answer:
      'Early members will help shape the reminder experience and lock in the free launch tier before public release.',
  },
]

function WaitlistForm({
  compact = false,
  source,
}: {
  compact?: boolean
  source: 'hero' | 'final'
}) {
  const [state, formAction, pending] = useActionState<WaitlistState, FormData>(
    joinWaitlist,
    initialWaitlistState,
  )

  useEffect(() => {
    if (state.status !== 'idle') {
      trackEvent(`waitlist_submit_${state.status}`, { source })
    }
  }, [source, state])

  if (state.status === 'success') {
    return (
      <div className={`success-state ${compact ? 'compact' : ''}`} role="status">
        <CheckCircle2 aria-hidden="true" />
        <div>
          <strong>Spot saved.</strong>
          <span>{state.message}</span>
        </div>
      </div>
    )
  }

  return (
    <form className={`waitlist-form ${compact ? 'compact' : ''}`} action={formAction}>
      <label className="sr-only" htmlFor={compact ? 'footer-email' : 'hero-email'}>
        Email address
      </label>
      <input type="hidden" name="source" value={source} />
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${source}-website`}>Website</label>
        <input
          id={`${source}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input
        id={compact ? 'footer-email' : 'hero-email'}
        name="email"
        type="email"
        required
        maxLength={254}
        aria-describedby={state.status === 'error' ? `${source}-form-error` : undefined}
        aria-invalid={state.status === 'error'}
        placeholder="Enter your email address..."
      />
      <button type="submit" disabled={pending}>
        {pending ? 'Saving your spot...' : 'Join Waitlist & Lock Free Tier'}
        <Rocket aria-hidden="true" />
      </button>
      {state.status === 'error' && (
        <p className="form-error" id={`${source}-form-error`} role="alert">
          {state.message}
        </p>
      )}
    </form>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')

    root.classList.add('reveal-ready')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            const section = (entry.target as HTMLElement).dataset.analyticsSection
            if (section) trackEvent('section_view', { section })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [])

  return (
    <main>
      <header className="site-header shell">
        <a className="brand" href="#top" aria-label="Poke home">
          Poke. <Pointer aria-hidden="true" />
        </a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          <a href="#how" onClick={() => setMenuOpen(false)}>
            How It Works
          </a>
          <a href="#why" onClick={() => setMenuOpen(false)}>
            Why Poke
          </a>
          <a href="#manifesto" onClick={() => setMenuOpen(false)}>
            Manifesto
          </a>
          <a
            className="button button-small"
            href="#join"
            onClick={() => {
              setMenuOpen(false)
              trackEvent('cta_click', { location: 'navigation' })
            }}
          >
            Claim Early Access <ArrowRight aria-hidden="true" />
          </a>
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow-pill">
            <Zap aria-hidden="true" />
            Built for Freelancers &amp; Independent Creators
          </div>
          <h1>
            Stop chasing
            <br />
            money.
            <br />
            <span>Send a Poke.</span>
          </h1>
          <p className="hero-lede">
            Automated, escalating payment reminders for freelancers who hate awkward follow-up
            texts. Set it once, get paid faster without burning client relationships.
          </p>
          <WaitlistForm source="hero" />
          <p className="form-note">Free to join. No credit card. Just good payment karma.</p>
        </div>

        <div className="hero-visual" aria-label="Poke payment dashboard preview">
          <img className="purple-glow" src="/assets/ebe05.svg" alt="" />
          <div className="sent-toast floating">
            <span className="toast-icon">
              <Check aria-hidden="true" />
            </span>
            <div>
              <strong>A little nudge. Zero awkwardness.</strong>
              <small>Friendly follow-up sent to Studio North</small>
            </div>
          </div>
          <div className="payment-card">
            <div className="payment-head">
              <strong>Poke.</strong>
              <span>● &nbsp;Autopilot is on</span>
            </div>
            <div className="payment-body">
              <small className="kicker">INVOICES AT A GLANCE</small>
              <b className="total">$4,850</b>
              <p>You create. We do the following up.</p>
              <div className="invoice-list">
                {invoices.map((invoice) => (
                  <div className="invoice" key={invoice.name}>
                    <div>
                      <strong>{invoice.name}</strong>
                      <small>
                        INV–02
                        {invoice.status === 'Overdue'
                          ? '4'
                          : invoice.status === 'Pending'
                            ? '5'
                            : '3'}{' '}
                        · {invoice.client}
                      </small>
                    </div>
                    <div className="invoice-meta">
                      <b>{invoice.amount}</b>
                      <span className={`status ${invoice.tone}`}>{invoice.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="paid-toast floating">
            <small>
              <TrendingUp aria-hidden="true" />
              PAYMENT RECEIVED
            </small>
            <strong>+$800. And you didn’t even ask.</strong>
          </div>
          <p className="cha-ching">Less chasing. More cha-ching.</p>
        </div>
      </section>

      <section className="value-ribbon" aria-label="Poke values">
        <div className="shell ribbon-content">
          <span>YOUR WORK. YOUR MONEY.</span>
          <Sparkles aria-hidden="true" />
          <span>NOT ANOTHER “JUST CHECKING IN”.</span>
          <Sparkles aria-hidden="true" />
          <span>LET POKE DO THE POKING.</span>
        </div>
      </section>

      <section
        className="how section shell"
        id="how"
        data-reveal
        data-analytics-section="how-it-works"
      >
        <p className="section-label">01 / HOW IT WORKS</p>
        <h2>Three steps. Zero awkward texts.</h2>
        <div className="step-grid">
          {steps.map((step) => (
            <article className={`step-card tone-${step.tone}`} key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <div className="step-preview">
                {step.number === '03' && <CheckCircle2 aria-hidden="true" />}
                {step.preview}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="promise-section section" aria-labelledby="promise-heading">
        <div className="shell" data-reveal data-analytics-section="product-promises">
          <div className="promise-heading">
            <div>
              <p className="section-label">BUILT AROUND REAL FREELANCE WORK</p>
              <h2 id="promise-heading">
                Professional follow-up.
                <br />
                Still unmistakably human.
              </h2>
            </div>
            <p>
              The relationship matters as much as the invoice. Poke gives you the consistency of
              automation without losing your voice.
            </p>
          </div>
          <div className="promise-grid">
            {promises.map(({ icon: Icon, title, copy, detail }) => (
              <article className="promise-card" key={title}>
                <div className="promise-icon">
                  <Icon aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span>
                  <Check aria-hidden="true" />
                  {detail}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="why section" id="why">
        <div className="shell why-grid" data-reveal data-analytics-section="why-poke">
          <div>
            <p className="section-label">02 / WHY POKE</p>
            <h2>
              Your talent isn’t
              <br />
              “chasing invoices.”
            </h2>
            <p className="why-lede">
              Keep your energy for the work.
              <br />
              Leave the uncomfortable part to us.
            </p>
            <span className="creator-badge">Built for people, not departments.</span>
          </div>
          <div className="benefit-list">
            {benefits.map((benefit) => (
              <article className="benefit" key={benefit.number}>
                <span>{benefit.number}</span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="manifesto section" id="manifesto">
        <div className="shell manifesto-grid" data-reveal data-analytics-section="manifesto">
          <div className="manifesto-copy">
            <p className="section-label">03 / THE POKE MANIFESTO</p>
            <h2>
              Good work
              <br />
              deserves to
              <br />
              get paid.
            </h2>
            <p>
              Not eventually. Not after your fifth follow-up.
              <br />
              And definitely not at the cost of your peace of mind.
            </p>
            <strong>You did your part. Let Poke do its thing.</strong>
          </div>
          <div className="final-card" id="join">
            <p className="section-label">A LITTLE POKE. A BIG RELIEF.</p>
            <h3>
              Get paid without
              <br />
              the awkward text.
            </h3>
            <p>
              Join the waitlist. Lock in your free tier.
              <br />
              Be first in line when Poke lands.
            </p>
            <WaitlistForm compact source="final" />
          </div>
        </div>
      </section>

      <section className="faq-section section" aria-labelledby="faq-heading">
        <div className="shell faq-grid" data-reveal data-analytics-section="faq">
          <div className="faq-intro">
            <p className="section-label">THE SHORT VERSION</p>
            <h2 id="faq-heading">Questions, answered.</h2>
            <p>No fine print. No mysterious workflow. Just a calmer way to get invoices paid.</p>
            <a
              className="faq-cta"
              href="#join"
              onClick={() => trackEvent('cta_click', { location: 'faq' })}
            >
              Get early access <ArrowRight aria-hidden="true" />
            </a>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>
                  <span>{faq.question}</span>
                  <ChevronDown aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer shell">
        <a className="brand" href="#top">
          Poke.
        </a>
        <p>Less admin. More main-character energy.</p>
        <span>PRE-LAUNCH / MADE FOR INDEPENDENTS</span>
        <MousePointer2 className="footer-cursor" aria-hidden="true" />
      </footer>
    </main>
  )
}

export default App
