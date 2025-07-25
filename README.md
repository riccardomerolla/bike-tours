echo -n "const bikeImages = [" && find img -type f -name 'bike-*' -printf "'%p', " | sed 's/, $/\];/'
printf "'%s',\n" tracks/*.gpx
# BikeTours Website - Modular Lit + Tailwind Refactor

This project is a modern, modular static website for BikeTours, built with Lit custom elements and Tailwind CSS. All UI is componentized for maintainability, dynamic data, and easy updates.

## Key Features
- **Modular Lit Components**: All major UI sections (header, footer, tours, mailing list, modals, etc.) are implemented as Lit custom elements in the `components/` directory.
- **Tailwind CSS**: Uses the latest Tailwind via CDN and a custom config for a clean, responsive, and modern look.
- **Dynamic Data**: Tour and FAQ data is loaded dynamically from JS modules (and can be connected to NocoDB/n8n for live data).
- **Modern Directory Structure**: All code is organized by feature: `components/`, `data/`, `styles/`, `utils/`, and `public/`.
- **Static Deployment**: No build step required. All files are ready to deploy as a static site.
- **Mobile-First**: Fully responsive layouts, touch-friendly navigation, and optimized images.
- **Interactive Modals**: Gallery and calendar modals are fully functional and now work across all pages (property bug fixed).
- **Sticky Headers/Sidebars**: Enhanced navigation and UX for long content.
- **Optimized Typography**: Uses Inter font and modern typographic scale.

## Main Files & Structure
- `index.html` - Homepage with hero, tours, destinations, and custom tour suggestion
- `tours.html` - Tours listing with grid and departures
- `tour-detail.html` - Individual tour detail with itinerary, booking, and modals
- `about.html`, `contact.html`, `faq.html`, `luxury-tours.html`, `our-bikes.html`, `bike-fitting.html` - Additional content pages, all using modular components
- `components/` - All Lit custom elements, organized by feature
- `data/` - JS modules for tours, FAQ, and other dynamic data
- `styles/` - Tailwind config and any custom CSS

## Recent Improvements
- All import paths updated to match the new directory structure
- Modal property bug fixed (`open` property now used everywhere)
- All HTML pages now use modular components and correct imports
- Mailing list, FAQ, and custom tour suggestion are modular and ready for dynamic data
- Static, CDN-based deployment (no npm, no build step)

## How to Update Images/GPX
- **Generate list of images for Our Bikes:**
  ```sh
  echo -n "const bikeImages = [" && find img -type f -name 'bike-*' -printf "'%p', " | sed 's/, $/];/'
  ```
- **Generate list of GPX files:**
  ```sh
  printf "'%s',\n" tracks/*.gpx
  ```
- **Image resize (convert to webp):**
  ```sh
  convert doozydoom-_v5HCKSZOkA-unsplash.jpg -resize 1920 -quality 88 doozydoom-_v5HCKSZOkA-unsplash.webp
  for file in *.jpg; do convert "$file" -quality 85 "${file%.jpg}.webp"; done
  ```

---
The site now provides a professional, maintainable, and easily extensible experience that rivals top cycling brands, with all original and new functionality preserved.
