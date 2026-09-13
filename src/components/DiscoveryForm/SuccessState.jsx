import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Compass,
  Heart,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Target,
  User,
  UserCircle2,
} from 'lucide-react'

/**
 * SuccessState
 * ---------------------------------------------------------------------
 * Right-hand summary panel. Ties into the left-panel stepper visually:
 * each answer gets a small icon badge connected to the next by a
 * dashed amber line, so the summary reads as "the same steps, now
 * filled in" rather than a flat stack of boxes.
 * ---------------------------------------------------------------------
 */

const EASE = [0.22, 1, 0.36, 1]
const AMBER = '#f59e0b'

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.15 + i * 0.07, ease: EASE },
  }),
}

function TimelineItem({ index, icon: Icon, label, isLast, children }) {
  return (
    <motion.li
      variants={sectionVariants}
      initial="hidden"
      animate="show"
      custom={index}
      className={`relative pl-11 ${isLast ? '' : 'pb-6'}`}
    >
      <span
        className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border-2"
        style={{ borderColor: AMBER, background: `${AMBER}1F` }}
      >
        <Icon size={13} style={{ color: AMBER }} strokeWidth={2.4} />
      </span>
      {!isLast && (
        <span
          className="absolute left-[13px] top-7 bottom-0 w-0 border-l border-dashed"
          style={{ borderColor: `${AMBER}4D` }}
        />
      )}
      <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-500">{label}</div>
      {children}
    </motion.li>
  )
}

function Quote({ children }) {
  return children ? (
    <p className="text-[14.5px] italic leading-relaxed text-neutral-200">
      <span className="mr-0.5 text-amber-500/60">&ldquo;</span>
      {children}
      <span className="ml-0.5 text-amber-500/60">&rdquo;</span>
    </p>
  ) : (
    <p className="text-sm italic text-neutral-500">Not specified</p>
  )
}

function ContactCell({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-black/25 px-3 py-2.5 transition hover:border-white/10">
      <Icon size={14} className="mt-0.5 shrink-0 text-neutral-500" />
      <div className="min-w-0">
        <span className="block text-[11px] text-neutral-500">{label}</span>
        <span className="block truncate text-[13px] font-semibold text-white">{value || '—'}</span>
      </div>
    </div>
  )
}

export default function SuccessState({ answers, onEdit, isUpdating = false }) {
  const contact = answers?.[5] || {}
  const obstacles = Array.isArray(answers?.[3]) ? answers[3] : []
  const loopPreferences = Array.isArray(answers?.[6]) ? answers[6] : []
  const hasProgrammes = loopPreferences.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      style={{ padding: '8px 0' }}
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="relative mx-auto mb-3.5 flex h-14 w-14 items-center justify-center">
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{ background: `${AMBER}26` }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            className="relative flex h-14 w-14 items-center justify-center rounded-full border-2"
            style={{ borderColor: AMBER, background: `${AMBER}1F` }}
          >
            <CheckCircle2 size={26} style={{ color: AMBER }} strokeWidth={2.2} />
          </span>
        </div>

        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          Saved &bull; Confirmed Response
        </span>

        <h3 className="font-display mb-2 text-2xl font-extrabold text-white">You&rsquo;re a GAL Builder</h3>
        <p className="mx-auto max-w-[360px] text-sm leading-relaxed text-neutral-400">
          We&rsquo;ve recorded your submission. You can review your entered details below or modify them anytime.
        </p>
      </div>

      {/* Summary timeline */}
      <div className="relative mb-6">
        <ul
          className="max-h-[420px] list-none overflow-y-auto rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 pb-9 backdrop-blur-sm"
          style={{ scrollbarWidth: 'thin', scrollbarColor: `${AMBER}55 transparent` }}
        >
          <TimelineItem index={0} icon={Heart} label="What matters to you">
            <Quote>{answers?.[1]}</Quote>
          </TimelineItem>

          <TimelineItem index={1} icon={Compass} label="Current Stage">
            {answers?.[2] ? (
              <span className="inline-flex items-center rounded-md border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[13px] font-medium text-amber-400">
                {answers[2]}
              </span>
            ) : (
              <span className="text-sm italic text-neutral-500">Not specified</span>
            )}
          </TimelineItem>

          <TimelineItem index={2} icon={AlertTriangle} label="What&rsquo;s in your way">
            {obstacles.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {obstacles.map((obs, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs text-neutral-300 transition hover:bg-white/[0.1]"
                  >
                    {obs}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[13px] italic text-neutral-500">None selected</span>
            )}
          </TimelineItem>

          <TimelineItem index={3} icon={Target} label="One thing to unlock in 12 months">
            <Quote>{answers?.[4]}</Quote>
          </TimelineItem>

          <TimelineItem
            index={4}
            icon={UserCircle2}
            label="Profile &amp; Contact"
            isLast={!hasProgrammes}
          >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2">
              <ContactCell icon={User} label="Persona" value={contact.persona} />
              <ContactCell icon={User} label="Name" value={contact.name} />
              <ContactCell icon={Mail} label="Email" value={contact.email} />
              <ContactCell
                icon={Building2}
                label="Org / Role"
                value={contact.org ? `${contact.org}${contact.role ? ` (${contact.role})` : ''}` : ''}
              />
              {contact.location && <ContactCell icon={MapPin} label="Location" value={contact.location} />}
              {contact.mobile && <ContactCell icon={Phone} label="Mobile" value={contact.mobile} />}
            </div>
          </TimelineItem>

          {hasProgrammes && (
            <TimelineItem index={5} icon={Layers} label="Involved Programmes" isLast>
              <div className="flex flex-wrap gap-1.5">
                {loopPreferences.map((p, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-amber-500/20 bg-amber-500/[0.07] px-2.5 py-1 text-xs text-neutral-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </TimelineItem>
          )}
        </ul>

        {/* fade hint that there's more to scroll */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-9 rounded-b-2xl"
          style={{ background: 'linear-gradient(to top, rgba(23,23,23,0.9), transparent)' }}
        />
      </div>

      {/* Action */}
      <div className="flex justify-center">
        <motion.button
          type="button"
          onClick={onEdit}
          disabled={isUpdating}
          whileHover={{ scale: isUpdating ? 1 : 1.02 }}
          whileTap={{ scale: isUpdating ? 1 : 0.98 }}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-neutral-900 shadow-lg transition disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: `linear-gradient(135deg, ${AMBER}, #fbbf24)` }}
        >
          {isUpdating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Updating&hellip;
            </>
          ) : (
            <>
              <Pencil size={14} />
              Edit / Update Response
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}