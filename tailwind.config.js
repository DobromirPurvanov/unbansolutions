/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-blue-100', 'bg-violet-100', 'bg-cyan-100',
    'text-blue-600', 'text-violet-600', 'text-cyan-600',
    'from-blue-600', 'to-violet-600',
  ],
  theme: {
    extend: {
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
