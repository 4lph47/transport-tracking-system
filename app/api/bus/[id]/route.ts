import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBusLocation } from '@/lib/busLocationService';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const busId = params.id;

    console.log('🚌 Fetching bus with ID:', busId);

    // Use shared bus location service
    const busData = await getBusLocation(busId);

    if (!busData) {
      console.log('⚠️  Bus not found with ID:', busId);
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Returning bus data for: ${busData.matricula} on ${busData.via}`);

    return NextResponse.json(busData);
  } catch (error: any) {
    console.error('❌ Error fetching bus:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
