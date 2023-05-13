const { guessProductionMode } = require('@ngneat/tailwind');

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
    prefix: 'tw-',
    mode: 'jit',
    content: ['./src/**/*.{html,ts,css,scss,sass,less,styl}'],
    corePlugins: {
        preflight: false,
        aspectRatio: false
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        screens: {
            xs: '360px',
            sm: '640px',
            md: '768px',
            '2md': '1018px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
            '3xl': '1600px',
            '4xl': '2000px'
        },
        extend: {
            boxShadow: {
                border: '0 0 0 1px rgba(0, 0, 0, 0.1)',
                'focus-box': '0 0 0 3px #A855F7'
            },
            brightness: {
                20: '.2',
                25: '.25',
                30: '.3',
                35: '.35',
                40: '.4'
            },
            colors: {
                body: {
                    1: '#111111'
                },
                neutral: {
                    620: '#575757',
                    625: '#393939',
                    650: '#424242',
                    675: '#464646',
                    725: '#303030',
                    850: '#212121',
                    875: '#1e1e1e',
                    925: '#1c1c1c'
                }
            },
            content: {
                invisible: "'\\200b'"
            },
            lineHeight: {
                '5xl': '1.1'
            },
            margin: {
                '5%': '5%'
            },
            height: {
                'screen-50': '50vh',
                'screen-75': '75vh',
                'screen-80': '80vh'
            },
            maxHeight: {
                'fill-available': '-webkit-fill-available'
            },
            maxWidth: {
                '115px': '115px',
                32: '128px',
                48: '12rem',
                '8xl': '90rem'
            },
            opacity: {
                6: '0.06'
            },
            spacing: {
                1.75: '0.4rem',
                34: '8.5rem',
                76: '19rem',
                '30px': '30px'
            },
            transformOrigin: {
                'left-center': 'left center'
            },
            transitionProperty: {
                width: 'width',
                height: 'height',
                'width-height': 'width, height',
                left: 'left',
                top: 'top',
                left: 'left',
                right: 'right',
                bottom: 'bottom'
            },
            transitionDelay: {
                25: '25ms',
                50: '50ms'
            },
            zIndex: {
                1: '1',
                2: '2',
                3: '3',
                4: '4',
                5: '5'
            }
        }
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')]
};
