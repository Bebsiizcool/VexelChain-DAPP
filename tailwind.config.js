/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0B0E14', // Dark blue-black
                crimson: {
                    400: '#F472B6',
                    500: '#E11D48',
                    600: '#BE123C',
                    700: '#9F1239',
                    900: '#881337',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                body: ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 60s linear infinite',
            },
        },
    },
    plugins: [],
}
