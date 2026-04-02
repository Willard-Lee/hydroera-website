import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'

const socialIcons: Record<string, React.FC<{ className?: string }>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  youtube: YoutubeIcon,
  whatsapp: MessageCircle,
}

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as FooterType

  const columns = footerData?.columns || []
  const contact = footerData?.contact
  const socialLinks = footerData?.socialLinks || []
  const legalLinks = footerData?.legalLinks || []
  const copyrightText = footerData?.copyrightText
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-hydroera-slate-dark text-white">
      {/* Main Footer Grid */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-4">
              {footerData?.logo && typeof footerData.logo === 'object' ? (
                <Media
                  resource={footerData.logo}
                  imgClassName="h-10 w-auto"
                  className="h-10"
                />
              ) : (
                <Logo variant="dark" loading="lazy" />
              )}
            </Link>
            {footerData?.description && (
              <p className="text-sm text-hydroera-slate-light leading-relaxed max-w-xs">
                {footerData.description}
              </p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-6">
                {socialLinks.map((social, i) => {
                  const Icon = socialIcons[social.platform]
                  if (!Icon) return null
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-md bg-white/10 text-hydroera-slate-light hover:bg-white/20 hover:text-white transition-colors"
                      aria-label={social.platform}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Dynamic Columns */}
          {columns.map((column, i) => (
            <div key={i} className="lg:col-span-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.links?.map(({ link }, j) => (
                  <li key={j}>
                    <CMSLink
                      {...link}
                      appearance="inline"
                      className="text-sm text-hydroera-slate-light hover:text-white transition-colors"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          {contact && (contact.phone || contact.email || contact.address) && (
            <div className="lg:col-span-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Contact
              </h4>
              <ul className="space-y-3">
                {contact.address && (
                  <li className="flex gap-3 text-sm text-hydroera-slate-light">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="whitespace-pre-line">{contact.address}</span>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-3 text-sm text-hydroera-slate-light hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 text-sm text-hydroera-slate-light hover:text-white transition-colors"
                    >
                      <Mail className="w-4 h-4 shrink-0" />
                      {contact.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-hydroera-slate-light">
            <p>&copy; {currentYear} {copyrightText || 'HydroEra Sdn Bhd. All rights reserved.'}</p>
            {legalLinks.length > 0 && (
              <nav className="flex gap-4">
                {legalLinks.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance="inline"
                    className="text-xs text-hydroera-slate-light hover:text-white transition-colors"
                  />
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
