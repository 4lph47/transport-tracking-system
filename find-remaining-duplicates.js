require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findRemainingDuplicates() {
  console.log('🔍 Checking for remaining duplicates...\n');

  try {
    // Get all buses with their routes
    const allBuses = await prisma.transporte.findMany({
      select: {
        id: true,
        matricula: true,
        codigo: true,
        viaId: true,
        routePath: true,
        currGeoLocation: true,
        via: {
          select: {
            codigo: true,
            nome: true,
            geoLocationPath: true
          }
        }
      },
      orderBy: {
        codigo: 'asc'
      }
    });

    console.log(`📊 Total buses: ${allBuses.length}\n`);

    // Group by routePath
    const routeGroups = new Map();
    
    allBuses.forEach(bus => {
      const route = bus.routePath || bus.via.geoLocationPath || 'NO_ROUTE';
      
      if (!routeGroups.has(route)) {
        routeGroups.set(route, []);
      }
      routeGroups.get(route).push(bus);
    });

    // Find routes with duplicates
    const duplicateRoutes = Array.from(routeGroups.entries())
      .filter(([route, buses]) => buses.length > 1)
      .sort((a, b) => b[1].length - a[1].length);

    if (duplicateRoutes.length === 0) {
      console.log('✅ No duplicates found! All buses have unique routes.\n');
      return;
    }

    console.log(`❌ Found ${duplicateRoutes.length} routes with duplicates:\n`);

    duplicateRoutes.forEach(([route, buses]) => {
      console.log(`\n📍 Route with ${buses.length} buses:`);
      console.log(`   Via: ${buses[0].via.nome} (${buses[0].via.codigo})`);
      console.log(`   ViaId: ${buses[0].viaId}`);
      console.log(`   Buses:`);
      buses.forEach(b => {
        console.log(`      - ${b.matricula.padEnd(25)} (codigo: ${b.codigo}, id: ${b.id})`);
      });
      
      // Show which to keep and which to delete
      console.log(`   💡 Keep: ${buses[0].matricula} (lowest codigo)`);
      console.log(`   🗑️  Delete: ${buses.slice(1).map(b => b.matricula).join(', ')}`);
    });

    // Calculate total to delete
    const totalToDelete = duplicateRoutes.reduce((sum, [route, buses]) => sum + buses.length - 1, 0);
    console.log(`\n\n📊 Summary:`);
    console.log(`   Routes with duplicates: ${duplicateRoutes.length}`);
    console.log(`   Buses to delete: ${totalToDelete}`);
    console.log(`   Final count after cleanup: ${allBuses.length - totalToDelete}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findRemainingDuplicates();
