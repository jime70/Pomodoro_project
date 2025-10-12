/**
 * Responsive Scale Plugin for Tailwind CSS
 * Auto-scales typography, spacing, line-height, letter-spacing, and shadows across all breakpoints
 */

const plugin = require('tailwindcss/plugin')

/**
 * Default configuration
 */
const defaultConfig = {
  // Properties to auto-scale
  scaleProperties: {
    typography: true,      // font-size
    spacing: true,         // padding, margin, gap, space
    lineHeight: true,      // line-height (NEW)
    letterSpacing: true,   // letter-spacing (NEW)
    shadows: true,         // box-shadow (NEW)
    borderWidth: false,    // border-width (experimental)
    sizing: false,         // width, height (can break layouts)
    borderRadius: false    // rounded-* (usually should stay fixed)
  },
  
  // Scale factors per breakpoint
  scales: {
    xs: 1.0,      // 0px - mobile
    sm: 1.0,      // 640px
    md: 1.0,      // 768px
    lg: 1.0,      // 1024px
    xl: 1.0,      // 1280px
    '2xl': 1.05,  // 1536px - +5%
    '3xl': 1.15,  // 1920px - +15%
    '4xl': 1.25,  // 2560px - +25%
    '5xl': 1.35   // 3840px - +35%
  },
  
  // Breakpoint values (must match tailwind.config.js)
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
    '4xl': '2560px',
    '5xl': '3840px'
  }
}

/**
 * Creates the responsive scale plugin
 */
