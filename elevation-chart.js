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
  let totalElevationGain = 0;
  let lastEle = null;
  let maxElevation = 0;
  let minElevation = Infinity;

  const data = trkpts.map(pt => {
    const lat = parseFloat(pt.getAttribute('lat'));
    const lon = parseFloat(pt.getAttribute('lon'));
    
    const eleElement = pt.getElementsByTagName('ele')[0];
    const ele = eleElement ? parseFloat(eleElement.textContent) : null; // Keep null if missing for now

    // Update max and min elevation
    if (ele !== null) {
      if (ele > maxElevation) maxElevation = ele;
      if (ele < minElevation) minElevation = ele;
    }
    
    if (lastLat !== null && lastLon !== null) {
      // Haversine formula for distance in km
      const R = 6371;
      const dLat = (lat - lastLat) * Math.PI / 180;
      const dLon = (lon - lastLon) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lastLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      distance += R * c;
    }

    // Calculate elevation gain
    if (ele !== null && lastEle !== null) {
      if (ele > lastEle) {
        totalElevationGain += (ele - lastEle);
      }
    }
    lastEle = ele; // Update last elevation for the next iteration
    lastLat = lat;
    lastLon = lon;
    
    return { distance: Math.round(distance * 10) / 10, elevation: Math.round(ele !== null ? ele : 0) }; // Use 0 for chart if ele is null
  });

  // Ensure distance is rounded to one decimal for the final total
  const totalDistanceKm = Math.round(distance * 10) / 10;
  const totalElevationGainM = Math.round(totalElevationGain);
  const maxElevationM = Math.round(maxElevation);


  return {
    data: data,
    summary: {
      totalDistance: totalDistanceKm,
      totalElevationGain: totalElevationGainM,
      maxElevation: maxElevationM
    }
  };
}

async function renderElevationChart(canvasId, gpxUrl) {
  const result = await parseGpxElevation(gpxUrl); // Parse both data and summary
  const data = result.data;
  const summary = result.summary; // Extract summary

  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Return the Chart instance
  const chartInstance = new Chart(ctx, {
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
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: {
          title: { display: false, text: 'Distance (km)' },
          grid: {
            display: false // Removes vertical grid lines
          },
          ticks: {
            maxTicksLimit: 5 // Reduces the number of x-axis labels
          }
        },
        y: {
          title: { display: false, text: 'Elevation (m)' },
          grid: {
            display: false // Removes horizontal grid lines
          },
          ticks: {
            maxTicksLimit: 5 // Reduces the number of y-axis labels
          }
        }
      }
    }
  });

  // Attach summary data to the chart instance or return it separately if needed by the Lit component
  chartInstance.summaryData = summary;
  return chartInstance;
}

export { renderElevationChart };