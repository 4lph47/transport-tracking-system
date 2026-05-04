import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paragemId = searchParams.get('paragemId');
    const viaId = searchParams.get('viaId');

    console.log('Fetching buses for paragemId:', paragemId, 'viaId:', viaId);

    // If no parameters, return all buses
    if (!paragemId && !viaId) {
      console.log('Fetching all buses in circulation');
      
      const allTransportes = await prisma.transporte.findMany({
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

      const allBuses = allTransportes.map((transporte) => {
        let currentLat, currentLng;
        
        if (transporte.currGeoLocation) {
          [currentLat, currentLng] = transporte.currGeoLocation.split(',').map(Number);
        } else if (transporte.geoLocations.length > 0) {
          [currentLat, currentLng] = transporte.geoLocations[0].geoLocationTransporte.split(',').map(Number);
        } else {
          const firstStop = transporte.via.paragens[0];
          if (firstStop) {
            [currentLat, currentLng] = firstStop.paragem.geoLocation.split(',').map(Number);
          } else {
            currentLat = -25.9655;
            currentLng = 32.5892;
          }
        }

        let routePath: [number, number][] = [];
        if (transporte.routePath) {
          routePath = transporte.routePath.split(';').map((coord) => {
            const [lng, lat] = coord.split(',').map(Number);
            return [lng, lat];
          });
        } else if (transporte.via.geoLocationPath) {
          routePath = transporte.via.geoLocationPath.split(';').map((coord) => {
            const [lng, lat] = coord.split(',').map(Number);
            return [lng, lat];
          });
        }

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

        return {
          id: transporte.id,
          matricula: transporte.matricula,
          via: transporte.via.nome,
          latitude: currentLat,
          longitude: currentLng,
          status: 'Em Circulação',
          routePath: routePath,
          stops: stops,
        };
      });

      console.log('Found', allBuses.length, 'buses in circulation');

      return NextResponse.json({
        buses: allBuses,
        total: allBuses.length,
      });
    }

    if (!paragemId || !viaId) {
      console.log('Missing required parameters');
      return NextResponse.json(
        { error: 'paragemId and viaId are required' },
        { status: 400 }
      );
    }

    const paragem = await prisma.paragem.findUnique({
      where: { id: paragemId },
    });

    if (!paragem) {
      return NextResponse.json(
        { error: 'Paragem not found' },
        { status: 404 }
      );
    }

    const via = await prisma.via.findUnique({
      where: { id: viaId },
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
    });

    if (!via) {
      return NextResponse.json(
        { error: 'Via not found' },
        { status: 404 }
      );
    }

    const transportes = await prisma.transporte.findMany({
      where: {
        viaId: viaId,
      },
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

    const [paragemLat, paragemLng] = paragem.geoLocation.split(',').map(Number);

    if (transportes.length === 0) {
      console.log('No buses found on this via, returning all buses');
      
      const allTransportes = await prisma.transporte.findMany({
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

      const allBuses = allTransportes.map((transporte) => {
        let currentLat, currentLng;
        
        if (transporte.currGeoLocation) {
          [currentLat, currentLng] = transporte.currGeoLocation.split(',').map(Number);
        } else if (transporte.geoLocations.length > 0) {
          [currentLat, currentLng] = transporte.geoLocations[0].geoLocationTransporte.split(',').map(Number);
        } else {
          const firstStop = transporte.via.paragens[0];
          if (firstStop) {
            [currentLat, currentLng] = firstStop.paragem.geoLocation.split(',').map(Number);
          } else {
            currentLat = -25.9655;
            currentLng = 32.5892;
          }
        }

        const R = 6371e3;
        const φ1 = (currentLat * Math.PI) / 180;
        const φ2 = (paragemLat * Math.PI) / 180;
        const Δφ = ((paragemLat - currentLat) * Math.PI) / 180;
        const Δλ = ((paragemLng - currentLng) * Math.PI) / 180;

        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        let distancia = Math.round(R * c);

        const velocidade = 45;
        let tempoEstimado = Math.ceil(distancia / 1000 / velocidade * 60);
        
        if (distancia < 50) {
          tempoEstimado = 2;
          distancia = 0;
        } else if (tempoEstimado === 0) {
          tempoEstimado = 1;
        }

        let routeCoords: [number, number][] = [];
        if (transporte.via.geoLocationPath) {
          routeCoords = transporte.via.geoLocationPath.split(';').map((coord) => {
            const [lng, lat] = coord.split(',').map(Number);
            return [lng, lat];
          });
        }

        return {
          id: transporte.id,
          matricula: transporte.matricula,
          via: transporte.via.nome,
          viaId: transporte.via.id,
          direcao: `${transporte.via.terminalPartida} → ${transporte.via.terminalChegada}`,
          distancia,
          tempoEstimado,
          velocidade,
          latitude: currentLat,
          longitude: currentLng,
          status: 'Em Circulação',
          routeCoords,
          stops: transporte.via.paragens.map((vp) => {
            const [lat, lng] = vp.paragem.geoLocation.split(',').map(Number);
            return {
              id: vp.paragem.id,
              nome: vp.paragem.nome,
              latitude: lat,
              longitude: lng,
              isTerminal: vp.terminalBoolean,
            };
          }),
        };
      });

      allBuses.sort((a, b) => a.tempoEstimado - b.tempoEstimado);

      return NextResponse.json({
        buses: allBuses,
        paragem: {
          id: paragem.id,
          nome: paragem.nome,
          latitude: paragemLat,
          longitude: paragemLng,
        },
      });
    }

    const busesWithDetails = transportes.map((transporte) => {
      let currentLat, currentLng;
      
      if (transporte.currGeoLocation) {
        [currentLat, currentLng] = transporte.currGeoLocation.split(',').map(Number);
      } else if (transporte.geoLocations.length > 0) {
        [currentLat, currentLng] = transporte.geoLocations[0].geoLocationTransporte.split(',').map(Number);
      } else {
        const firstStop = transporte.via.paragens[0];
        if (firstStop) {
          [currentLat, currentLng] = firstStop.paragem.geoLocation.split(',').map(Number);
        } else {
          currentLat = paragemLat;
          currentLng = paragemLng;
        }
      }

      const R = 6371e3;
      const φ1 = (currentLat * Math.PI) / 180;
      const φ2 = (paragemLat * Math.PI) / 180;
      const Δφ = ((paragemLat - currentLat) * Math.PI) / 180;
      const Δλ = ((paragemLng - currentLng) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      let distancia = Math.round(R * c);

      const velocidade = 45;
      let tempoEstimado = Math.ceil(distancia / 1000 / velocidade * 60);
      
      if (distancia < 50) {
        tempoEstimado = 2;
        distancia = 0;
      } else if (tempoEstimado === 0) {
        tempoEstimado = 1;
      }

      let routeCoords: [number, number][] = [];
      if (transporte.via.geoLocationPath) {
        routeCoords = transporte.via.geoLocationPath.split(';').map((coord) => {
          const [lng, lat] = coord.split(',').map(Number);
          return [lng, lat];
        });
      }

      return {
        id: transporte.id,
        matricula: transporte.matricula,
        via: transporte.via.nome,
        viaId: transporte.via.id,
        direcao: `${transporte.via.terminalPartida} → ${transporte.via.terminalChegada}`,
        distancia,
        tempoEstimado,
        velocidade,
        latitude: currentLat,
        longitude: currentLng,
        status: 'Em Circulação',
        routeCoords,
        stops: transporte.via.paragens.map((vp) => {
          const [lat, lng] = vp.paragem.geoLocation.split(',').map(Number);
          return {
            id: vp.paragem.id,
            nome: vp.paragem.nome,
            latitude: lat,
            longitude: lng,
            isTerminal: vp.terminalBoolean,
          };
        }),
      };
    });

    busesWithDetails.sort((a, b) => a.tempoEstimado - b.tempoEstimado);

    console.log('Found', busesWithDetails.length, 'buses');

    return NextResponse.json({
      buses: busesWithDetails,
      paragem: {
        id: paragem.id,
        nome: paragem.nome,
        latitude: paragemLat,
        longitude: paragemLng,
      },
    });
  } catch (error: any) {
    console.error('Error fetching buses:', error);
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
  }
}
