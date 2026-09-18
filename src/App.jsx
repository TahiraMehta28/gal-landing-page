import { useState, useEffect, useRef } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Pathways from './components/Pathways'
import Ecosystem from './components/Ecosystem'
import IMT from './components/IMT'
import DiscoveryForm from './components/DiscoveryForm/DiscoveryForm'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import ProfileModal from './components/ProfileModal'
import { AUTH_API_URL as API_URL } from './config/api'

export default function App() {
  const formRef = useRef(null)

  // Load existing logged in user from localStorage if present
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gal_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Auth modal states
  const [isAuthOpen, setIsAuthOpen] = useState(() => {
    return !localStorage.getItem('gal_user')
  })
  const [authMode, setAuthMode] = useState('signin')
  const [authResetToken, setAuthResetToken] = useState(null)

  // Profile modal state
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Check URL parameters on mount for Email Verification or Password Reset links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const verifyEmailToken = params.get('verifyEmailToken')
    const resetPasswordToken = params.get('resetPasswordToken')

    // Case 1: User clicked "Confirm Email" link from their inbox
    if (verifyEmailToken) {
      const verifyUserEmail = async () => {
        try {
          const res = await fetch(`${API_URL}/verify-email/${verifyEmailToken}`)
          const data = await res.json()

          if (res.ok && data.success) {
            if (data.data?.token) {
              localStorage.setItem('gal_token', data.data.token)
              localStorage.setItem('gal_user', JSON.stringify(data.data))
            }
            setUser(data.data)
            setAuthMode('verification_success')
            setIsAuthOpen(true)
          } else {
            alert(data.message || 'Email verification link is invalid or expired.')
          }
        } catch (err) {
          console.error('Verification error:', err)
        } finally {
          // Clean URL parameters cleanly
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }
      verifyUserEmail()
    }

    // Case 2: User clicked "Reset Password" link from their inbox
    if (resetPasswordToken) {
      setAuthResetToken(resetPasswordToken)
      setAuthMode('reset_password')
      setIsAuthOpen(true)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('gal_user')
    localStorage.removeItem('gal_token')
    setUser(null)
    setIsProfileOpen(false)
    setAuthMode('signin')
    setIsAuthOpen(true) // Re-open auth modal when user logs out
  }

  const handleSelectPathway = () => formRef.current?.goToStep(1)
  const handleImtInterest = () => formRef.current?.goToStep(1)

  return (
    <>
      {/* Frontpage Navigation Bar with User Profile button & Sign In */}
      <Nav
        user={user}
        onOpenAuth={() => {
          setAuthMode('signin')
          setIsAuthOpen(true)
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <Hero />
      <Pathways onSelectPathway={handleSelectPathway} />
      <Ecosystem />
      <FAQ />
      <DiscoveryForm ref={formRef} user={user} />
      {/* <IMT onInterested={handleImtInterest} /> */}{/* IMT section temporarily hidden */}
      <Footer />

      {/* Authentication Modal (Sign In, Sign Up, Confirm Email, Forgot & Reset Password) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        resetToken={authResetToken}
        onAuthSuccess={(userData) => {
          setUser(userData)
        }}
      />

      {/* User Profile View & Edit Modal */}
      {user && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          onUpdate={(updated) => {
            setUser(updated)
          }}
          onLogout={handleLogout}
        />
      )}
    </>
  )
}
