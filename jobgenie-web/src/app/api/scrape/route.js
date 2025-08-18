import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query } = await request.json();

    const expressServerUrl = process.env.SCRAPER_API_URL;

    const response = await fetch(`${expressServerUrl}/scrape-jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const contentType = response.headers.get('content-type');

    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, read as text and wrap it in a JSON object
      const text = await response.text();
      console.warn('Non-JSON response from Express backend:', text);
      data = { isDataScraped: false, error: 'Received non-JSON response', html: text };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Next.js proxy failed:', error);
    return NextResponse.json(
      { isDataScraped: false, error: error.message },
      { status: 500 }
    );
  }
}
