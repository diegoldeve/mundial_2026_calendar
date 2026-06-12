import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{vue,ts,js}'],
  theme: {
    extend: {
      colors: {
        pitch: '#080d1a',
        surface: {
          DEFAULT: '#0f1829',
          raised: '#172035',
          hover: '#1e2d4a',
        },
        gold: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
        },
        border: {
          DEFAULT: '#1e2d47',
          light: '#2a3d5e',
        },
      },
    },
  },
} satisfies Config
