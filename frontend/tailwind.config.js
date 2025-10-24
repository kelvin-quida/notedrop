/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        'bg-input': 'var(--color-bg-input)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-muted': 'var(--color-text-muted)',
        'border-primary': 'var(--color-border-primary)',
        'border-secondary': 'var(--color-border-secondary)',
        'border-input': 'var(--color-border-input)',
        'button-primary': 'var(--color-button-primary)',
        'button-primary-hover': 'var(--color-button-primary-hover)',
        'button-success': 'var(--color-button-success)',
        'button-success-hover': 'var(--color-button-success-hover)',
        'button-danger': 'var(--color-button-danger)',
        'button-danger-hover': 'var(--color-button-danger-hover)',
        'alert-error-bg': 'var(--color-alert-error-bg)',
        'alert-error-border': 'var(--color-alert-error-border)',
        'alert-error-text': 'var(--color-alert-error-text)',
        'toggle-bg': 'var(--color-toggle-bg)',
        'toggle-hover': 'var(--color-toggle-hover)',
      },
    },
  },
  plugins: [],
}



