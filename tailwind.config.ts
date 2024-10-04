import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'mb': '425px'
      },
      fontSize: {
        'xxs': '0.625rem'
      },
      fontFamily: {
        sdisplay: ['var(--font-display)'],
        montserrat: ['var(--font-montserrat)'],
        egGaramond: ['var(--font-EBGaramond)'],
      },
      colors: {
        hsl: {
          l5: 'hsl(0 0% 5%)',
          l13: 'hsl(0 0% 13%)',
          l15: 'hsl(0 0% 15%)',
          l20: 'hsl(0 0% 20%)',
          l25: 'hsl(0 0% 25%)',
          l30: 'hsl(0 0% 30%)',
          l50: 'hsl(0 0% 50%)',
          l70: 'hsl(0 0% 70%)',
          l80: 'hsl(0 0% 80%)',
          l85: 'hsl(0 0% 85%)',
          l90: 'hsl(0 0% 90%)',
          l95: 'hsl(0 0% 95%)',
          l98: 'hsl(0 0% 98%)',
          l100: 'hsl(0 0% 100%)',
        },
        mb: {
          'pink': '#FF3EB5',
          'yellow': '#FFE900',
          'pink-active': '#EB29A1',
          'yellow-active': '#d0bf00',
        },
      }
    },
  },
  plugins: [],
};
export default config;
