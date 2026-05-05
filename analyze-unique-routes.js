require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function analyzeUniqueRoutes() {
  console.log('🔍 Analyzing unique routes...\n');

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
      }
    });

    console.log(`📊 Total buses: ${allBuses.length}\n`);

    // Group by routePath
    const routeGroups = new Map();
    
    allBuses.forEach(bus => {
      // Use routePath if exists, otherwise use via's geoLocationPath
      const route = bus.routePath || bus.via.geoLocationPath || 'NO_ROUTE';
      
      if (!routeGroups.has(route)) {
        routeGroups.set(route, []);
      }
      routeGroups.get(route).push(bus);
    });

    console.log(`📊 Unique routes: ${routeGroups.size}\n`);

    // Show routes with multiple buses
    console.log('📋 Routes with multiple buses (duplicates):');
    let totalDuplicates = 0;
    let routesWithDuplicates = 0;

    Array.from(routeGroups.entries())
      .filter(([route, buses]) => buses.length > 1)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 20)
      .forEach(([route, buses]) => {
        routesWithDuplicates++;
        totalDuplicates += buses.length - 1; // -1 because we keep one
        
        console.log(`\n   Route (${buses.length} buses):`);
        console.log(`      Via: ${buses[0].via.nome}`);
        buses.slice(0, 5).forEach(b => {
          console.log(`      - ${b.matricula} (codigo: ${b.codigo})`);
        });
        if (buses.length > 5) {
          console.log(`      ... and ${buses.length - 5} more`);
        }
      });

    console.log(`\n\n📊 Summary:`);
    console.log(`   Total buses: ${allBuses.length}`);
    console.log(`   Unique routes: ${routeGroups.size}`);
    console.log(`   Routes with duplicates: ${routesWithDuplicates}`);
    console.log(`   Duplicate buses (can be removed): ${totalDuplicates}`);
    console.log(`   Buses to keep: ${allBuses.length - totalDuplicates}`);

    // Categorize buses to delete
    console.log(`\n💡 Recommendation:`);
    console.log(`   1. Keep only 1 bus per unique route`);
    console.log(`   2. Delete ${totalDuplicates} duplicate buses`);
    console.log(`   3. Final count: ${allBuses.length - totalDuplicates} buses`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeUniqueRoutes();
