import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        loop: {
          ink: '#17201c',
          mint: '#c9eadf',
          leaf: '#2f8f73',
          coral: '#e96b5f',
          sun: '#f5be4f',
          cloud: '#f7f8f5',
        },
      },
      boxShadow: {
        soft: '0 14px 34px rgba(23, 32, 28, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
