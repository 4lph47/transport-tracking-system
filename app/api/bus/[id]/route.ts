import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const busId = params.id;

    console.log('Fetching bus with ID:', busId);

    // Get the transport with its via and stops
    const transporte = await prisma.transporte.findUnique({
      where: { id: busId },
      include: {
        via: {
          include: {
            paragens: {
              include: {
                paragem: true,
              },
              orderBy: {
                id: 'asc',
              },
            },
          },
        },
        geoLocations: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    console.log('Transport found:', transporte ? 'Yes' : 'No');

    if (!transporte) {
      console.log('Bus not found with ID:', busId);
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      );
    }

    // Get current location
    let currentLat, currentLng;
    
    if (transporte.currGeoLocation) {
      [currentLat, currentLng] = transporte.currGeoLocation.split(',').map(Number);
      console.log('Using currGeoLocation:', currentLat, currentLng);
    } else if (transporte.geoLocations.length > 0) {
      [currentLat, currentLng] = transporte.geoLocations[0].geoLocationTransporte.split(',').map(Number);
      console.log('Using geoLocations:', currentLat, currentLng);
    } else {
      // Default to first stop
      const firstStop = transporte.via.paragens[0];
      if (firstStop) {
        [currentLat, currentLng] = firstStop.paragem.geoLocation.split(',').map(Number);
        console.log('Using first stop location:', currentLat, currentLng);
      } else {
        currentLat = -25.9692;
        currentLng = 32.5732;
        console.log('Using default location:', currentLat, currentLng);
      }
    }

    // Get route coordinates from bus's individual route or via's default route
    const routeCoords = transporte.routePath
      ? transporte.routePath.split(';').map((coord) => {
          const [lng, lat] = coord.split(',').map(Number);
          return [lng, lat];
        })
      : transporte.via.geoLocationPath.split(';').map((coord) => {
          const [lng, lat] = coord.split(',').map(Number);
          return [lng, lat];
        });

    console.log('Route coords count:', routeCoords.length);

    // Get stops
    const stops = transporte.via.paragens.map((vp) => {
      const [lat, lng] = vp.paragem.geoLocation.split(',').map(Number);
      return {
        id: vp.paragem.id,
        nome: vp.paragem.nome,
        latitude: lat,
        longitude: lng,
        isTerminal: vp.terminalBoolean,
      };
    });

    console.log('Stops count:', stops.length);

    const response = {
      id: transporte.id,
      matricula: transporte.matricula,
      via: transporte.via.nome,
      viaId: transporte.via.id,
      direcao: `${transporte.via.terminalPartida} → ${transporte.via.terminalChegada}`,
      velocidade: 45,
      latitude: currentLat,
      longitude: currentLng,
      status: 'Em Circulação',
      routeCoords,
      stops,
    };

    console.log('Returning bus data for:', response.matricula);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching bus:', error);
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
