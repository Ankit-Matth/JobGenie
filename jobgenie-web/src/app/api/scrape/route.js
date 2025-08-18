import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query } = await request.json();

    // Calling Express scraping server
    const expressServerUrl = process.env.SCRAPER_API_URL;

    const response = await fetch(expressServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Next.js proxy failed:', error);
    return NextResponse.json({ isDataScraped: false, error: error.message }, { status: 500 });
  }
}
