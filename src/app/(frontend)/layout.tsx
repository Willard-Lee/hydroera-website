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
        {/* Loading screen — injected via script to avoid hydration mismatch. Only shows on first visit per session. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if(sessionStorage.getItem('he_loaded'))return;
                sessionStorage.setItem('he_loaded','1');
                var s=document.createElement('div');
                s.id='loading-screen';
                s.style.cssText='position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#0b1120 0%,#0f1d3a 40%,#1a3a6b 100%);transition:opacity 0.7s ease;opacity:1;';
                var img=document.createElement('img');
                img.src='/hydroera-logo.png';
                img.alt='';
                img.width=320;img.height=141;
                img.style.cssText='width:clamp(180px,25vw,320px);height:auto;opacity:0;transform:scale(0.95);transition:opacity 0.8s ease,transform 0.8s ease;';
                var p=document.createElement('p');
                p.textContent='LEADING PUMP SOLUTIONS IN MALAYSIA';
                p.style.cssText='margin-top:2.5rem;font-size:clamp(10px,1.2vw,14px);text-transform:uppercase;letter-spacing:0.35em;color:rgba(255,255,255,0.5);font-weight:500;opacity:0;transform:translateY(8px);transition:opacity 0.8s ease 0.3s,transform 0.8s ease 0.3s;';
                s.appendChild(img);s.appendChild(p);
                document.body.prepend(s);
                requestAnimationFrame(function(){requestAnimationFrame(function(){
                  img.style.opacity='1';img.style.transform='scale(1)';
                  p.style.opacity='1';p.style.transform='translateY(0)';
                });});
                setTimeout(function(){s.style.opacity='0';},3500);
                setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s);},4200);
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
