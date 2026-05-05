require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Remove duplicate buses that have:
 * - Same routePath (same route)
 * - Same currGeoLocation (same position on map)
 * Keep only 1 bus per unique combination of (routePath + currGeoLocation)
 */

async function cleanupByLocationAndRoute() {
  console.log('🧹 Cleaning up buses by location and route...\n');

  try {
    // Get all buses
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
        codigo: 'asc' // Keep buses with lower codigo (original ones)
      }
    });

    console.log(`📊 Total buses: ${allBuses.length}\n`);

    // Group by unique combination of (routePath + currGeoLocation)
    const uniqueMap = new Map();
    const busesToDelete = [];

    allBuses.forEach(bus => {
      const route = bus.routePath || bus.via.geoLocationPath || 'NO_ROUTE';
      const location = bus.currGeoLocation || 'NO_LOCATION';
      
      // Create unique key combining route and location
      const uniqueKey = `${route}|||${location}`;
      
      if (!uniqueMap.has(uniqueKey)) {
        // First bus for this route+location combination - keep it
        uniqueMap.set(uniqueKey, bus);
      } else {
        // Duplicate - mark for deletion
        busesToDelete.push(bus);
      }
    });

    console.log(`✅ Found ${uniqueMap.size} unique buses (route + location)`);
    console.log(`🗑️  Found ${busesToDelete.length} duplicate buses to remove\n`);

    if (busesToDelete.length > 0) {
      // Show some examples
      console.log('📋 Examples of duplicates to remove (first 10):');
      busesToDelete.slice(0, 10).forEach(bus => {
        const kept = Array.from(uniqueMap.values()).find(b => {
          const route1 = b.routePath || b.via.geoLocationPath;
          const route2 = bus.routePath || bus.via.geoLocationPath;
          const loc1 = b.currGeoLocation;
          const loc2 = bus.currGeoLocation;
          return route1 === route2 && loc1 === loc2;
        });
        console.log(`   🗑️  Delete: ${bus.matricula.padEnd(25)} (codigo: ${bus.codigo})`);
        console.log(`      Keep instead: ${kept.matricula.padEnd(25)} (codigo: ${kept.codigo})`);
        console.log(`      Via: ${bus.via.nome}`);
        console.log(`      Location: ${bus.currGeoLocation}\n`);
      });

      // Delete geolocations first
      const busIdsToDelete = busesToDelete.map(b => b.id);
      
      console.log('Step 1: Deleting related geolocations...');
      const geoResult = await prisma.geoLocation.deleteMany({
        where: {
          transporteId: {
            in: busIdsToDelete
          }
        }
      });
      console.log(`   ✅ Deleted ${geoResult.count} geolocations\n`);

      // Delete the buses
      console.log('Step 2: Deleting duplicate buses...');
      const busResult = await prisma.transporte.deleteMany({
        where: {
          id: {
            in: busIdsToDelete
          }
        }
      });
      console.log(`   ✅ Deleted ${busResult.count} buses\n`);
    }

    // Final summary
    const finalCount = await prisma.transporte.count();
    const totalVias = await prisma.via.count();

    console.log('='.repeat(60));
    console.log('✅ CLEANUP COMPLETE');
    console.log('='.repeat(60));
    console.log(`📊 Final state:`);
    console.log(`   Total buses: ${finalCount}`);
    console.log(`   Total vias: ${totalVias}`);
    console.log(`   Unique combinations (route + location): ${uniqueMap.size}`);
    console.log(`   Average buses per via: ${(finalCount / totalVias).toFixed(2)}`);
    console.log('='.repeat(60));

    // Show sample of kept buses
    console.log('\n📋 Sample of kept buses (first 20):');
    const keptBuses = await prisma.transporte.findMany({
      select: {
        matricula: true,
        currGeoLocation: true,
        via: {
          select: {
            nome: true
          }
        }
      },
      orderBy: {
        codigo: 'asc'
      },
      take: 20
    });

    keptBuses.forEach(b => {
      const [lat, lng] = (b.currGeoLocation || '0,0').split(',');
      console.log(`   - ${b.matricula.padEnd(25)} | ${b.via.nome}`);
      console.log(`     Location: ${lat}, ${lng}\n`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupByLocationAndRoute();
