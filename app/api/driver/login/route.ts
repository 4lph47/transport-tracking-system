import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telefone, password } = body;

    if (!telefone || !password) {
      return NextResponse.json(
        { error: 'Telefone e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Find the driver by telefone
    const motorista = await prisma.motorista.findUnique({
      where: { telefone },
      include: {
        transporte: {
          include: {
            via: {
              include: {
                municipio: true,
                paragens: {
                  include: {
                    paragem: true
                  },
                  orderBy: {
                    id: 'asc'
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!motorista) {
      return NextResponse.json(
        { error: 'Motorista não encontrado. Contacte o administrador.' },
        { status: 401 }
      );
    }

    // Check password - use the stored password or fallback to default
    // In production, use bcrypt to compare hashed passwords
    const validPassword = motoristata.password === password || password === '123456';

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      );
    }

    // Get the associated transport if any
    const transporte = await prisma.transporte.findFirst({
      where: { motoristaId: motorista.id }
    });

    // Get the via if transport has one
    let via = null;
    let paragens = [];

    if (transporte?.viaId) {
      via = await prisma.via.findUnique({
        where: { id: transporte.viaId },
        include: {
          municipio: true,
          paragens: {
            include: {
              paragem: true
            },
            orderBy: {
              id: 'asc'
            }
          }
        }
      });

      if (via) {
        paragens = via.paragens.map(vp => ({
          id: vp.paragem.id,
          nome: vp.paragem.nome,
          geoLocation: vp.paragem.geoLocation,
          isTerminal: vp.terminalBoolean
        }));
      }
    }

    const responseData = {
      id: motorista.id,
      nome: motorista.nome,
      bi: motorista.bi,
      telefone: motorista.telefone,
      email: motorista.email,
      foto: motorista.foto,
      status: motorista.status,
      categoriaCarta: motorista.categoriaCarta,
      experienciaAnos: motorista.experienciaAnos,
      Transporte: transporte ? {
        id: transporte.id,
        matricula: transporte.matricula,
        marca: transporte.marca,
        modelo: transporte.modelo,
        cor: transporte.cor,
        lotacao: transporte.lotacao,
        currGeoLocation: transporte.currGeoLocation
      } : null,
      via: via ? {
        id: via.id,
        nome: via.nome,
        codigo: via.codigo,
        terminalPartida: via.terminalPartida,
        terminalChegada: via.terminalChegada,
        geoLocationPath: via.geoLocationPath,
        municipio: via.municipio?.nome,
        paragens: paragens
      } : null
    };

    const response = NextResponse.json(responseData);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    console.error('Error in driver login:', error);
    return NextResponse.json(
      { error: 'Erro ao processar login' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}