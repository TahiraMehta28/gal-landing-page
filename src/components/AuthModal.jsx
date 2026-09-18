import { forwardRef, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  X,
  Check,
  ShieldAlert,
  ArrowLeft,
  KeyRound,
} from 'lucide-react'

import { AUTH_API_URL as API_URL } from '../config/api'

// Resilient fetch wrapper with 15s timeout to prevent infinite spinners on sleeping cloud backends
async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out. The server may be waking up, please try again.')
    }
    throw err
  }
}

const EASE = [0.22, 1, 0.36, 1]
const GOLD = '#C9A227'

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  confirm: '',
  newPassword: '',
  confirmPassword: '',
  code: '',
}

function validate(mode, form) {
  const errors = {}

  if (mode === 'signup') {
    if (!form.name?.trim()) errors.name = 'Please enter your full name'
    if (!form.email?.trim()) errors.email = 'Please enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address'
    if (!form.password) errors.password = 'Enter a password'
    else if (form.password.length < 8) errors.password = 'Must be at least 8 characters'
    if (form.confirm !== form.password) errors.confirm = "Passwords don't match"
  }

  if (mode === 'signin') {
    if (!form.email?.trim()) errors.email = 'Please enter your email'
    if (!form.password) errors.password = 'Please enter your password'
  }

  if (mode === 'forgot_password') {
    if (!form.email?.trim()) errors.email = 'Please enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address'
  }

  if (mode === 'reset_password_code' || mode === 'reset_password') {
    if (mode === 'reset_password_code' && (!form.code?.trim() || form.code.trim().length !== 6)) {
      errors.code = 'Enter the 6-digit code sent to your email'
    }
    if (!form.newPassword) errors.newPassword = 'Enter a new password'
    else if (form.newPassword.length < 8) errors.newPassword = 'Must be at least 8 characters'
    if (form.confirmPassword !== form.newPassword) errors.confirmPassword = "Passwords don't match"
  }

  return errors
}

