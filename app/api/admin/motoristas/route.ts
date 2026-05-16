import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const motoristas = await prisma.motorista.findMany({
      select: {
        id: true,
        nome: true,
        bi: true,
        cartaConducao: true,
        telefone: true,
        email: true,
        dataNascimento: true,
        endereco: true,
        foto: true,
        nacionalidade: true,
        genero: true,
        categoriaCarta: true,
        experienciaAnos: true,
        status: true,
        createdAt: true
      },
      orderBy: { nome: 'asc' }
    });

    const response = NextResponse.json(motoristas);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    console.error('Error fetching motoristas:', error);
    const response = NextResponse.json([]);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } finally {
    await prisma.$disconnect();
  }
}