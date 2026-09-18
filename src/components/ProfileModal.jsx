import { forwardRef, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, LogOut, Mail, Pencil, User, X, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

import { AUTH_API_URL as API_URL } from '../config/api'

const EASE = [0.22, 1, 0.36, 1]
const GOLD = '#C9A227'

function initialsOf(name) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function validate(form, changingPassword) {
  const errors = {}
  if (!form.name?.trim()) errors.name = 'Please enter your name'
  if (!form.email?.trim()) errors.email = 'Please enter your email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email address'

  if (changingPassword) {
    if (!form.currentPassword) {
      errors.currentPassword = 'Enter your current (old) password'
    }

    if (!form.newPassword) {
      errors.newPassword = 'Enter your new password'
    } else if (form.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters long'
    } else if (form.currentPassword && form.newPassword === form.currentPassword) {
      errors.newPassword = 'New password must be different from your old password'
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirm your new password'
    } else if (form.confirmPassword !== form.newPassword) {
      errors.confirmPassword = 'New passwords do not match'
    }
  }
  return errors
}

const Field = forwardRef(function Field({ icon: Icon, label, error, ...props }, ref) {
  return (
    <div>
      {label && <label className="block mb-1 text-xs font-semibold text-slate-700">{label}</label>}
      <div
        className="flex items-center gap-3 rounded-xl border bg-white/80 px-4 py-2.5 transition focus-within:ring-2"
        style={{ borderColor: error ? '#DC2626' : 'rgba(15,23,42,0.15)' }}
      >
        <Icon size={17} className="shrink-0 text-slate-400" />
        <input
          ref={ref}
          {...props}
          className="w-full bg-transparent text-[14px] text-[#1a1a1a] placeholder:text-slate-400 focus:outline-none"
        />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
})

function PasswordField({ label, name, value, onChange, error, show, onToggleShow, placeholder }) {
  return (
    <div>
      {label && <label className="block mb-1 text-xs font-semibold text-slate-700">{label}</label>}
      <div
        className="flex items-center gap-3 rounded-xl border bg-white/80 px-4 py-2.5 transition focus-within:ring-2"
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
          className="w-full bg-transparent text-[14px] text-[#1a1a1a] placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={onToggleShow}
          tabIndex={-1}
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
          className="shrink-0 text-slate-400 transition hover:text-slate-700 cursor-pointer"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}

function ReadRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/60 px-4 py-3.5">
      <Icon size={17} className="shrink-0 text-slate-400" />
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
        <div className="truncate text-[15px] font-medium text-[#1a1a1a]">{value || '—'}</div>
      </div>
    </div>
  )
}

const DEFAULT_USER = { name: 'Alex Rivera', email: 'alex@example.com' }

export default function ProfileModal({
  user = DEFAULT_USER,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onUpdate,
  onLogout,
  showTrigger = false,
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)

  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success'
  const firstFieldRef = useRef(null)

  // Keep form updated with current user
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }))
    }
  }, [user])

  const open = () => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setEditing(false)
    setChangingPassword(false)
    setErrors({})
    setStatus('idle')
    if (!isControlled) {
      setInternalIsOpen(true)
    }
  }

  const close = () => {
    if (isControlled) {
      controlledOnClose?.()
    } else {
      setInternalIsOpen(false)
    }
    setTimeout(() => {
      setEditing(false)
      setChangingPassword(false)
      setErrors({})
      setStatus('idle')
    }, 200)
  }

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (editing) firstFieldRef.current?.focus()
  }, [editing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
    if (errors.form) setErrors((er) => ({ ...er, form: undefined }))
  }

  const startEdit = () => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setChangingPassword(false)
    setErrors({})
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setChangingPassword(false)
    setErrors({})
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const nextErrors = validate(form, changingPassword)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('loading')
    try {
      const token = localStorage.getItem('gal_token')

      if (!token) {
        throw new Error(
          'No active login session found. Please sign in again so your current password can be verified.'
        )
      }

      const res = await fetch(`${API_URL}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          currentPassword: changingPassword ? form.currentPassword : undefined,
          newPassword: changingPassword ? form.newPassword : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        // Specific error matching for current password mismatch
        if (
          data.message &&
          (data.message.toLowerCase().includes('current password') ||
            data.message.toLowerCase().includes('old password'))
        ) {
          setErrors({ currentPassword: data.message })
          setStatus('idle')
          return
        }
        throw new Error(data.message || 'Could not update profile.')
      }

      // Update local storage and parent state
      const nextUser = {
        ...user,
        name: data.data.name || form.name,
        email: data.data.email || form.email,
      }
      if (data.data.token) {
        localStorage.setItem('gal_token', data.data.token)
      }
      localStorage.setItem('gal_user', JSON.stringify(nextUser))
      onUpdate?.(nextUser)

      setStatus('success')
      setTimeout(() => {
        setStatus('idle')
        setEditing(false)
        setChangingPassword(false)
        setForm((f) => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }))
      }, 1500)
    } catch (err) {
      console.warn('Profile save error:', err.message)
      setStatus('idle')

      // Friendly translation for network connection failure (ERR_CONNECTION_REFUSED)
      if (
        err.message.includes('Failed to fetch') ||
        err.message.includes('NetworkError') ||
        err.message.includes('ERR_CONNECTION_REFUSED')
      ) {
        setErrors({
          form: 'Unable to connect to the backend server (Port 5000 is offline). Please start the backend server in your terminal with "npm run dev" inside the backend folder.',
        })
      } else {
        setErrors({ form: err.message || 'Could not save changes. Please try again.' })
      }
    }
  }

  return (
    <>
      {showTrigger && (
        <button
          onClick={open}
          aria-label="Open profile"
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm transition hover:brightness-110 cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${GOLD}, #E4C55A)` }}
        >
          {initialsOf(user?.name)}
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={close}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070b19]/60 px-4 backdrop-blur-xl"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-modal-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="relative w-full max-w-[460px] max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-[#FAFAF7]/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            >
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-500 transition hover:bg-black/5 hover:text-slate-900 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="px-8 pb-8 pt-9 sm:px-10">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, #E4C55A)` }}
                  >
                    {initialsOf(user?.name)}
                  </span>
                  <div className="min-w-0">
                    <span
                      className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide"
                      style={{ color: GOLD }}
                    >
                      <span style={{ width: 18, height: 2, background: GOLD, display: 'inline-block' }} />
                      My Account
                    </span>
                    <h2 id="profile-modal-title" className="truncate text-xl font-bold text-[#161616]">
                      {user?.name || 'User Profile'}
                    </h2>
                  </div>
                </div>

                {/* Success state */}
                {status === 'success' ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <span
                      className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                      style={{ background: `${GOLD}22` }}
                    >
                      <Check size={26} style={{ color: GOLD }} />
                    </span>
                    <p className="text-[16px] font-bold text-[#161616]">
                      {changingPassword ? 'Password & profile updated!' : 'Profile updated successfully.'}
                    </p>
                    {changingPassword && (
                      <p className="mt-1 text-xs text-slate-500">
                        A security alert has been delivered to your email.
                      </p>
                    )}
                  </div>
                ) : !editing ? (
                  // ---- View mode ----
                  <div className="mt-7 flex flex-col gap-3">
                    <ReadRow icon={User} label="Full Name" value={user?.name} />
                    <ReadRow icon={Mail} label="Email Address" value={user?.email} />

                    <button
                      onClick={startEdit}
                      className="mt-2 flex items-center justify-center gap-2 rounded-full border border-black/10 py-2.5 text-sm font-semibold text-[#161616] transition hover:bg-black/5 cursor-pointer"
                    >
                      <Pencil size={15} />
                      Edit Profile & Password
                    </button>

                    {onLogout && (
                      <button
                        onClick={() => {
                          close()
                          onLogout()
                        }}
                        className="mt-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    )}
                  </div>
                ) : (
                  // ---- Edit mode ----
                  <form onSubmit={handleSave} className="mt-6 flex flex-col gap-3.5" noValidate>
                    <Field
                      ref={firstFieldRef}
                      icon={User}
                      label="Full Name"
                      name="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      error={errors.name}
                    />

                    <Field
                      icon={Mail}
                      label="Email Address"
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={handleChange}
                      error={errors.email}
                    />

                    <div className="pt-2 border-t border-black/10">
                      {!changingPassword ? (
                        <button
                          type="button"
                          onClick={() => setChangingPassword(true)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#161616] cursor-pointer"
                        >
                          <Lock size={13} />
                          <span>Click here to Change Password</span>
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.25, ease: EASE }}
                          style={{ overflow: 'hidden' }}
                          className="flex flex-col gap-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Change Password
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setChangingPassword(false)
                                setForm((f) => ({
                                  ...f,
                                  currentPassword: '',
                                  newPassword: '',
                                  confirmPassword: '',
                                }))
                              }}
                              className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                            >
                              Keep existing password
                            </button>
                          </div>

                          <PasswordField
                            label="Current (Old) Password"
                            name="currentPassword"
                            placeholder="Enter your current password"
                            value={form.currentPassword}
                            onChange={handleChange}
                            error={errors.currentPassword}
                            show={showCurrentPw}
                            onToggleShow={() => setShowCurrentPw((s) => !s)}
                          />

                          <PasswordField
                            label="New Password"
                            name="newPassword"
                            placeholder="Minimum 8 characters"
                            value={form.newPassword}
                            onChange={handleChange}
                            error={errors.newPassword}
                            show={showNewPw}
                            onToggleShow={() => setShowNewPw((s) => !s)}
                          />

                          <PasswordField
                            label="Confirm New Password"
                            name="confirmPassword"
                            placeholder="Re-enter your new password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            show={showConfirmPw}
                            onToggleShow={() => setShowConfirmPw((s) => !s)}
                          />
                        </motion.div>
                      )}
                    </div>

                    {errors.form && (
                      <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                        <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                        <span>{errors.form}</span>
                      </div>
                    )}

                    <div className="mt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 rounded-full border border-black/10 py-2.5 text-sm font-semibold text-[#161616] transition hover:bg-black/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-70 cursor-pointer"
                        style={{ background: `linear-gradient(135deg, ${GOLD}, #E4C55A)` }}
                      >
                        {status === 'loading' ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
