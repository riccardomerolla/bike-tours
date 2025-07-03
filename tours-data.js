// Shared data fetcher for all tour-related custom elements
export async function fetchToursData() {
  // For demo: fetch from local data.json. Replace with your NocoDB API endpoint for production.
  const url = 'data.json';
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (e) {
    return [];
  }
}
