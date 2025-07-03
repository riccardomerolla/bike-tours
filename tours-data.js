// Shared data fetcher for all tour-related custom elements
// Pass apiUrl to override, or set window.NocoDB_API_URL globally
export async function fetchToursData(apiUrl) {
  const defaultNocoDB = window.NocoDB_API_URL || 'https://app.nocodb.com/api/v2/tables/mmpfmse8st37zwz/records';
  const url = apiUrl || defaultNocoDB;
  try {
    const res = await fetch(url, {
      headers: {
        // Uncomment and set your API key if needed:
         'xc-token': 'azGmScTi6oyPy2t_Luo6h-MxUflLp57n-r0UOD-V',
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('NocoDB fetch failed');
    const data = await res.json();
    // NocoDB returns { list: [...] } for records
    if (Array.isArray(data)) return data;
    if (data.list) return data.list;
    return data;
  } catch (e) {
    // fallback to local demo data
    try {
      const res = await fetch('data.json');
      return await res.json();
    } catch {
      return [];
    }
  }
}
