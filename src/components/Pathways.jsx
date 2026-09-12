import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const PATHWAYS = [
  {
    id: 'founder',
    title: "I'm building a startup",
    subtitle: 'Move faster with the right support.',
    items: [
      { heading: 'Clarity first', desc: 'Define your vision and target market.' },
      { heading: 'Validate fast', desc: 'Test the problem before you build.' },
      { heading: 'Find your team', desc: 'Meet co-founders and early hires.' },
      { heading: 'Go to market', desc: 'Reach first customers and raise capital.' },
    ],
    cta: "Tell GAL what's stopping me",
  },
  {
    id: 'incubation',
    title: 'I help founders build',
    subtitle: 'Run your incubator, only better.',
    items: [
      { heading: 'Build capability', desc: 'Train your team through IMT.' },
      { heading: 'Structure & tools', desc: 'Install SOPs, governance, and screening.' },
      { heading: 'Open networks', desc: 'Access mentors and corporate partners.' },
      { heading: 'Scale globally', desc: 'Unlock funding and international reach.' },
    ],
    cta: 'Tell GAL what my incubator needs',
  },
  {
    id: 'academia',
    title: "I'm turning knowledge into impact",
    subtitle: 'Give your research a life beyond the lab.',
    items: [
      { heading: 'Protect the IP', desc: 'File patents and translate the tech.' },
      { heading: 'Validate & license', desc: 'Test prototypes and commercialise.' },
      { heading: 'Partner with industry', desc: 'Connect research to real applications.' },
      { heading: 'Spin off', desc: 'Turn the work into a startup, globally.' },
    ],
    cta: 'Tell GAL what would move my idea forward',
  },
]

function PathwayCard({ pathway, delay, onSelect, selected, onClick }) {
  const [ref, visible] = useScrollReveal()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`slide-in ${visible ? 'is-visible' : ''} h-full`}
    >
      <div
        onClick={onClick}
        className={`group h-full flex flex-col justify-between cursor-pointer
                   bg-white/90 backdrop-blur-sm rounded-2xl p-5 border
                   transition-all duration-300 ease-out
                   hover:-translate-y-2 hover:shadow-2xl
                   ${selected
            ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40'
            : 'border-slate-200/80 hover:border-amber-500/30'}`}
      >
        {/* Upper content */}
        <div className="flex-1">

          {/* Headline */}
          <h3 className="text-[22px] font-bold tracking-tight text-slate-900 mb-1 leading-snug">
            {pathway.title}
          </h3>

          {/* Subtitle */}
          <p className="text-[14.5px] font-medium text-slate-600 mb-3 leading-snug">
            {pathway.subtitle}
          </p>

          {/* Structured feature rows */}
          <div className="border-t border-slate-100">
            {pathway.items.map((item) => (
              <div
                key={item.heading}
                className="border-t border-slate-100 first:border-t-0 py-2"
              >
                <p className="text-[14.5px] font-bold text-slate-900 mb-0.5">{item.heading}</p>
                <p className="text-[13px] font-medium text-slate-600 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Docked CTA — pure black */}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect?.(pathway.id) }}
          className="mt-4 min-h-[44px] w-full px-4 py-2.5 rounded-xl
                     bg-black text-white
                     text-[12.5px] font-bold uppercase tracking-wider
                     flex items-center justify-between
                     transition-colors duration-200
                     hover:bg-neutral-800"
        >
          <span>{pathway.cta}</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  )
}

export default function Pathways({ onSelectPathway }) {
  const [headingRef, headingVisible] = useScrollReveal()
  const [activeId, setActiveId] = useState(null)

  return (
    <section
      id="pathways"
      className="relative overflow-hidden py-24"
      style={{ backgroundColor: '#FDFBF5' }}
    >
      {/* Infinite drifting dot backdrop */}
      <div
        aria-hidden="true"
        className="absolute -inset-12 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(15,23,42,0.07) 1.3px, transparent 1.3px)',
          backgroundSize: '24px 24px',
          animation: 'dotDrift 30s linear infinite',
        }}
      />
      <style>{`
        @keyframes dotDrift {
          0%   { background-position: 0px 0px; }
          100% { background-position: -240px -240px; }
        }
      `}</style>

      <div className="max-w-[1100px] mx-auto px-10 relative z-10">

        {/* Heading */}
        <div
          ref={headingRef}
          className={`reveal ${headingVisible ? 'is-visible' : ''} max-w-[620px] mx-auto text-center mb-14`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-4">
            Builder Pathways
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Where does your{' '}
            <span className="inline-block -rotate-3 text-amber-600 font-serif italic">
              work
            </span>{' '}
            start?
          </h2>
          <p className="text-[15px] font-medium text-slate-600 leading-relaxed">
            Choose the path that matches where you are today — GAL meets you there.
          </p>
        </div>

        {/* Equal-height 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PATHWAYS.map((pathway, i) => (
            <PathwayCard
              key={pathway.id}
              pathway={pathway}
              delay={i * 110}
              selected={activeId === pathway.id}
              onClick={() => setActiveId(pathway.id)}
              onSelect={(id) => { setActiveId(id); onSelectPathway?.(id) }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}