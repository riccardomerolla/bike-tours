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
          // Alternative celeste celeste: '#40E0D0', 'celeste-dark': '#359A9A', 'celeste-light': '#B8F3F0',
          accent: {
            DEFAULT: '#E5C100', // Usage: bg-accent, text-accent
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
          },
        }
      }
    }
  }