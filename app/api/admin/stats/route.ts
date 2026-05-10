import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [transportes, vias, paragens, motoristas, associations] = await Promise.all([
      prisma.transporte.count(),
      prisma.via.count(),
      prisma.paragem.count(),
      prisma.motorista.count(),
      prisma.viaParagem.count()
    ]);

    return NextResponse.json({
      transportes,
      vias,
      paragens,
      motoristas,
      associations
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return zeros with 200 status if database is unavailable
    return NextResponse.json(
      {
        transportes: 0,
        vias: 0,
        paragens: 0,
        motoristas: 0,
        associations: 0
      },
      { status: 200 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
