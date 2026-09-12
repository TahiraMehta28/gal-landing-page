import useActiveSection from '../hooks/useActiveSection'

const LINKS = [
  { id: 'hero', label: 'GAL' },
  { id: 'pathways', label: 'Pathways', hideOn: 'sm' },
  { id: 'triple-helix', label: 'Ecosystem', hideOn: 'md' },
  { id: 'faq', label: 'FAQ', hideOn: 'sm' },
  { id: 'imt', label: 'IMT', hideOn: 'md' },
]

export default function Nav() {
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
        gap: '2px',
        padding: '5px 6px',
        borderRadius: '999px',
        backgroundColor: 'rgba(30, 25, 18, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        whiteSpace: 'nowrap',
      }}
    >
      {LINKS.map((link) => {
        const isActive = activeId === link.id
        const hide = link.hideOn === 'sm' ? 'hidden sm:inline-block' : link.hideOn === 'md' ? 'hidden md:inline-block' : ''

        return (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={hide}
            style={{
              padding: '5px 13px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.60)',
              backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(255,255,255,0.16)' : '1px solid transparent',
              textDecoration: 'none',
              transition: 'color 0.15s, background 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)' } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.60)'; e.currentTarget.style.backgroundColor = 'transparent' } }}
          >
            {link.label}
          </a>
        )
      })}
      <a
        href="#discovery-form"
        style={{
          marginLeft: '4px',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#ffffff',
          backgroundColor: '#C9A227',
          textDecoration: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.15s, transform 0.1s',
          display: 'inline-block',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B8880C'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C9A227'}
      >
        Tell GAL
      </a>
    </nav>
  )
}

