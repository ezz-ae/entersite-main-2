'use server';

import { NextRequest, NextResponse } from 'next/server';

// This is a mock API route. In a real application, this would involve complex logic 
// to query a database or a data warehouse to build an audience.

export async function POST(req: NextRequest) {
  try {
    const criteria = await req.json();

    // Simulate a delay for building the audience
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate a mock audience based on the criteria
    const estimatedSize = Math.floor(Math.random() * (15000 - 3000 + 1)) + 3000;
    const topCountry = ['United Kingdom', 'Saudi Arabia', 'USA', 'India', 'Russia'][Math.floor(Math.random() * 5)];
    const avgNetWorth = `$${(Math.random() * (5 - 1.5) + 1.5).toFixed(1)}M`;

    return NextResponse.json({
      estimatedSize: estimatedSize.toLocaleString(),
      demographics: {
        topCountry,
        avgNetWorth,
      },
      criteria, // Echo back the criteria for confirmation
    });

  } catch (error) {
    console.error('Audience Build API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while building the audience.' }, { status: 500 });
  }
}
