/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1c2027',
        inksoft: '#5b6472',
        inkfaint: '#8b93a1',
        paper: '#fbf9f5',
        paper2: '#f3efe6',
        accent: '#b4763a',
        accentdeep: '#8a5a26',
        accenttint: '#f1e2ce',
        rule: '#ded6c6',
        line: '#e4ded1',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,32,39,0.04), 0 8px 24px -12px rgba(28,32,39,0.12)',
      },
      borderRadius: {
        sm2: '3px',
      },
    },
  },
  plugins: [],
};
