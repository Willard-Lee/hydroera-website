'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'

const STORAGE_KEY = 'payload-recent-emails'
const MAX_EMAILS = 5

function getRecentEmails(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveEmail(email: string) {
  const emails = getRecentEmails().filter((e) => e !== email)
  emails.unshift(email)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(emails.slice(0, MAX_EMAILS)))
}

const BeforeLogin: React.FC = () => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const handleInput = useCallback((e: Event) => {
    const input = e.target as HTMLInputElement
    const val = input.value.toLowerCase()
    const emails = getRecentEmails()

    if (val.length === 0) {
      setSuggestions(emails)
      setShowSuggestions(emails.length > 0)
    } else {
      const filtered = emails.filter((email) => email.toLowerCase().includes(val))
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    }
  }, [])

  const handleFocus = useCallback(() => {
    const emails = getRecentEmails()
    const input = document.querySelector<HTMLInputElement>('input[name="email"]')
    const val = input?.value?.toLowerCase() || ''

    if (val.length === 0) {
      setSuggestions(emails)
      setShowSuggestions(emails.length > 0)
    } else {
      const filtered = emails.filter((email) => email.toLowerCase().includes(val))
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    }
  }, [])

  useEffect(() => {
    // Wait for Payload's login form to render
    const timer = setTimeout(() => {
      const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]')
      if (!emailInput) return

      // Position the suggestions dropdown relative to the input
      const parent = emailInput.parentElement
      if (parent) {
        parent.style.position = 'relative'
      }

      emailInput.setAttribute('autocomplete', 'off')
      emailInput.addEventListener('input', handleInput)
      emailInput.addEventListener('focus', handleFocus)

      // Save email on form submit
      const form = emailInput.closest('form')
      if (form) {
        const handleSubmit = () => {
          if (emailInput.value) saveEmail(emailInput.value)
          setShowSuggestions(false)
        }
        form.addEventListener('submit', handleSubmit)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [handleInput, handleFocus])

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectEmail = (email: string) => {
    const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]')
    if (emailInput) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      nativeInputValueSetter?.call(emailInput, email)
      emailInput.dispatchEvent(new Event('input', { bubbles: true }))
      emailInput.focus()
    }
    setShowSuggestions(false)
  }

  // Portal the suggestions into the email input's parent
  useEffect(() => {
    if (!showSuggestions || suggestions.length === 0) return

    const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]')
    const parent = emailInput?.parentElement
    if (!parent || !suggestionsRef.current) return

    // Append dropdown into the input's parent so it appears right below
    if (suggestionsRef.current.parentElement !== parent) {
      parent.appendChild(suggestionsRef.current)
    }
  }, [showSuggestions, suggestions])

  return (
    <>
      <div>
        <p>
          <b>Welcome to your dashboard!</b>
          {' This is where site admins will log in to manage your website.'}
        </p>
      </div>

      <div
        ref={suggestionsRef}
        style={{
          display: showSuggestions && suggestions.length > 0 ? 'block' : 'none',
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '2px',
          background: 'var(--theme-elevation-0, #fff)',
          border: '1px solid var(--theme-elevation-200, #ddd)',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        {suggestions.map((email) => (
          <button
            key={email}
            type="button"
            onClick={() => selectEmail(email)}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 12px',
              fontSize: '13px',
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--theme-elevation-100, #f0f0f0)',
              cursor: 'pointer',
              color: 'var(--theme-elevation-800, #333)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--theme-elevation-100, #f5f5f5)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {email}
          </button>
        ))}
      </div>
    </>
  )
}

export default BeforeLogin
