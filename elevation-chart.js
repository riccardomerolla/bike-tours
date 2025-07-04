// Chart.js elevation profile for GPX
// Usage: <canvas id="elevation-chart"></canvas> and include this script after Chart.js and after the canvas

async function parseGpxElevation(url) {
  const res = await fetch(url);
  const text = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'application/xml');
  const trkpts = Array.from(xml.getElementsByTagName('trkpt'));
  let distance = 0;
  let lastLat = null, lastLon = null;
  const data = trkpts.map(pt => {
    const lat = parseFloat(pt.getAttribute('lat'));
    const lon = parseFloat(pt.getAttribute('lon'));
    const ele = parseFloat(pt.getElementsByTagName('ele')[0].textContent);
    if (lastLat !== null && lastLon !== null) {
      // Haversine formula for distance in km
      const R = 6371;
      const dLat = (lat - lastLat) * Math.PI / 180;
      const dLon = (lon - lastLon) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lastLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      distance += R * c;
    }
    lastLat = lat;
    lastLon = lon;
    return { distance: Math.round(distance * 10) / 10, elevation: Math.round(ele) };
  });
  return data;
}

async function renderElevationChart(canvasId, gpxUrl) {
  const data = await parseGpxElevation(gpxUrl);
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.distance),
      datasets: [{
        label: 'Elevation (m)',
        data: data.map(d => d.elevation),
        borderColor: '#E5C100',
        backgroundColor: 'rgba(229,193,0,0.1)',
        pointRadius: 0,
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: {
          title: { display: true, text: 'Distance (km)' },
          ticks: { maxTicksLimit: 10 }
        },
        y: {
          title: { display: true, text: 'Elevation (m)' }
        }
      }
    }
  });
}

export { renderElevationChart };

// Usage example (after DOM loaded):
// renderElevationChart('elevation-chart', 'sample/roadmap-sample.gpx');
