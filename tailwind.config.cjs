const responsiveScalePlugin = require('./src/Plugin/responsiveScalePlugin.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        screens: {
          'xs': '475px',
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
          '3xl': '1920px',
          '4xl': '2560px',
          '5xl': '3840px',
        }
      },
    },
    plugins: [
      responsiveScalePlugin({
        // Auto-scale properties
        scaleProperties: {
          typography: true,      // font-size
          spacing: true,         // padding, margin, gap
          lineHeight: true,      // line-height (mejora legibilidad)
          letterSpacing: true,   // letter-spacing (mejora legibilidad)
          shadows: true,         // box-shadow (mejor profundidad)
          borderWidth: false,    // border-width (experimental)
          sizing: false,         // width, height (puede romper layouts)
          borderRadius: false    // rounded-* (mantener fijo)
        },
        // Scale factors per breakpoint
        scales: {
          xs: 1.0,
          sm: 1.0,
          md: 1.0,
          lg: 1.0,
          xl: 1.0,
          '2xl': 1.05,  // +5% en 1536px
          '3xl': 1.15,  // +15% en 1920px
          '4xl': 1.25,  // +25% en 2560px
          '5xl': 1.35   // +35% en 3840px
        },
        // Breakpoints (must match theme.extend.screens)
        breakpoints: {
          xs: '475px',
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
          '3xl': '1920px',
          '4xl': '2560px',
          '5xl': '3840px'
        }
      })
    ],
  }
 