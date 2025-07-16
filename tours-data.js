// Shared data fetcher for all tour-related custom elements
// Pass apiUrl to override, or set window.NocoDB_API_URL globally
const NOCODB_API_URL_TOURS = 'https://app.nocodb.com/api/v2/tables/mmpfmse8st37zwz/records';
const NOCODB_API_URL_ROUTES = 'https://app.nocodb.com/api/v2/tables/mcj0kkzfqpu587s/records';
const NOCODB_API_URL_ITINERARY = 'https://app.nocodb.com/api/v2/tables/mcpl1o0aaakplnv/records';

// Your NocoDB Token
const NOCODB_TOKEN = 'azGmScTi6oyPy2t_Luo6h-MxUflLp57n-r0UOD-V';

// Helper function to fetch data from a single NocoDB endpoint
async function fetchData(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`NocoDB fetch failed for ${url} with status: ${res.status}`);
    const data = await res.json();
    
    // --- LOGGING ADDED ---
    console.log(`[Debug] Raw data fetched from: ${url}`, data);
    
    return data.list || [];
  } catch (e) {
    console.error(`Error fetching data from NocoDB: ${e.message}`);
    return [];
  }
}

export async function fetchCombinedToursData() {
  console.log("[Debug] Starting fetchCombinedToursData...");
  
  const [tours, routes, itineraryDays] = await Promise.all([
    fetchData(NOCODB_API_URL_TOURS),
    fetchData(NOCODB_API_URL_ROUTES),
    fetchData(NOCODB_API_URL_ITINERARY)
  ]);

  if (!tours || tours.length === 0) {
    console.error("No tours were fetched. Check your NocoDB URLs and Token.");
    return [];
  }

  const routesMap = new Map(routes.map(route => [route.Id, route]));
  
  const combinedTours = tours.map(tour => {
    const tourItinerary = itineraryDays
      .filter(day => {
        const tourIdFromDay = (typeof day.tour_id === 'object' && day.tour_id !== null) ? String(day.tour_id.Id) : String(day.tour_id);
        return tourIdFromDay === String(tour.Id);
      })
      .map(day => {
        let routeIdFromDay = (typeof day.route_id === 'object' && day.route_id !== null) ? day.route_id.Id : day.route_id;
        const routeDetails = routesMap.get(routeIdFromDay);

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

  // --- LOGGING ADDED ---
  console.log("[Debug] Final combined tour data being sent to components:", combinedTours);

  return combinedTours;
}

export async function fetchToursData() {
    console.log("[Debug] Starting fetchToursData (for index/tours page)...");
    const tours = await fetchData(NOCODB_API_URL_TOURS);
    console.log("[Debug] Data from fetchToursData:", tours);
    return tours;
}