const Field = forwardRef(function Field({ icon: Icon, error, ...props }, ref) {
  return (
    <div>
      <div
        className="flex items-center gap-3 rounded-xl border bg-white/80 px-4 py-3 transition focus-within:ring-2"
        style={{
          borderColor: error ? '#DC2626' : 'rgba(15,23,42,0.15)',
          boxShadow: 'none',
        }}
      >
        <Icon size={17} className="shrink-0 text-slate-400" />
        <input
          ref={ref}
          {...props}
          className="w-full bg-transparent text-[15px] text-[#1a1a1a] placeholder:text-slate-400 focus:outline-none"
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
})

function PasswordField({ label, name, value, onChange, error, show, onToggleShow, placeholder }) {
  return (
    <div>
      <div
        className="flex items-center gap-3 rounded-xl border bg-white/80 px-4 py-3 transition focus-within:ring-2"
        style={{ borderColor: error ? '#DC2626' : 'rgba(15,23,42,0.15)' }}
      >
        <Lock size={17} className="shrink-0 text-slate-400" />
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-transparent text-[15px] text-[#1a1a1a] placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={onToggleShow}
          tabIndex={-1}
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
          className="shrink-0 text-slate-400 transition hover:text-slate-700 cursor-pointer"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signin',
  resetToken = null,
}) {
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success'
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [resendStatus, setResendStatus] = useState('idle')
  const [codeDigits, setCodeDigits] = useState('')
  const firstFieldRef = useRef(null)

  useEffect(() => {
    if (initialMode) setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    if (!isOpen) return
    // Wake up sleeping backend immediately on modal open so auth requests respond fast
    try {
      const base = API_URL.replace(/\/api\/auth\/?$/, '')
      fetch(`${base}/api/health`, { method: 'GET' }).catch(() => {})
    } catch (e) {}
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    firstFieldRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
    if (errors.form) setErrors((er) => ({ ...er, form: undefined }))
  }

  const switchMode = (next) => {
    setMode(next)
    setErrors({})
    setStatus('idle')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate(mode, form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('loading')
    try {
      // 1. Sign Up Flow -> Generates confirmation email
      if (mode === 'signup') {
        const response = await fetchWithTimeout(`${API_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        })
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Registration failed')
        }

        setRegisteredEmail((form.email || '').trim().toLowerCase())
        setCodeDigits('')
        setStatus('idle')
        setMode('awaiting_verification')
        return
      }

      // 2. Sign In Flow -> Verifies credentials and checks isVerified
      if (mode === 'signin') {
        const response = await fetchWithTimeout(`${API_URL}/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        })
        const data = await response.json()

        if (!response.ok || !data.success) {
          if (data.isUnverified) {
            setRegisteredEmail((form.email || '').trim().toLowerCase())
            setMode('awaiting_verification')
            throw new Error(data.message)
          }
          throw new Error(data.message || 'Invalid email or password')
        }

        if (data.data?.token) {
          localStorage.setItem('gal_token', data.data.token)
          localStorage.setItem('gal_user', JSON.stringify(data.data))
        }

        setStatus('success')
        onAuthSuccess?.(data.data)
        setTimeout(() => {
          onClose?.()
          setStatus('idle')
        }, 1100)
        return
      }

      // 3. Forgot Password Flow -> Sends 6-digit reset code to email and opens code verification
      if (mode === 'forgot_password') {
        const response = await fetchWithTimeout(`${API_URL}/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email.trim(),
          }),
        })
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Could not send reset code')
        }

        setRegisteredEmail(form.email.trim())
        setStatus('idle')
        setMode('reset_password_code')
        return
      }

      // 4. Reset Password with 6-Digit Code Flow
      if (mode === 'reset_password_code') {
        const response = await fetchWithTimeout(`${API_URL}/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: registeredEmail || form.email,
            code: form.code.trim(),
            password: form.newPassword,
          }),
        })
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Could not reset password')
        }

        if (data.data?.token) {
          localStorage.setItem('gal_token', data.data.token)
          localStorage.setItem('gal_user', JSON.stringify(data.data))
        }

        setStatus('success')
        onAuthSuccess?.(data.data)
        setTimeout(() => {
          onClose?.()
          setStatus('idle')
          setMode('signin')
        }, 1200)
        return
      }

      // 5. Reset Password via Link Token Flow
      if (mode === 'reset_password') {
        const url = resetToken ? `${API_URL}/reset-password/${resetToken}` : `${API_URL}/reset-password`
        const response = await fetchWithTimeout(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: resetToken,
            password: form.newPassword,
          }),
        })
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Could not reset password')
        }

        if (data.data?.token) {
          localStorage.setItem('gal_token', data.data.token)
          localStorage.setItem('gal_user', JSON.stringify(data.data))
        }

        setStatus('success')
        onAuthSuccess?.(data.data)
        setTimeout(() => {
          onClose?.()
          setStatus('idle')
          setMode('signin')
        }, 1200)
        return
      }
    } catch (err) {
      console.warn('Auth Error:', err.message)
      setStatus('idle')
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setErrors({
          form: 'Backend server is offline on port 5000. Please start backend with "npm run dev".',
        })
      } else {
        setErrors({ form: err.message || 'Something went wrong. Please try again.' })
      }
    }
  }

  // 6-digit verification code submit handler
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    if (!codeDigits || codeDigits.trim().length !== 6) {
      setErrors({ code: 'Please enter the 6-digit confirmation code' })
      return
    }

    setStatus('loading')
    try {
      const response = await fetchWithTimeout(`${API_URL}/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: (registeredEmail || form.email || '').trim().toLowerCase(),
          code: codeDigits.replace(/\D/g, '').trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid confirmation code')
      }

      if (data.data?.token) {
        localStorage.setItem('gal_token', data.data.token)
        localStorage.setItem('gal_user', JSON.stringify(data.data))
      }

      setStatus('idle')
      setMode('verification_success')
      onAuthSuccess?.(data.data)
    } catch (err) {
      setStatus('idle')
      setErrors({ code: err.message || 'Invalid code. Please check your email.' })
    }
  }

  const handleResendVerification = async () => {
    const targetEmail = (registeredEmail || form.email || '').trim().toLowerCase()
    if (!targetEmail) return
    setResendStatus('loading')
    try {
      const res = await fetchWithTimeout(`${API_URL}/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not resend email')
      }
      setResendStatus('sent')
      setTimeout(() => setResendStatus('idle'), 4000)
    } catch (err) {
      setResendStatus('idle')
      setErrors({ form: err.message || 'Error resending verification email' })
    }
  }

  const handleResendResetCode = async () => {
    const targetEmail = registeredEmail || form.email
    if (!targetEmail) return
    setResendStatus('loading')
    try {
      const res = await fetchWithTimeout(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not resend reset code')
      }
      setResendStatus('sent')
      setTimeout(() => setResendStatus('idle'), 4000)
    } catch (err) {
      setResendStatus('idle')
      setErrors({ form: err.message || 'Error resending reset code' })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-4 backdrop-blur-xl"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.93, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/20 bg-[#FAFAF7]/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-500 transition hover:bg-black/5 hover:text-slate-900 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="px-8 pb-8 pt-9 sm:px-10">
              {/* Back to sign in button for forgot password & reset password */}
              {(mode === 'forgot_password' || mode === 'reset_password' || mode === 'reset_password_code') && (
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#161616] cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </button>
              )}

              {/* ---------------- AWAITING EMAIL CONFIRMATION VIEW ---------------- */}
              {mode === 'awaiting_verification' && (
                <div className="flex flex-col items-center py-4 text-center">
                  <span
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: `${GOLD}22` }}
                  >
                    <Mail size={32} style={{ color: GOLD }} />
                  </span>
                  <span
                    className="mb-1 text-xs font-bold uppercase tracking-wider"
                    style={{ color: GOLD }}
                  >
                    Verification Sent
                  </span>
                  <h2 className="text-2xl font-bold text-[#161616]">Enter Verification Code</h2>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    We sent a 6-digit code to:
                    <br />
                    <span className="font-bold text-slate-900">{registeredEmail}</span>
                  </p>

                  {/* 6-Digit Code Input Form */}
                  <form onSubmit={handleVerifyCode} className="mt-5 w-full flex flex-col gap-3">
                    <label className="text-xs font-semibold text-slate-700">
                      Enter 6-Digit Code:
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border bg-white/90 px-4 py-3 border-black/15 focus-within:ring-2">
                      <KeyRound size={18} className="text-slate-400 shrink-0" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="••••••"
                        value={codeDigits}
                        onChange={(e) => {
                          setCodeDigits(e.target.value.replace(/\D/g, ''))
                          if (errors.code) setErrors((er) => ({ ...er, code: undefined }))
                        }}
                        className="w-full bg-transparent text-center text-lg font-bold tracking-[6px] text-[#161616] placeholder:text-slate-300 focus:outline-none"
                      />
                    </div>
                    {errors.code && (
                      <p className="text-xs font-medium text-red-600 text-left">{errors.code}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="mt-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-70 cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, #E4C55A)` }}
                    >
                      {status === 'loading' ? (
                        <span key="confirm-spinner" className="inline-flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          <span className="text-xs">Confirming...</span>
                        </span>
                      ) : (
                        <span key="confirm-text">Confirm Code</span>
                      )}
                    </button>
                  </form>

                  <div className="mt-5 flex w-full flex-col gap-2">
                    <button
                      type="button"
                      disabled={resendStatus === 'loading'}
                      onClick={handleResendVerification}
                      className="flex items-center justify-center gap-2 rounded-full py-2 text-xs font-semibold border border-black/10 hover:bg-black/5 transition cursor-pointer"
                    >
                      {resendStatus === 'loading' ? (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-slate-800" />
                      ) : resendStatus === 'sent' ? (
                        '✓ New code sent!'
                      ) : (
                        'Resend Code'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="text-xs font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- VERIFICATION SUCCESS VIEW ---------------- */}
              {mode === 'verification_success' && (
                <div className="flex flex-col items-center py-8 text-center">
                  <span
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: '#22c55e22' }}
                  >
                    <Check size={32} className="text-green-600" />
                  </span>
                  <h2 className="text-2xl font-bold text-[#161616]">Email Confirmed!</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Your account has been activated successfully.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 rounded-full px-8 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110 cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, #E4C55A)` }}
                  >
                    Continue to Website
                  </button>
                </div>
              )}

              {/* ---------------- STANDARD FORMS (SIGNIN, SIGNUP, FORGOT, RESET) ---------------- */}
              {mode !== 'awaiting_verification' && mode !== 'verification_success' && (
                <>
                  <span
                    className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide"
                    style={{ color: GOLD }}
                  >
                    <span style={{ width: 18, height: 2, background: GOLD, display: 'inline-block' }} />
                    {mode === 'signin'
                      ? 'Welcome Back'
                      : mode === 'signup'
                      ? 'Create Your Account'
                      : mode === 'forgot_password'
                      ? 'Password Recovery'
                      : mode === 'reset_password_code'
                      ? 'Reset Password'
                      : 'Set New Password'}
                  </span>

                  <h2 id="auth-modal-title" className="text-2xl font-bold text-[#161616] sm:text-[28px]">
                    {mode === 'signin'
                      ? 'Sign in to your account'
                      : mode === 'signup'
                      ? 'Sign up for GAL'
                      : mode === 'forgot_password'
                      ? 'Reset Password'
                      : mode === 'reset_password_code'
                      ? 'Enter code & new password'
                      : 'Choose a new password'}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {mode === 'signin'
                      ? 'Enter your credentials to access your account.'
                      : mode === 'signup'
                      ? 'Create your account. A confirmation will be sent to your email.'
                      : mode === 'forgot_password'
                      ? 'Enter your email address to receive a 6-digit verification code.'
                      : mode === 'reset_password_code'
                      ? `Enter the 6-digit code sent to ${registeredEmail || form.email || 'your email'} and set your new password.`
                      : 'Your new password must be at least 8 characters long.'}
                  </p>

                  {/* Tabs for Sign In <-> Sign Up */}
                  {(mode === 'signin' || mode === 'signup') && (
                    <div className="mt-5 flex rounded-full border border-black/10 bg-black/[0.04] p-1">
                      {['signin', 'signup'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => switchMode(m)}
                          className="relative flex-1 rounded-full py-2 text-sm font-semibold transition cursor-pointer"
                          style={{ color: mode === m ? '#161616' : 'rgba(15,23,42,0.5)' }}
                        >
                          {mode === m && (
                            <motion.span
                              layoutId="auth-tab-pill"
                              transition={{ duration: 0.3, ease: EASE }}
                              className="absolute inset-0 rounded-full bg-white shadow-sm"
                            />
                          )}
                          <span className="relative">{m === 'signin' ? 'Sign In' : 'Sign Up'}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {status === 'success' && mode === 'signin' ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <span
                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                        style={{ background: `${GOLD}22` }}
                      >
                        <Check size={28} style={{ color: GOLD }} />
                      </span>
                      <p className="text-[17px] font-bold text-[#161616]">
                        Signed in successfully!
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Redirecting to your dashboard…</p>
                    </div>
                  ) : status === 'success' && (mode === 'reset_password' || mode === 'reset_password_code' || mode === 'forgot_password') ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <span
                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                        style={{ background: '#22c55e22' }}
                      >
                        <Check size={28} className="text-green-600" />
                      </span>
                      <p className="text-[17px] font-bold text-[#161616]">
                        Password updated successfully!
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        A security alert has been sent to your email. Signing you in…
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5" noValidate>
                      {/* Name Field (Sign Up only) */}
                      {mode === 'signup' && (
                        <div key="name-field-wrap">
                          <Field
                            icon={User}
                            ref={firstFieldRef}
                            name="name"
                            placeholder="Full name"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                            autoComplete="name"
                          />
                        </div>
                      )}

                      {/* Email Field */}
                      {mode !== 'reset_password' && mode !== 'reset_password_code' && (
                        <Field
                          icon={Mail}
                          type="email"
                          name="email"
                          placeholder="Email address"
                          value={form.email}
                          onChange={handleChange}
                          error={errors.email}
                          autoComplete="email"
                        />
                      )}

                      {/* 6-Digit Code Field (Only for reset_password_code) */}
                      {mode === 'reset_password_code' && (
                        <div>
                          <div
                            className="flex items-center gap-3 rounded-xl border bg-white/80 px-4 py-3 transition focus-within:ring-2"
                            style={{ borderColor: errors.code ? '#DC2626' : 'rgba(15,23,42,0.15)' }}
                          >
                            <KeyRound size={17} className="shrink-0 text-slate-400" />
                            <input
                              type="text"
                              maxLength={6}
                              name="code"
                              placeholder="6-digit reset code"
                              value={form.code}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '')
                                setForm((f) => ({ ...f, code: val }))
                                if (errors.code) setErrors((er) => ({ ...er, code: undefined }))
                              }}
                              className="w-full bg-transparent text-[15px] font-semibold tracking-wider text-[#1a1a1a] placeholder:text-slate-400 focus:outline-none"
                            />
                          </div>
                          {errors.code && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.code}</p>}
                        </div>
                      )}

                      {/* Password Field */}
                      {(mode === 'signin' || mode === 'signup') && (
                        <PasswordField
                          label="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          error={errors.password}
                          show={showPw}
                          onToggleShow={() => setShowPw((s) => !s)}
                          placeholder="Password (minimum 8 characters)"
                        />
                      )}

                      {/* Confirm Password Field (Sign Up only) */}
                      {mode === 'signup' && (
                        <div key="confirm-field-wrap">
                          <PasswordField
                            label="confirm password"
                            name="confirm"
                            value={form.confirm}
                            onChange={handleChange}
                            error={errors.confirm}
                            show={showConfirm}
                            onToggleShow={() => setShowConfirm((s) => !s)}
                            placeholder="Confirm password"
                            autoComplete="new-password"
                          />
                        </div>
                      )}

                      {/* Reset Password Form Fields (New Password + Confirm Password) */}
                      {(mode === 'reset_password' || mode === 'reset_password_code') && (
                        <>
                          <PasswordField
                            label="new password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            error={errors.newPassword}
                            show={showPw}
                            onToggleShow={() => setShowPw((s) => !s)}
                            placeholder="New password (minimum 8 characters)"
                          />
                          <PasswordField
                            label="confirm new password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            show={showConfirm}
                            onToggleShow={() => setShowConfirm((s) => !s)}
                            placeholder="Confirm new password"
                          />
                        </>
                      )}

                      {/* Forgot password trigger */}
                      {mode === 'signin' && (
                        <div className="-mt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => switchMode('forgot_password')}
                            className="text-xs font-semibold text-slate-500 hover:text-[#161616] cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}

                      {/* Error banner */}
                      {errors.form && (
                        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-2.5 text-xs text-red-600 border border-red-200">
                          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                          <span>{errors.form}</span>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="mt-1 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-70 cursor-pointer"
                        style={{ background: `linear-gradient(135deg, ${GOLD}, #E4C55A)` }}
                      >
                        {status === 'loading' ? (
                          <span key="main-spinner" className="inline-flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            <span className="text-xs font-semibold">Please wait...</span>
                          </span>
                        ) : (
                          <span key="main-btn-text">
                            {mode === 'signin' && 'Sign In'}
                            {mode === 'signup' && 'Sign Up'}
                            {mode === 'forgot_password' && 'Send Reset Code'}
                            {mode === 'reset_password_code' && 'Reset Password'}
                            {mode === 'reset_password' && 'Reset Password'}
                          </span>
                        )}
                      </button>

                      {/* Resend Code for reset_password_code */}
                      {mode === 'reset_password_code' && (
                        <div className="mt-1 text-center">
                          <button
                            type="button"
                            disabled={resendStatus === 'loading'}
                            onClick={handleResendResetCode}
                            className="text-xs font-semibold text-slate-500 hover:text-[#161616] cursor-pointer"
                          >
                            {resendStatus === 'loading'
                              ? 'Sending code…'
                              : resendStatus === 'sent'
                              ? '✓ New code sent to your email!'
                              : "Didn't receive the code? Resend"}
                          </button>
                        </div>
                      )}

                      {/* Footer toggles */}
                      {mode === 'signin' && (
                        <p className="mt-1 text-center text-sm text-slate-500">
                          New to GAL?{' '}
                          <button
                            type="button"
                            onClick={() => switchMode('signup')}
                            className="font-semibold text-[#161616] hover:underline cursor-pointer"
                          >
                            Create an account
                          </button>
                        </p>
                      )}

                      {mode === 'signup' && (
                        <p className="mt-1 text-center text-sm text-slate-500">
                          Already have an account?{' '}
                          <button
                            type="button"
                            onClick={() => switchMode('signin')}
                            className="font-semibold text-[#161616] hover:underline cursor-pointer"
                          >
                            Sign in
                          </button>
                        </p>
                      )}
                    </form>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
