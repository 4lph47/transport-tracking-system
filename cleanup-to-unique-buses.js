require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Clean up database to have only 1 bus per unique route
 * Strategy:
 * 1. Remove all reverse buses (-R)
 * 2. Group remaining buses by routePath
 * 3. Keep only 1 bus per unique route (prefer original buses)
 */

async function cleanupToUniqueBuses() {
  console.log('🧹 Cleaning up to unique buses...\n');

  try {
    // Step 1: Remove all reverse buses (and their geolocations)
    console.log('Step 1: Removing reverse buses...');
    
    // First get IDs of reverse buses
    const reverseBuses = await prisma.transporte.findMany({
      where: {
        matricula: {
          contains: '-R'
        }
      },
      select: {
        id: true
      }
    });
    
    const reverseBusIds = reverseBuses.map(b => b.id);
    
    // Delete their geolocations first
    if (reverseBusIds.length > 0) {
      const reverseGeoResult = await prisma.geoLocation.deleteMany({
        where: {
          transporteId: {
            in: reverseBusIds
          }
        }
      });
      console.log(`   ✅ Deleted ${reverseGeoResult.count} geolocations from reverse buses`);
    }
    
    // Then delete the reverse buses
    const reverseResult = await prisma.transporte.deleteMany({
      where: {
        matricula: {
          contains: '-R'
        }
      }
    });
    console.log(`   ✅ Deleted ${reverseResult.count} reverse buses\n`);

    // Step 2: Get all remaining buses
    const allBuses = await prisma.transporte.findMany({
      select: {
        id: true,
        matricula: true,
        codigo: true,
        routePath: true,
        via: {
          select: {
            geoLocationPath: true
          }
        }
      },
      orderBy: {
        codigo: 'asc' // Keep buses with lower codigo (original ones)
      }
    });

    console.log(`Step 2: Analyzing ${allBuses.length} remaining buses...`);

    // Step 3: Group by unique route
    const routeMap = new Map();
    const busesToDelete = [];

    allBuses.forEach(bus => {
      const route = bus.routePath || bus.via.geoLocationPath || 'NO_ROUTE';
      
      if (!routeMap.has(route)) {
        // First bus for this route - keep it
        routeMap.set(route, bus);
      } else {
        // Duplicate route - mark for deletion
        busesToDelete.push(bus.id);
      }
    });

    console.log(`   ✅ Found ${routeMap.size} unique routes`);
    console.log(`   ✅ Found ${busesToDelete.length} duplicate buses to remove\n`);

    // Step 4: Delete duplicate buses (and their geolocations)
    if (busesToDelete.length > 0) {
      console.log('Step 3: Removing duplicate buses...');
      
      // First delete related geolocations
      const geoResult = await prisma.geoLocation.deleteMany({
        where: {
          transporteId: {
            in: busesToDelete
          }
        }
      });
      console.log(`   ✅ Deleted ${geoResult.count} related geolocations`);
      
      // Then delete the buses
      const duplicateResult = await prisma.transporte.deleteMany({
        where: {
          id: {
            in: busesToDelete
          }
        }
      });
      console.log(`   ✅ Deleted ${duplicateResult.count} duplicate buses\n`);
    }

    // Final summary
    const finalCount = await prisma.transporte.count();
    const totalVias = await prisma.via.count();

    console.log('=' .repeat(60));
    console.log('✅ CLEANUP COMPLETE');
    console.log('='.repeat(60));
    console.log(`📊 Final state:`);
    console.log(`   Total buses: ${finalCount}`);
    console.log(`   Total vias: ${totalVias}`);
    console.log(`   Unique routes: ${routeMap.size}`);
    console.log(`   Average buses per via: ${(finalCount / totalVias).toFixed(2)}`);
    console.log('='.repeat(60));

    // Show sample of kept buses
    console.log('\n📋 Sample of kept buses (first 20):');
    const keptBuses = await prisma.transporte.findMany({
      select: {
        matricula: true,
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
      console.log(`   - ${b.matricula.padEnd(25)} | ${b.via.nome}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupToUniqueBuses();
