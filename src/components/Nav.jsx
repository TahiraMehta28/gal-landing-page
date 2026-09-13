import useActiveSection from '../hooks/useActiveSection'

const LINKS = [
  { id: 'hero', label: 'GAL' },
  { id: 'pathways', label: 'Pathways', hideOn: 'sm' },
  { id: 'triple-helix', label: 'Ecosystem', hideOn: 'md' },
  { id: 'faq', label: 'FAQ', hideOn: 'sm' },
  { id: 'imt', label: 'IMT', hideOn: 'md' },
]

function initialsOf(name) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export default function Nav({ user, onOpenAuth, onOpenProfile }) {
  const activeId = useActiveSection(LINKS.map((l) => l.id))

  return (
    <nav
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 8px',
        borderRadius: '999px',
        backgroundColor: 'rgba(25, 20, 15, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        whiteSpace: 'nowrap',
      }}
    >
      {LINKS.map((link) => {
        const isActive = activeId === link.id
        const hide =
          link.hideOn === 'sm'
            ? 'hidden sm:inline-block'
            : link.hideOn === 'md'
            ? 'hidden md:inline-block'
            : ''

        return (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={hide}
            style={{
              padding: '5px 12px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
              backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            {link.label}
          </a>
        )
      })}

      <a
        href="#discovery-form"
        style={{
          marginLeft: '2px',
          padding: '5px 14px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#ffffff',
          backgroundColor: '#C9A227',
          textDecoration: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          display: 'inline-block',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B8880C')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C9A227')}
      >
        Tell GAL
      </a>

      {/* Divider */}
      <div
        style={{
          width: '1px',
          height: '18px',
          backgroundColor: 'rgba(255,255,255,0.18)',
          margin: '0 4px',
        }}
      />

      {/* Profile & Auth Section */}
      <div>
        {user ? (
          // Logged In: Clicking this directly opens the ProfileModal popup to view & edit details!
          <button
            onClick={onOpenProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '3px 12px 3px 4px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(201,162,39,0.24), rgba(255,255,255,0.08))',
              border: '1px solid rgba(201,162,39,0.45)',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            title="Click to view & edit your profile"
          >
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C9A227, #E4C55A)',
                color: '#161616',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            >
              {initialsOf(user.name)}
            </span>
            <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name?.split(' ')[0] || 'Profile'}
            </span>
          </button>
        ) : (
          // Not Logged In: Sign In button to open Auth Modal
          <button
            onClick={onOpenAuth}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.16)'
              e.currentTarget.style.borderColor = 'rgba(201,162,39,0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
            }}
          >
            <span>👤</span>
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  )
}
