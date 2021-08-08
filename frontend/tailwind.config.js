const colors = require('tailwindcss/colors');

module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: false, // or 'media' or 'class'
    mode: 'jit',
    theme: {
        fontFamily: {
            sans: ['Roboto', 'sans-serif'],
            display: ['Roboto', 'sans-serif'],
            body: ['Roboto', 'sans-serif'],
        },
        extend: {
            zIndex: {
                '-5': '-5',
                '-10': '-10'
            },
            opacity: {
                '01': '.008',
                '02': '.02',
                '11': '.09'
            },
            colors: {
                sky: colors.sky,
                cyan: colors.cyan,
                'h-gray-200': '#838383',
                'h-gray-300': '#4F4F4F',
                'h-gray-400': '#444444',
                'h-gray-600': '#5A5A5A',
                'h-gray-800': '#2E2E2E',
                'h-gray-900': '#0A0A0A',
            },
        },
    },
    variants: {},
    plugins: []
}
