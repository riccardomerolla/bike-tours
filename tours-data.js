// Shared data fetcher for all tour-related custom elements
// Pass apiUrl to override, or set window.NocoDB_API_URL globally
const NOCODB_API_URL_TOURS = 'https://app.nocodb.com/api/v2/tables/mmpfmse8st37zwz/records';
const NOCODB_API_URL_ROUTES = 'https://app.nocodb.com/api/v2/tables/mcj0kkzfqpu587s/records';
const NOCODB_API_URL_ITINERARY = 'https://app.nocodb.com/api/v2/tables/mcpl1o0aaakplnv/records';
const NOCODB_API_URL_FAQ = 'https://app.nocodb.com/api/v2/tables/mwqmethbas34wpw/records';

// Your NocoDB Token - Corrected to original full value
const NOCODB_TOKEN = 'azGmScTi6oyPy2t_Luo6h-MxUflLp57n-r0UOD-V';

// --- Start Cache Implementation ---
let cachedCombinedToursData = null; // In-memory cache for combined tour data
let cacheFetchPromise = null; // To prevent multiple simultaneous fetches
const CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes (in milliseconds)
let lastCacheTime = 0; // Timestamp of the last successful fetch
// --- End Cache Implementation ---


// tours-data.js
console.log('tours-data.js loaded');

// Helper function to fetch data from a single NocoDB endpoint
async function fetchData(url, filterParams = '', sortParams = '') {
  let fullUrl = url;
  const params = [];
  if (filterParams) params.push(filterParams);
  if (sortParams) params.push(sortParams);

  // Keep a reasonable limit, but caching will prevent redundant calls
  params.push('limit=100'); 

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

// Fetch FAQ data from NocoDB
export async function fetchFAQData(filterParams = '', sortParams = '') {
    return await fetchData(NOCODB_API_URL_FAQ, filterParams, sortParams);
}

export async function fetchCombinedToursData() {
  // Check if cache is fresh and a fetch is not already in progress
  if (cachedCombinedToursData && (Date.now() - lastCacheTime < CACHE_DURATION)) {
    console.log('Returning combined tours data from cache.');
    return cachedCombinedToursData;
  }

  // If a fetch is already in progress, wait for it to complete
  if (cacheFetchPromise) {
    console.log('Waiting for ongoing combined tours data fetch to complete.');
    return cacheFetchPromise;
  }

  // If no fresh cache and no ongoing fetch, start a new fetch
  cacheFetchPromise = (async () => {
    try {
      const [tours, routes, itineraryDays] = await Promise.all([
        fetchData(NOCODB_API_URL_TOURS),
        fetchData(NOCODB_API_URL_ROUTES),
        fetchData(NOCODB_API_URL_ITINERARY)
      ]);

      console.log('Raw Tours Data:', tours);
      console.log('Raw Itinerary Days Data:', itineraryDays);

      if (!tours || tours.length === 0) {
        console.error("No tours were fetched. Check your NocoDB URLs and Token.");
        return [];
      }

      const routesMap = new Map(routes.map(route => [route.Id, route]));
      
      const combinedTours = tours.map(tour => {
        console.log(`Processing tour: ${tour.Id} - ${tour.name}`); 
        const tourItinerary = itineraryDays
          .filter(day => {
            const tourIdFromDay = (day.tour_id && typeof day.tour_id === 'object' && 'Id' in day.tour_id) ? day.tour_id.Id : day.tour_id;
            return tourIdFromDay == tour.Id;
          })
          .map(day => {
            let routeIdFromDay = (day.route_id && typeof day.route_id === 'object' && 'Id' in day.route_id) ? day.route_id.Id : day.route_id;
            
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

      cachedCombinedToursData = combinedTours; // Store result in cache
      lastCacheTime = Date.now(); // Update cache timestamp
      return combinedTours;
    } catch (error) {
      console.error("Failed to fetch and combine tours data:", error);
      cachedCombinedToursData = []; // Clear cache on error
      return [];
    } finally {
      cacheFetchPromise = null; // Clear the promise regardless of success or failure
    }
  })();

  return cacheFetchPromise; // Return the promise to wait for its resolution
}