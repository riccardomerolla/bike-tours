# BikeTours Website - Tailwind CSS Refactor

This website has been refactored to use Tailwind CSS for modern, responsive design.

## What's New:
- **Modern Design**: Clean, professional design inspired by Bianchi.com
- **Mobile Optimized**: Fully responsive design that works on all devices
- **Tailwind CSS**: Latest version from CDN for better performance and maintainability
- **Improved UX**: Better hover effects, transitions, and interactive elements
- **Dark/Light Theme**: Modern black and white theme with orange accent color

## Files Updated:
- `index.html` - Homepage with hero section, tours carousel, destinations, and contact form
- `tours.html` - Tours listing page with grid layout and departure schedule
- `tour-detail.html` - Individual tour detail page with itinerary and booking sidebar

## Features:
- Responsive navigation with mobile hamburger menu
- Full-screen hero sections with overlay text
- Card-based layouts for tours
- Interactive carousel for tour listings
- Modal for packing list generation
- Sticky headers and sidebars
- Smooth transitions and hover effects
- Optimized typography with Inter font

## Mobile Optimizations:
- Touch-friendly navigation
- Responsive grid layouts
- Optimized image sizes
- Mobile-first design approach
- Proper spacing and typography for small screens

The website now provides a modern, professional experience that rivals top cycling brands while maintaining all original functionality.

## Generate list of images for Our Bikes
run the cmd

echo -n "const bikeImages = [" && find img -type f -name 'bike-*' -printf "'%p', " | sed 's/, $/\];/'

## Image resize

convert doozydoom-_v5HCKSZOkA-unsplash.jpg -resize 1920 -quality 88 doozydoom-_v5HCKSZOkA-unsplash.webp

for file in *.jpg; do convert "$file" -quality 85 "${file%.jpg}.webp"; done