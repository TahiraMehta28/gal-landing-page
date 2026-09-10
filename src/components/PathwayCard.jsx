import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

export default function PathwayCard({ pathway, delay = 0, onSelect, selected, onClick }) {
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
                   bg-white/90 backdrop-blur-sm rounded-2xl p-6 border
                   transition-all duration-300 ease-out
                   hover:-translate-y-2 hover:shadow-2xl
                   ${selected
            ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40'
            : 'border-slate-200/80 hover:border-amber-500/30'}`}
      >
        <div className="flex-1">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-1">
            {pathway.title}
          </h3>

          <p className="text-sm font-medium text-slate-600 mb-4 leading-snug">
            {pathway.prompt}
          </p>

          <div className="border-t border-slate-100">
            {pathway.items.map((item) => (
              <div key={item.heading} className="border-t border-slate-100 first:border-t-0 py-2.5">
                <p className="text-[13px] font-bold text-slate-900 mb-0.5">{item.heading}</p>
                <p className="text-xs font-medium text-slate-600 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onSelect?.(pathway.id) }}
          className="mt-6 min-h-[48px] w-full px-4 py-3 rounded-xl
                     bg-black text-white
                     text-xs font-bold uppercase tracking-wider
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