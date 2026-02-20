/**
 * router.tsx
 * Lightweight in-app router using state. 
 * Ready to swap for React Router v6 — each "page" maps to a <Route> path.
 */
import { useEffect, useState } from 'react'
import type { CurrentTopic, PageId } from '../types'

export interface RouterState {
  activePage:     PageId
  currentSubject: string | null
  currentTopic:   CurrentTopic | null
  navigate:       (page: PageId, opts?: { subjectId?: string; topic?: CurrentTopic }) => void
  goBack:         () => void
}

// A simple stack-based history for back navigation
const BACK_MAP: Partial<Record<PageId, PageId>> = {
  subject: 'subjects',
  topic:   'subject',
}

const ROUTE_STORAGE_KEY = 'km_router_state'

interface PersistedRoute {
  activePage: PageId
  currentSubject: string | null
  currentTopic: CurrentTopic | null
}

const isPageId = (value: unknown): value is PageId => (
  value === 'dashboard' ||
  value === 'subjects' ||
  value === 'subject' ||
  value === 'topic' ||
  value === 'profile'
)

const readStoredRoute = (): PersistedRoute => {
  if (typeof window === 'undefined') {
    return { activePage: 'dashboard', currentSubject: null, currentTopic: null }
  }

  try {
    const raw = window.localStorage.getItem(ROUTE_STORAGE_KEY)
    if (!raw) return { activePage: 'dashboard', currentSubject: null, currentTopic: null }

    const parsed = JSON.parse(raw) as Partial<PersistedRoute>
    const activePage = isPageId(parsed.activePage) ? parsed.activePage : 'dashboard'

    const topic =
      parsed.currentTopic &&
      typeof parsed.currentTopic.subjectId === 'string' &&
      typeof parsed.currentTopic.topicId === 'string'
        ? parsed.currentTopic
        : null

    const subjectFromTopic = topic?.subjectId ?? null
    const currentSubject =
      typeof parsed.currentSubject === 'string'
        ? parsed.currentSubject
        : subjectFromTopic

    if (activePage === 'subject' && !currentSubject) {
      return { activePage: 'subjects', currentSubject: null, currentTopic: null }
    }

    if (activePage === 'topic' && !topic) {
      return { activePage: currentSubject ? 'subject' : 'subjects', currentSubject, currentTopic: null }
    }

    return {
      activePage,
      currentSubject,
      currentTopic: topic,
    }
  } catch {
    return { activePage: 'dashboard', currentSubject: null, currentTopic: null }
  }
}

export function useRouter(): RouterState {
  const initial = readStoredRoute()
  const [activePage,     setActivePage]     = useState<PageId>(initial.activePage)
  const [currentSubject, setCurrentSubject] = useState<string | null>(initial.currentSubject)
  const [currentTopic,   setCurrentTopic]   = useState<CurrentTopic | null>(initial.currentTopic)

  const navigate = (page: PageId, opts?: { subjectId?: string; topic?: CurrentTopic }) => {
    setActivePage(page)
    if (opts?.topic) {
      setCurrentTopic(opts.topic)
      setCurrentSubject(opts.topic.subjectId)
      return
    }

    if (opts?.subjectId) {
      setCurrentSubject(opts.subjectId)
      if (page !== 'topic') setCurrentTopic(null)
      return
    }

    if (page === 'dashboard' || page === 'subjects' || page === 'profile') {
      setCurrentTopic(null)
      setCurrentSubject(null)
    }
  }

  const goBack = () => {
    const prev = BACK_MAP[activePage]
    if (!prev) return

    if (prev === 'subject') {
      const subjectId = currentSubject ?? currentTopic?.subjectId ?? null
      if (subjectId) {
        setCurrentSubject(subjectId)
        setCurrentTopic(null)
        setActivePage('subject')
        return
      }
      setActivePage('subjects')
      return
    }

    if (prev === 'subjects') {
      setCurrentTopic(null)
      setActivePage('subjects')
      return
    }

    setActivePage(prev)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const payload: PersistedRoute = { activePage, currentSubject, currentTopic }
    window.localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(payload))
  }, [activePage, currentSubject, currentTopic])

  return { activePage, currentSubject, currentTopic, navigate, goBack }
}
