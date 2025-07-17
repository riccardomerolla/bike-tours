// Shared data fetcher for all tour-related custom elements
// Pass apiUrl to override, or set window.NocoDB_API_URL globally
const NOCODB_API_URL_TOURS = 'https://app.nocodb.com/api/v2/tables/mmpfmse8st37zwz/records';
const NOCODB_API_URL_ROUTES = 'https://app.nocodb.com/api/v2/tables/mcj0kkzfqpu587s/records';
const NOCODB_API_URL_ITINERARY = 'https://app.nocodb.com/api/v2/tables/mcpl1o0aaakplnv/records';

// Your NocoDB Token - Corrected to original full value
const NOCODB_TOKEN = 'azGmScTi6oyPy2t_Luo6h-MxUflLp57n-r0UOD-V';

// tours-data.js
console.log('tours-data.js loaded'); // Add this line at the very top

// Helper function to fetch data from a single NocoDB endpoint
// Added filterParams and sortParams to allow dynamic filtering and sorting
async function fetchData(url, filterParams = '', sortParams = '') {
  let fullUrl = url;
  const params = [];
  if (filterParams) params.push(filterParams);
  if (sortParams) params.push(sortParams);

  // --- ADD THIS LINE TO INCLUDE THE LIMIT PARAMETER ---
  params.push('limit=10000'); // Request a large number of records, or use -1 if NocoDB supports it for no limit
  // --- END ADDITION ---

  if (params.length > 0) {
    fullUrl += `?${params.join('&')}`;
  }

  try {
    const res = await fetch(fullUrl, {
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`NocoDB fetch failed for ${fullUrl} with status: ${res.status}`);
    const data = await res.json();
    return data.list || [];
  } catch (e) {
    console.error(`Error fetching data from NocoDB: ${e.message}`);
    return [];
  }
}

// Modified fetchToursData to accept filter and sort parameters
export async function fetchToursData(filterParams = '', sortParams = '') {
    return await fetchData(NOCODB_API_URL_TOURS, filterParams, sortParams);
}

export async function fetchCombinedToursData() {
  const [tours, routes, itineraryDays] = await Promise.all([
    fetchData(NOCODB_API_URL_TOURS),
    fetchData(NOCODB_API_URL_ROUTES),
    fetchData(NOCODB_API_URL_ITINERARY)
  ]);

    // --- ADD THESE NEW CONSOLE LOGS ---
    console.log('Raw Tours Data:', tours);
    console.log('Raw Itinerary Days Data:', itineraryDays);
    // --- END NEW CONSOLE LOGS ---

  if (!tours || tours.length === 0) {
    console.error("No tours were fetched. Check your NocoDB URLs and Token.");
    return [];
  }

  const routesMap = new Map(routes.map(route => [route.Id, route]));
  
  const combinedTours = tours.map(tour => {
    // Add console.log to see the tour being processed
    console.log(`Processing tour: ${tour.Id} - ${tour.name}`); 
    const tourItinerary = itineraryDays
      .filter(day => {
        // Robustly extract tour_id - handle both direct ID and object format
        const tourIdFromDay = (day.tour_id && typeof day.tour_id === 'object' && 'Id' in day.tour_id) ? day.tour_id.Id : day.tour_id;
        return tourIdFromDay == tour.Id;
      })
      .map(day => {
        // Robustly extract route_id - handle both direct ID and object format
        let routeIdFromDay = (day.route_id && typeof day.route_id === 'object' && 'Id' in day.route_id) ? day.route_id.Id : day.route_id;
        
        // Ensure route ID is parsed as integer for map lookup
        const routeDetails = routesMap.get(parseInt(routeIdFromDay, 10));

        return {
          day_number: day.day_number,
          title: day.daily_title || (routeDetails ? routeDetails.route_name : 'No title'),
          description: day.daily_description || (routeDetails ? routeDetails.generic_description : 'No description available.'),
          gpx_url: routeDetails ? routeDetails.gpx_url : null
        };
      })
      .sort((a, b) => a.day_number - b.day_number);

    return {
      ...tour,
      itinerary: tourItinerary
    };
  });

  return combinedTours;
}