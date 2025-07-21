// tailwind.config.js
/*tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: '#000000',
                celeste: '#40E0D0',
                'celeste-dark': '#359A9A',
                'celeste-light': '#B8F3F0',
                accent: '#40E0D0',
                'bianchi-blue': '#1E3A8A',
                gray: {
                    850: '#1f2937',
                }
            }
        }
    }
}
*/
/** @type {import('tailwindcss').Config} */
tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          // Sets Inter as the default sans-serif font for the project.
          sans: ['Inter', 'sans-serif'],
          script: ['Parisienne', 'cursive'],
        },
        colors: {
          // The foundational dark color for backgrounds and text on light surfaces.
          primary: '#1A1A1A',
  
          // The main accent color for calls-to-action, links, and highlights.
          // Default yellow #E5C100
          // Alternative orange #FF6B00
          // Alternative electric blue #007BFF
          // Deep Royal Purple #6A0DAD
          // Alternative celeste celeste: '#40E0D0', 'celeste-dark': '#359A9A', 'celeste-light': '#B8F3F0',
          // accent: {
          //   DEFAULT: '#6A0DAD', // The main purple accent color
          //   dark: '#4B0082',    // A darker shade of purple for hover/active states
          //   light: '#C3A5DA',   // A lighter shade of purple for subtle highlights
          // },

          // accent: {
          //   DEFAULT: '#FF6B00', // The new main accent orange color
          //   dark: '#CC5500',    // A darker shade of orange for hover/active states
          //   light: '#FF9933',   // A lighter shade of orange for subtle highlightsge: text-base-content-subtle
          // },

          // accent: {
          //   DEFAULT: '#007BFF', // The new main accent electric blue color
          //   dark: '#0056B3',    // A darker shade of electric blue for hover/active states
          //   light: '#66B2FF',   // A lighter shade of electric blue for subtle highlights
          // },

          // accent: {
          //   DEFAULT: '#F44336', // The new main accent red color
          //   dark: '#D32F2F',    // A darker shade of red for hover/active states
          //   light: '#EF9A9A',   // A lighter shade of red for subtle highlights
          // },
          
          // accent: {
          //   DEFAULT: '#E5C100', // The new main accent yellow color
          //   dark: '#C7A800',    // A darker shade of yellow for hover/active states
          //   light: '#FAE588',   // A lighter shade of yellow for subtle highlights
          // },
          accent: {
            DEFAULT: '#C2D400', // The new main accent yellowish-green color
            dark: '#9AA800',    // A darker shade of yellowish-green for hover/active states
            light: '#E0ED66',   // A lighter shade of yellowish-green for subtle highlights
          },
  
          'base-content': {
            DEFAULT: '#FFFFFF',
            subtle: '#6B7280',
          },
          // Background colors for sections or cards.
          'base-background': {
            DEFAULT: '#FFFFFF', // Default page background. Usage: bg-base-background
            secondary: '#F5F5F5', // Light gray for alternating sections. Usage: bg-base-background-secondary
            // Adding the new light gray from your palette
            'extra-light': '#E5E7EB', // Usage: bg-base-background-extra-light
          },

          // Red shades for errors, warnings, or negative indicators
          red: {
            DEFAULT: '#F44336', // A vibrant red for primary alerts
            light: '#EF9A9A',   // Your specified light red for backgrounds of error messages
            dark: '#C62828',    // A darker red for text on light red backgrounds or stronger error states
          },

          // Green shades for success, positive indicators, or confirmations
          green: {
            DEFAULT: '#4CAF50', // A vibrant green for primary success messages
            light: '#A5D6A7',   // Your specified light green for backgrounds of success alerts
            dark: '#2E7D32',    // A darker green for text on light green backgrounds or deeper accents
          },
        }
      }
    }
  }