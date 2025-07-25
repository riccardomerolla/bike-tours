document.addEventListener('DOMContentLoaded', () => {
    // List of all GPX track files in the 'tracks' folder
    const gpxTracks = [
      'tracks/cala pi_course.1753373884818.gpx',
      'tracks/Camis_Mallorca.gpx',
      'tracks/Cap-Salines_course.gpx',
      'tracks/COURSE_383135815.gpx',
      'tracks/COURSE_383135988.gpx',
      'tracks/COURSE_383136158.gpx',
      'tracks/COURSE_383136333.gpx',
      'tracks/COURSE_383136848.gpx',
      'tracks/COURSE 383135815-mod.gpx',
      'tracks/Formentor_course.gpx',
      'tracks/Llucmajor_course.gpx',
      'tracks/Orient_course.gpx',
      'tracks/Petra_course.gpx',
      'tracks/Port-de-Sa-Calobra_course.gpx',
      'tracks/port de saller_course.1753374067557.gpx',
      'tracks/Porto-Cristo_course.gpx',
      'tracks/randa _ santuari..._course.1753374034357.gpx',
      'tracks/sant elm_course.1753374093592.gpx',
      'tracks/santuari de la m..._course.1753374079786.gpx',
      'tracks/sa ra pita_course.1753374104707.gpx',
      'tracks/activity_1081512446.gpx',
      'tracks/activity_1088476992.gpx'
    ];

    const gridContainer = document.getElementById('gpx-grid');
    if (!gridContainer) {
        console.error("The grid container '#gpx-grid' was not found.");
        return;
    }

    gridContainer.innerHTML = '<p class="text-center text-gray-600 col-span-full">Loading stages...</p>';

    // Step 1: Fetch and parse all GPX files in parallel
    const promises = gpxTracks.map(trackPath => {
        return fetch(trackPath)
            .then(response => {
                if (!response.ok) throw new Error(`Network response was not ok for ${trackPath}`);
                return response.text();
            })
            .then(gpxText => {
                const points = parseGPX(gpxText);
                const stats = calculateStats(points);
                return { trackPath, points, stats };
            })
            .catch(error => {
                console.error(`Failed to process GPX file ${trackPath}:`, error);
                return null;
            });
    });

    // Step 2: Once ALL data is processed, create and render the cards
    Promise.all(promises).then(allTrackData => {
        gridContainer.innerHTML = ''; // Clear the "Loading..." message

        allTrackData.forEach((trackData, index) => {
            if (trackData) {
                const card = createGpxCard(trackData.trackPath, trackData.stats, index);
                gridContainer.appendChild(card);
                
                setTimeout(() => {
                    if (typeof createGpxMap !== 'undefined') {
                        createGpxMap(`map-${index}`, trackData.points);
                    }
                    const canvas = document.getElementById(`chart-${index}`);
                    if (canvas) {
                        createElevationChart(canvas, trackData.points);
                    }
                }, 10);
            }
        });
    });
});


// --- GPX & STATS HELPER FUNCTIONS ---

function parseGPX(gpxText) {
    const points = [];
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxText, "text/xml");
    const trackpoints = xmlDoc.getElementsByTagName('trkpt');
    for (let i = 0; i < trackpoints.length; i++) {
        const lat = parseFloat(trackpoints[i].getAttribute('lat'));
        const lon = parseFloat(trackpoints[i].getAttribute('lon'));
        const eleElement = trackpoints[i].getElementsByTagName('ele')[0];
        const ele = eleElement ? parseFloat(eleElement.textContent) : 0;
        points.push({ lat, lon, ele });
    }
    return points;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 0.5 - Math.cos(dLat) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

function calculateStats(points) {
    let totalDistance = 0, totalAscent = 0, maxHeight = -Infinity;
    for (let i = 0; i < points.length; i++) {
        if (i > 0) {
            const p1 = points[i - 1], p2 = points[i];
            totalDistance += calculateDistance(p1.lat, p1.lon, p2.lat, p2.lon);
            const eleDiff = p2.ele - p1.ele;
            if (eleDiff > 0) totalAscent += eleDiff;
        }
        if (points[i].ele > maxHeight) maxHeight = points[i].ele;
    }
    return {
        distance: totalDistance.toFixed(1),
        ascent: totalAscent.toFixed(0),
        maxHeight: maxHeight.toFixed(0)
    };
}


// --- UI & CHARTING FUNCTIONS ---

function createGpxCard(trackPath, stats, index) {
    const trackName = trackPath.split('/').pop().replace(/_course\.gpx/i, '').replace(/_/g, ' ');
    const card = document.createElement('div');
    card.className = 'bg-white shadow-md overflow-hidden flex flex-col';
    
    // ** New SVG icons to match tour-detail.html **
    const distanceIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-.553-.894L15 2m-6 5l6-3m0 0l6 3" />
        </svg>`;
    const ascentIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 15l4-4 4 4 4-4 4 4M3 9l4-4 4 4 4-4 4 4" />
        </svg>`;
    const altitudeIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>`;

    card.innerHTML = `
        <div class="p-5"><h3 class="text-xl font-bold text-gray-900 capitalize">${trackName}</h3></div>
        <div id="map-${index}" class="h-52 w-full bg-gray-200" aria-label="Map of ${trackName}"></div>
        <div class="p-5 flex-grow">
            <p class="text-sm font-semibold text-gray-600 mb-2">Elevation Profile</p>
            <div class="h-40"><canvas id="chart-${index}" role="img" aria-label="Elevation chart for ${trackName}"></canvas></div>
        </div>
        <div class="p-4 border-t border-gray-200">
            <div class="flex justify-around text-center">
                <div>
                    <div class="h-8 w-8 mx-auto">${distanceIcon}</div>
                    <p class="mt-1 text-sm font-semibold text-gray-600">Distance</p>
                    <p class="text-lg font-bold text-gray-900">${stats.distance} km</p>
                </div>
                <div>
                    <div class="h-8 w-8 mx-auto">${ascentIcon}</div>
                    <p class="mt-1 text-sm font-semibold text-gray-600">D+</p>
                    <p class="text-lg font-bold text-gray-900">${stats.ascent} m</p>
                </div>
                <div>
                    <div class="h-8 w-8 mx-auto">${altitudeIcon}</div>
                    <p class="mt-1 text-sm font-semibold text-gray-600">Max. elev.</p>
                    <p class="text-lg font-bold text-gray-900">${stats.maxHeight} m</p>
                </div>
            </div>
        </div>`;
    return card;
}

function createElevationChart(canvas, points) {
    const calculateTotalDistance = (pts) => {
        let total = 0;
        for (let i = 1; i < pts.length; i++) {
            total += calculateDistance(pts[i - 1].lat, pts[i - 1].lon, pts[i].lat, pts[i].lon);
        }
        return total;
    };
    const labels = points.map((p, i) => (i > 0 && i % 50 === 0) ? `${calculateTotalDistance(points.slice(0, i + 1)).toFixed(1)}` : '');
    const data = points.map(p => p.ele);
    new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                borderColor: 'rgba(67, 56, 202, 1)',
                backgroundColor: 'rgba(67, 56, 202, 0.2)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: false, title: { display: true, text: 'Meters' } },
                x: { title: { display: true, text: 'Distance (km)' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}
