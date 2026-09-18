import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { imtPrograms } from '../data/imt'

const EASE_SMOOTH = [0.22, 1, 0.36, 1]

function RibbonRow({ program, index, onOpen }) {
  return (
    <motion.div
      layoutId={`ribbon-${program.id}`}
      onClick={() => onOpen(program.id)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${program.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(program.id)
        }
      }}
      initial={{ opacity: 0, x: -100, scale: 0.96 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -4, scale: 1.01, x: 5 }}
      whileTap={{ scale: 0.99 }}
      transition={{
        duration: 0.6,
        delay: index * 0.16,
        ease: EASE_SMOOTH,
        layout: { duration: 0.45, ease: EASE_SMOOTH },
      }}
      className="group relative cursor-pointer select-none w-full"
      style={{
        filter: 'drop-shadow(0 6px 18px rgba(15,23,42,0.07))',
      }}
    >
      {/* Outer chevron border wrapper */}
      <div
        className="w-full transition-all duration-300 rounded-lg"
        style={{
          clipPath: 'polygon(0% 0%, calc(100% - 24px) 0%, 100% 50%, calc(100% - 24px) 100%, 0% 100%)',
          background: `linear-gradient(90deg, ${program.fill} 0%, ${program.accent} 60%, ${program.fill} 100%)`,
          padding: '2px',
        }}
      >
        {/* Inner chevron body */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 bg-white/95 backdrop-blur-sm transition-colors duration-200 group-hover:bg-[#FCFAF5]"
          style={{
            clipPath: 'polygon(0% 0%, calc(100% - 23px) 0%, 100% 50%, calc(100% - 23px) 100%, 0% 100%)',
            padding: '20px 42px 20px 24px',
          }}
        >
          {/* Left: Number & Acronym badge */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg text-white shadow-md tracking-tight transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: program.fill }}
            >
              {program.number}
            </div>
            <span
              className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs"
              style={{ backgroundColor: `${program.accent}22`, color: program.fill }}
            >
              {program.short}
            </span>
          </div>

          {/* Center: Title & Description */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-[19px] font-bold text-slate-900 mb-1 tracking-tight group-hover:text-amber-950 transition-colors">
              {program.title}
            </h3>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              {program.description}
            </p>
          </div>

          {/* Right: Prompt arrow */}
          <div
            className="flex items-center gap-1.5 shrink-0 font-bold text-xs tracking-wider uppercase transition-colors"
            style={{ color: program.fill }}
          >
            <span>Learn More</span>
            <span className="text-base font-bold transition-transform duration-200 group-hover:translate-x-2">→</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ExpandedCard({ program, onClose, onInterested }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-white p-7 sm:p-9 shadow-2xl border border-slate-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ backgroundColor: program.fill }}
      />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-10 h-10 rounded-lg font-bold text-white text-base shadow-sm"
            style={{ backgroundColor: program.fill }}
          >
            {program.number}
          </span>
          <span
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
            style={{ backgroundColor: `${program.accent}22`, color: program.fill }}
          >
            {program.short} Track
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
        >
          ✕
        </button>
      </div>

      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
        {program.title}
      </h3>

      <p className="text-base text-slate-700 leading-relaxed mb-6 font-medium">
        {program.description}
      </p>

      <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          Tailored cohort programs for incubator managers, university leaders, and innovation hubs.
        </p>
        <button
          type="button"
          onClick={() => {
            onClose()
            onInterested?.()
          }}
          className="shrink-0 px-6 py-3 rounded-xl font-bold text-sm text-white transition-transform duration-200 hover:scale-[1.02] shadow-md"
          style={{ backgroundColor: program.fill }}
        >
          Inquire About Track →
        </button>
      </div>
    </div>
  )
}

export default function IMT({ onInterested }) {
  const [activeId, setActiveId] = useState(null)

  const activeProgram = imtPrograms.find((p) => p.id === activeId) || null

  const handleOpen = (id) => setActiveId(id)
  const handleClose = () => setActiveId(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section id="imt" className="relative w-full py-20 sm:py-24" style={{ backgroundColor: '#FDFBF5' }}>
      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8">
        
        {/* Centralized Heading — temporarily hidden */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase text-slate-600 mb-3.5 shadow-sm">
            For Incubation Professionals
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Programs Built Around Your Ecosystem
          </h2>
          <p className="text-[16px] sm:text-[17px] font-medium text-slate-600 leading-relaxed">
            Three tracks for the people who run incubators, teach founders, and stage the
            moment startups meet capital.
          </p>
        </motion.div> */}

        {/* Centralized Ribbon list — Swiping in one by one */}
        <div className="flex w-full flex-col gap-5 sm:gap-6 items-center">
          {imtPrograms.map((program, i) => (
            <RibbonRow key={program.id} program={program} index={i} onOpen={handleOpen} />
          ))}
        </div>
      </div>

      {/* Modal Overlay — Smooth standard zoom and morph back */}
      <AnimatePresence>
        {activeProgram && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_SMOOTH }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 sm:p-6 backdrop-blur-sm"
          >
            <motion.div
              layoutId={`ribbon-${activeProgram.id}`}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{
                layout: { duration: 0.42, ease: EASE_SMOOTH },
                duration: 0.35,
                ease: EASE_SMOOTH,
              }}
              className="w-full max-w-2xl"
            >
              <ExpandedCard
                program={activeProgram}
                onClose={handleClose}
                onInterested={onInterested}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}