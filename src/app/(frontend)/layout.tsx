import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import React from 'react'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { BackToTop } from '@/components/BackToTop'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(plusJakartaSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        {/* Loading screen — rendered as raw HTML so it appears before JS hydration */}
        <div
          id="loading-screen"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0b1120 0%, #0f1d3a 40%, #1a3a6b 100%)',
            transition: 'opacity 0.7s ease',
            opacity: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hydroera-logo.png"
            alt=""
            width={320}
            height={141}
            style={{
              width: 'clamp(180px, 25vw, 320px)',
              height: 'auto',
                opacity: 0,
              transform: 'scale(0.95)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          />
          <p
            style={{
              marginTop: '2.5rem',
              fontSize: 'clamp(10px, 1.2vw, 14px)',
              textTransform: 'uppercase',
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 500,
              opacity: 0,
              transform: 'translateY(8px)',
              transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
            }}
          >
            LEADING PUMP SOLUTIONS IN MALAYSIA
          </p>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var s = document.getElementById('loading-screen');
                if (!s) return;
                var img = s.querySelector('img');
                var p = s.querySelector('p');
                // Fade in logo + text
                requestAnimationFrame(function(){
                  requestAnimationFrame(function(){
                    if(img){img.style.opacity='1';img.style.transform='scale(1)';}
                    if(p){p.style.opacity='1';p.style.transform='translateY(0)';}
                  });
                });
                // Fade out entire screen
                setTimeout(function(){s.style.opacity='0';},2000);
                // Remove from DOM
                setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},2700);
              })();
            `,
          }}
        />
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
