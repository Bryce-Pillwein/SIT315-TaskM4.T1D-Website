// Metric Simulator Api Route ts

import { NextResponse } from 'next/server';

let containerMetrics: any[] = [];

/**
 * POST handler for receiving and storing container metrics
 * @param request - Incoming request from simulator
 * @returns response - JSON response with status and data
 */
export async function POST(request: Request) {
  try {
    // Parse the request body (from the simulator)
    const { containerId, athleteCount, startIndex, assignedAthletes, timestamp } = await request.json();

    // Store the received metrics
    const metrics = {
      containerId,
      athleteCount,
      startIndex,
      assignedAthletes,
      timestamp,
    };

    // Update metrics, removing old entries for this container
    containerMetrics = containerMetrics.filter(m => m.containerId !== containerId);
    containerMetrics.push(metrics);

    // Respond with a confirmation message
    return NextResponse.json({ message: 'Metrics received', data: metrics }, { status: 200 });
  } catch (error) {
    // Handle any error and return a 500 response
    return NextResponse.json({ error: 'Failed to store metrics' }, { status: 500 });
  }
}

/**
 * GET handler for retrieving stored container metrics
 * @returns response - JSON response with all stored metrics
 */
export async function GET() {
  try {
    // Return the stored container metrics
    return NextResponse.json(containerMetrics, { status: 200 });
  } catch (error) {
    // Handle any error and return a 500 response
    return NextResponse.json({ error: 'Failed to retrieve metrics' }, { status: 500 });
  }
}