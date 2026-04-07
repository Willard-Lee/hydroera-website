'use client'

import React, { useState, useEffect } from 'react'

export const LoadingScreen: React.FC = () => {
  const [contentVisible, setContentVisible] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Logo + text fade in
    const showContent = setTimeout(() => setContentVisible(true), 100)
    // Whole screen fades out
    const startFadeOut = setTimeout(() => setFadeOut(true), 2000)
    // Remove from DOM
    const remove = setTimeout(() => setDone(true), 2700)

    return () => {
      clearTimeout(showContent)
      clearTimeout(startFadeOut)
      clearTimeout(remove)
    }
  }, [])

  if (done) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #0b1120 0%, #0f1d3a 40%, #1a3a6b 100%)',
      }}
    >
      {/* Logo */}
      <img
        src="/hydroera-logo.png"
        alt="HydroEra"
        width={320}
        height={141}
        className={`w-[220px] md:w-[320px] h-auto brightness-0 invert transition-all duration-800 ease-out ${
          contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />

      {/* Slogan */}
      <p
        className={`mt-10 text-xs md:text-sm uppercase tracking-[0.35em] text-white/50 font-medium transition-all duration-800 ease-out delay-300 ${
          contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        LEADING PUMP SOLUTIONS IN MALAYSIA
      </p>
    </div>
  )
}
