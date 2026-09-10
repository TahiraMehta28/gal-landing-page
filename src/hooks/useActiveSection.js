import { useEffect, useState } from 'react'

/**
 * Tracks which section id is currently in view, for nav highlighting.
 * Pass the same ids used as section `id` attributes.
 */
export default function useActiveSection(ids = [], threshold = 0.4) {
  const [activeId, setActiveId] = useState(ids[0] ?? null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { threshold }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, threshold])

  return activeId
}
