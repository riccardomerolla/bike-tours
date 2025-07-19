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
          accent: {
            DEFAULT: '#6A0DAD', // Usage: bg-accent, text-accent
            dark: '#C7A800',    // Darker shade for hover/active states. Usage: hover:bg-accent-dark
            light: '#FAE588',   // Lighter shade for subtle highlights. Usage: bg-accent-light
          },
          
          // Neutral colors for UI elements and text.
          'base-content': {
            DEFAULT: '#FFFFFF', // Default text color on dark backgrounds. Usage: text-base-content
            subtle: '#6B7280',  // Muted gray for secondary text and metadata. Usage: text-base-content-subtle
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