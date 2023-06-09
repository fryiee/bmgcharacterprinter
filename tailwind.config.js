// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            borderWidth: {
                '5': '5px'
            },
            colors: {
                yellow: {
                    '400': '#ffd400'
                }
            },
            height: {
                'screen-1/10': '10vh',
                'screen-1/8': '12.5vh',
                'screen-1/5': '20vh',
                'screen-1/4': '25vh',
                'screen-1/3': '33vh',
                'screen-1/2': '50vh'
            },
            width: {
                'screen-1/10': '10vw',
                'screen-1/8': '12.5vw',
                'screen-1/5': '20vw',
                'screen-1/4': '25vw',
                'screen-3/4': '75vw',
                'screen-1/3': '33vw',
                'screen-1/2': '50vw',
                '1/8': '12.5%'
            },
            maxWidth: {
                'screen-1/10': '10vw',
                'screen-1/8': '12.5vw',
                'screen-1/4': '25vw',
                'screen-3/4': '75vw',
                'screen-1/3': '33vw',
                'screen-1/2': '50vw',
            },
            zIndex: {
                '5': '5'
            },
            leading: {
                'zero': '0',
                'half': '0.5'
            }
        },
        fontFamily: {
            'sans': 'Bebas Neue, sans-serif',
            'serif': 'Open Sans, sans-serif'
        },
        screens: {
            'sm': '600px',
            'md': '900px',
            'lg': '1024px',
            'xl': '1400px',
            'xxl': '1680px',
            'print': {'raw': 'print'},
        }
    },
    plugins: [],
    variants: {},
    content: [
        './index.html',
        './src/js/**/*.vue'
    ],
    safelist: [
        'autocomplete',
        'printblock',
        'avoidbreak'
    ],
    future: {
        defaultLineHeights: true,
        standardFontWeights: true,
        purgeLayersByDefault: true,
        removeDeprecatedGapUtilities: true,
    },
}
