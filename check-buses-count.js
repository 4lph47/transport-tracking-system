require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBusesCount() {
  try {
    const total = await prisma.transporte.count();
    console.log('📊 Total de transportes no banco:', total);
    
    // Count by type
    const forwardBuses = await prisma.transporte.count({
      where: {
        matricula: {
          not: {
            contains: '-R'
          }
        }
      }
    });
    
    const backwardBuses = await prisma.transporte.count({
      where: {
        matricula: {
          contains: '-R'
        }
      }
    });
    
    console.log('   - Autocarros normais (forward):', forwardBuses);
    console.log('   - Autocarros reversos (backward):', backwardBuses);
    
    // Count vias
    const totalVias = await prisma.via.count();
    console.log('\n📊 Total de vias:', totalVias);
    
    // Average buses per via
    console.log('   - Média de autocarros por via:', (total / totalVias).toFixed(1));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBusesCount();
