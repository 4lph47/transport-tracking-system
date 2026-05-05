require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Remove duplicate buses that start at the same initial location
 * Keep only 1 bus per unique starting position (currGeoLocation)
 */

async function cleanupByInitialLocation() {
  console.log('🧹 Cleaning up buses by initial location...\n');

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

    // Group by initial location only
    const locationMap = new Map();
    const busesToDelete = [];

    allBuses.forEach(bus => {
      const location = bus.currGeoLocation || 'NO_LOCATION';
      
      if (!locationMap.has(location)) {
        // First bus at this location - keep it
        locationMap.set(location, [bus]);
      } else {
        // Another bus at same location - mark for deletion
        locationMap.get(location).push(bus);
        busesToDelete.push(bus);
      }
    });

    console.log(`✅ Found ${locationMap.size} unique starting locations`);
    console.log(`🗑️  Found ${busesToDelete.length} duplicate buses to remove\n`);

    if (busesToDelete.length > 0) {
      // Show locations with multiple buses
      console.log('📋 Locations with multiple buses:');
      let count = 0;
      for (const [location, buses] of locationMap.entries()) {
        if (buses.length > 1 && count < 10) {
          console.log(`\n   📍 Location: ${location} (${buses.length} buses)`);
          buses.forEach((bus, idx) => {
            if (idx === 0) {
              console.log(`      ✅ Keep: ${bus.matricula.padEnd(25)} (codigo: ${bus.codigo}) - ${bus.via.nome}`);
            } else {
              console.log(`      🗑️  Delete: ${bus.matricula.padEnd(25)} (codigo: ${bus.codigo}) - ${bus.via.nome}`);
            }
          });
          count++;
        }
      }

      // Delete geolocations first
      const busIdsToDelete = busesToDelete.map(b => b.id);
      
      console.log('\n\nStep 1: Deleting related geolocations...');
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
    console.log(`   Unique starting locations: ${locationMap.size - busesToDelete.length}`);
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
      console.log(`   - ${b.matricula.padEnd(25)} at (${lat}, ${lng})`);
      console.log(`     ${b.via.nome}\n`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupByInitialLocation();
