'use client'

import React from 'react'

const AdminLogout: React.FC = () => {
  const handleLogout = () => {
    // Payload's built-in logout endpoint
    fetch('/api/users/logout', { method: 'POST', credentials: 'include' }).then(() => {
      window.location.href = '/admin'
    })
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        padding: '10px 16px',
        marginTop: '8px',
        border: 'none',
        borderRadius: '6px',
        background: 'var(--theme-error-500, #ef4444)',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Logout
    </button>
  )
}

export default AdminLogout
