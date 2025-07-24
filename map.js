/**
 * Creates a Leaflet map and displays a GPX track as a polyline.
 * @param {string} containerId - The ID of the div element to contain the map.
 * @param {Array<Object>} points - An array of points with {lat, lon}.
 */
function createGpxMap(containerId, points) {
    if (!points || points.length === 0) {
        console.error('No points were provided for map creation.');
        const container = document.getElementById(containerId);
        if(container) {
            container.innerHTML = '<p class="text-center text-gray-500">Map data not available.</p>';
        }
        return;
    }

    // Create the map inside the specified container
    const map = L.map(containerId, {
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create a polyline from the GPX track points
    const latlngs = points.map(p => [p.lat, p.lon]);
    const polyline = L.polyline(latlngs, { color: '#3f51b5', weight: 3 }).addTo(map);

    // Automatically zoom the map to fit the track
    map.fitBounds(polyline.getBounds().pad(0.1)); // .pad() adds a nice margin
}