function createResponsiveScalePlugin(userConfig = {}) {
  const config = {
    ...defaultConfig,
    ...userConfig,
    scaleProperties: {
      ...defaultConfig.scaleProperties,
      ...(userConfig.scaleProperties || {})
    },
    scales: {
      ...defaultConfig.scales,
      ...(userConfig.scales || {})
    },
    breakpoints: {
      ...defaultConfig.breakpoints,
      ...(userConfig.breakpoints || {})
    }
  }

  return plugin(function({ addBase, theme }) {
    const breakpoints = config.breakpoints
    const scales = config.scales
    const { typography, spacing, lineHeight, letterSpacing, shadows, borderWidth } = config.scaleProperties

    // Generate scaling CSS for each breakpoint
    const scalingStyles = {}

    Object.entries(breakpoints).forEach(([breakpointName, breakpointValue]) => {
      const scale = scales[breakpointName] || 1.0
      
      // Skip if no scaling needed
      if (scale === 1.0) return

      const mediaQuery = breakpointValue === '0px' 
        ? '@media (min-width: 0px)' 
        : `@media (min-width: ${breakpointValue})`

      if (!scalingStyles[mediaQuery]) {
        scalingStyles[mediaQuery] = {}
      }

      // Initialize :root for this breakpoint
      if (!scalingStyles[mediaQuery][':root']) {
        scalingStyles[mediaQuery][':root'] = {}
      }

      // Scale typography
      if (typography) {
        scalingStyles[mediaQuery][':root']['--scale-text'] = scale.toString()
      }

      // Scale spacing
      if (spacing) {
        scalingStyles[mediaQuery][':root']['--scale-spacing'] = scale.toString()
      }

      // Scale line-height
      if (lineHeight) {
        scalingStyles[mediaQuery][':root']['--scale-line-height'] = scale.toString()
      }

      // Scale letter-spacing
      if (letterSpacing) {
        scalingStyles[mediaQuery][':root']['--scale-letter-spacing'] = scale.toString()
      }

      // Scale shadows
      if (shadows) {
        scalingStyles[mediaQuery][':root']['--scale-shadow'] = scale.toString()
      }

      // Scale border-width
      if (borderWidth) {
        scalingStyles[mediaQuery][':root']['--scale-border'] = scale.toString()
      }
    })

    // Apply base styles with CSS variables
    addBase({
      ':root': {
        '--scale-text': '1',
        '--scale-spacing': '1',
        '--scale-line-height': '1',
        '--scale-letter-spacing': '1',
        '--scale-shadow': '1',
        '--scale-border': '1'
      },
      ...scalingStyles
    })
  }, {
    theme: {
      extend: {
        // Auto-grid classes for automatic column calculation
        gridTemplateColumns: {
          'auto-xs': 'repeat(auto-fit, minmax(150px, 1fr))',   // Cards muy pequeñas
          'auto-sm': 'repeat(auto-fit, minmax(200px, 1fr))',   // Cards pequeñas
          'auto-md': 'repeat(auto-fit, minmax(280px, 1fr))',   // Cards medianas (default)
          'auto-lg': 'repeat(auto-fit, minmax(400px, 1fr))',   // Cards grandes
          'auto-xl': 'repeat(auto-fit, minmax(500px, 1fr))',   // Cards muy grandes
        },

        // Extend Tailwind's spacing scale to use CSS variables
        spacing: ({ theme }) => {
          const baseSpacing = theme('spacing')
          const scaledSpacing = {}
          
          Object.entries(baseSpacing).forEach(([key, value]) => {
            // Only scale numeric values, skip 'auto', 'px', etc.
            if (typeof value === 'string' && value.match(/^[\d.]+rem$/)) {
              const numValue = parseFloat(value)
              scaledSpacing[key] = `calc(${numValue}rem * var(--scale-spacing))`
            } else {
              scaledSpacing[key] = value
            }
          })
          
          return scaledSpacing
        },
        
        // Extend Tailwind's fontSize scale to use CSS variables
        fontSize: ({ theme }) => {
          const baseFontSize = theme('fontSize')
          const scaledFontSize = {}
          
          Object.entries(baseFontSize).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              // fontSize with lineHeight: ['16px', { lineHeight: '24px' }]
              const [size, config] = value
              if (typeof size === 'string' && size.match(/^[\d.]+rem$/)) {
                const numValue = parseFloat(size)
                const scaledSize = `calc(${numValue}rem * var(--scale-text))`
                
                // Scale line-height if present
                if (config && config.lineHeight && typeof config.lineHeight === 'string' && config.lineHeight.match(/^[\d.]+rem$/)) {
                  const lhValue = parseFloat(config.lineHeight)
                  scaledFontSize[key] = [
                    scaledSize,
                    {
                      ...config,
                      lineHeight: `calc(${lhValue}rem * var(--scale-line-height))`
                    }
                  ]
                } else {
                  scaledFontSize[key] = [scaledSize, config]
                }
              } else {
                scaledFontSize[key] = value
              }
            } else if (typeof value === 'string' && value.match(/^[\d.]+rem$/)) {
              // Simple fontSize: '16px'
              const numValue = parseFloat(value)
              scaledFontSize[key] = `calc(${numValue}rem * var(--scale-text))`
            } else {
              scaledFontSize[key] = value
            }
          })
          
          return scaledFontSize
        },

        // Extend line-height to use CSS variables
        lineHeight: ({ theme }) => {
          const baseLineHeight = theme('lineHeight')
          const scaledLineHeight = {}
          
          Object.entries(baseLineHeight).forEach(([key, value]) => {
            if (typeof value === 'string' && value.match(/^[\d.]+rem$/)) {
              const numValue = parseFloat(value)
              scaledLineHeight[key] = `calc(${numValue}rem * var(--scale-line-height))`
            } else if (typeof value === 'string' && !isNaN(parseFloat(value)) && !value.includes('rem') && !value.includes('px')) {
              // Unitless values (like '1.5') - scale them
              const numValue = parseFloat(value)
              scaledLineHeight[key] = `calc(${numValue} * var(--scale-line-height))`
            } else {
              scaledLineHeight[key] = value
            }
          })
          
          return scaledLineHeight
        },

        // Extend letter-spacing to use CSS variables
        letterSpacing: ({ theme }) => {
          const baseLetterSpacing = theme('letterSpacing')
          const scaledLetterSpacing = {}
          
          Object.entries(baseLetterSpacing).forEach(([key, value]) => {
            if (typeof value === 'string' && (value.match(/^[\d.]+rem$/) || value.match(/^-?[\d.]+em$/))) {
              const numValue = parseFloat(value)
              const unit = value.includes('rem') ? 'rem' : 'em'
              scaledLetterSpacing[key] = `calc(${numValue}${unit} * var(--scale-letter-spacing))`
            } else {
              scaledLetterSpacing[key] = value
            }
          })
          
          return scaledLetterSpacing
        },

        // Extend box-shadow to use CSS variables
        boxShadow: ({ theme }) => {
          const baseBoxShadow = theme('boxShadow')
          const scaledBoxShadow = {}
          
          Object.entries(baseBoxShadow).forEach(([key, value]) => {
            if (typeof value === 'string' && value !== 'none') {
              // Scale shadow blur and spread
              // Shadow format: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              const scaledValue = value.replace(
                /([\d.]+)px/g,
                (match, num) => `calc(${num}px * var(--scale-shadow))`
              )
              scaledBoxShadow[key] = scaledValue
            } else {
              scaledBoxShadow[key] = value
            }
          })
          
          return scaledBoxShadow
        },

        // Extend border-width to use CSS variables (if enabled)
        borderWidth: ({ theme }) => {
          const baseBorderWidth = theme('borderWidth')
          const scaledBorderWidth = {}
          
          Object.entries(baseBorderWidth).forEach(([key, value]) => {
            if (typeof value === 'string' && value.match(/^[\d.]+px$/)) {
              const numValue = parseFloat(value)
              scaledBorderWidth[key] = `calc(${numValue}px * var(--scale-border))`
            } else {
              scaledBorderWidth[key] = value
            }
          })
          
          return scaledBorderWidth
        }
      }
    }
  })
}

module.exports = createResponsiveScalePlugin
module.exports.defaultConfig = defaultConfig
