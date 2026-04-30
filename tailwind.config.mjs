/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 30s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: '700',
                marginBottom: '0.25em',
                fontFamily: 'var(--font-heading), sans-serif',
              },
              h2: {
                fontFamily: 'var(--font-heading), sans-serif',
              },
              h3: {
                fontFamily: 'var(--font-heading), sans-serif',
              },
              h4: {
                fontFamily: 'var(--font-heading), sans-serif',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
