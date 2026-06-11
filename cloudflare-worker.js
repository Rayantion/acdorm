export default {
  async fetch(request) {
    // 1. Get the target URL from the query parameter
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    // Add CORS headers so your website can access it
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Respond to preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (!targetUrl) {
      return new Response('Missing url parameter', { status: 400, headers: corsHeaders });
    }

    try {
      // 2. Fetch the data from the target (the university API)
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      // 3. Get the data
      const data = await response.text();

      // 4. Return the data to your frontend with the proper CORS headers attached!
      return new Response(data, {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': response.headers.get('Content-Type') || 'text/plain'
        }
      });
    } catch (error) {
      return new Response(`Error fetching: ${error.message}`, { status: 500, headers: corsHeaders });
    }
  }
};
