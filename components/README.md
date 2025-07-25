
# BikeTours Components Directory

This directory contains all Lit custom elements used in the BikeTours website, grouped by feature for maintainability and clarity.

## Global Components

- **site-header.js**: Responsive site header with navigation, logo, and mobile menu toggle. Used on every page.
- **site-footer.js**: Footer with navigation links, social icons, and embedded mailing list form.
- **mailing-list/mailing-list-subscribe.js**: Mailing list subscription form, integrated with n8n or other backend. Handles validation, loading, and error states.
- **custom-tour-suggestion.js**: Interactive form for users to describe their dream cycling tour and submit suggestions. Handles async submission and displays a response.

## Tours Components (`tours/`)

- **tour-detail-app.js**: Main app shell for the tour detail page. Fetches all data, manages state, and passes props to child components. Handles modals and dynamic content.
- **tour-hero-section.js**: Hero section for a tour detail page, showing the main image, title, and a button to open the gallery modal.
- **tour-info-row-section.js**: Displays key info (start/end, duration, price, etc.) in a sticky row. Handles sticky header logic.
- **tour-sidebar-section.js**: Sidebar with price, next departure, group size, rating, and booking/calendar button.
- **tour-luxury-section.js**: Accordion section highlighting luxury features for luxury tours.
- **tour-itinerary.js**: Renders the day-by-day itinerary for a tour, with accordion logic for each day.
- **tour-image-gallery-modal.js**: Full-screen modal for displaying a gallery of images. Controlled via the `open` property and `images` array.
- **tour-calendar-modal-content.js**: Modal for showing all available departures for a tour, grouped by month. Controlled via the `open` property and `departures` array.
- **similar-tours-section.js**: Shows a grid of similar or recommended tours, based on the current tour or destination.
- **departures-section.js**: Standalone section for listing all upcoming departures, filterable by type (e.g., luxury, all).
- **tours-section.js**: Main homepage section for featured tours, with a responsive carousel and dynamic data loading.
- **tours-grid.js**: Grid layout for displaying all tours on the tours listing page, filterable by destination.
- **stages-grid.js**: Specialized grid for displaying all GPX stages/tracks, with dynamic loading and parsing of GPX files.
- **gpx-elevation-chart.js**: Lit component for rendering an elevation chart from a GPX file using Chart.js. Handles dynamic script loading and updates.
- **elevation-chart.js**: Helper for parsing GPX files and rendering elevation profiles with Chart.js (used by gpx-elevation-chart.js).
- **map.js**: Helper for rendering a Leaflet map with a GPX track overlay. Used in itinerary and stage details.

## Mailing List Components (`mailing-list/`)

- **mailing-list-subscribe.js**: (See above) Handles the mailing list form, validation, and async submission.

---

All components are designed for light DOM rendering to ensure Tailwind CSS compatibility. Each is self-contained and can be reused across pages. For more details, see the JSDoc comments in each file.
