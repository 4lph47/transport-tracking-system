"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Stop {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  isTerminal: boolean;
}

interface TransportMapProps {
  transportLat: number;
  transportLng: number;
  paragemLat: number;
  paragemLng: number;
  transportMatricula: string;
  routeCoords?: [number, number][];
  stops?: Stop[];
  paragemNome?: string;
}

export default function TransportMap({
  transportLat,
  transportLng,
  paragemLat,
  paragemLng,
  transportMatricula,
  routeCoords,
  stops,
  paragemNome,
}: TransportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const transportMarkerRef = useRef<maplibregl.Marker | null>(null);
  const paragemMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Inicializar mapa MapLibre
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty', // OpenFreeMap with building data
      center: [transportLng, transportLat],
      zoom: 14,
      pitch: 60, // Tilt the map for 3D perspective
      bearing: 0, // Will be updated based on vehicle direction
    });

    mapInstanceRef.current = map;

    // Adicionar controles de navegação
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Resize map when maximized state changes
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }

    // Aguardar o mapa carregar
    map.on("load", () => {

      // Add 3D building extrusions
      // Check if buildings layer exists, if not add it
      if (!map.getLayer('building')) {
        const layers = map.getStyle().layers;
        let firstSymbolId;
        for (const layer of layers) {
          if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
            break;
          }
        }

        // Add building source if it doesn't exist
        if (!map.getSource('openmaptiles')) {
          map.addSource('openmaptiles', {
            'type': 'vector',
            'url': 'https://tiles.openfreemap.org/planet'
          });
        }

        // Add 3D buildings layer
        map.addLayer(
          {
            'id': '3d-buildings',
            'source': 'openmaptiles',
            'source-layer': 'building',
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#d1d5db',
              'fill-extrusion-height': [
                'case',
                ['has', 'render_height'],
                ['get', 'render_height'],
                5
              ],
              'fill-extrusion-base': [
                'case',
                ['has', 'render_min_height'],
                ['get', 'render_min_height'],
                0
              ],
              'fill-extrusion-opacity': 0.8
            }
          },
          firstSymbolId
        );
      }

      // Criar rota completa
      // Use provided routeCoords if available, otherwise use default coordinates
      const defaultRouteCoordinates: [number, number][] = routeCoords || [
        [32.5892, -25.9692], // START
        [32.5932, -25.9632], // Stop 1
        [32.5972, -25.9572], // Stop 2
        [32.6012, -25.9512], // Stop 3
        [32.6052, -25.9452], // END
      ];

      console.log('Route coordinates:', defaultRouteCoordinates);
      
      // Always use OSRM to ensure routes follow roads
      if (routeCoords && routeCoords.length > 1) {
        console.log('Using OSRM to refine provided route coordinates');
        
        // Use OSRM to get road-following route
        const waypointsString = routeCoords.map(w => `${w[0]},${w[1]}`).join(';');
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${waypointsString}?overview=full&geometries=geojson&steps=true`;

        fetch(osrmUrl)
          .then(response => {
            console.log('OSRM response status:', response.status);
            if (!response.ok) {
              throw new Error(`OSRM returned status ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('OSRM response data:', data);
            
            if (data.code !== 'Ok') {
              console.warn('OSRM code not OK:', data.code, data.message);
              drawRoute(routeCoords);
              return;
            }
            
            if (!data.routes || data.routes.length === 0) {
              console.warn('No routes returned from OSRM');
              drawRoute(routeCoords);
              return;
            }

            // Use the route geometry from OSRM (follows roads)
            const routeGeometry = data.routes[0].geometry;
            console.log('✓ OSRM route received with', routeGeometry.coordinates.length, 'coordinates');
            
            drawRoute(routeGeometry.coordinates);
          })
          .catch(error => {
            console.error('❌ Error fetching route from OSRM:', error);
            console.log('Using provided coordinates as fallback');
            drawRoute(routeCoords);
          });
      } else {
        // No route provided, use default
        console.log('No route provided, using default coordinates');
        drawRoute(defaultRouteCoordinates);
      }

      // Function to draw route
      function drawRoute(coordinates: [number, number][]) {
        console.log('Drawing route with', coordinates.length, 'coordinates');
        
        // Desenhar rota
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinates,
            },
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#2563eb",
            "line-width": 5,
            "line-opacity": 0.7,
          },
        });

        console.log('Route layer added, adding stops and bus');
        
        // Continue with stops and bus
        addStopsAndBus(coordinates);
      }

      // Function to add stops and bus
      function addStopsAndBus(routeCoords: [number, number][]) {
      // Adicionar paragens
      // Use provided stops if available, otherwise create default stops
      const defaultStops = [
        { position: routeCoords[0], title: "Terminal Início", isTerminal: true },
        { position: routeCoords[Math.floor(routeCoords.length * 0.25)], title: "Paragem 1", isTerminal: false },
        { position: routeCoords[Math.floor(routeCoords.length * 0.5)], title: "Paragem 2", isTerminal: false },
        { position: routeCoords[Math.floor(routeCoords.length * 0.75)], title: "Paragem 3", isTerminal: false },
        { position: routeCoords[routeCoords.length - 1], title: "Terminal Fim", isTerminal: true },
      ];

      let stopsToRender;
      
      if (stops && stops.length > 0) {
        // Snap stops to the nearest point on the route
        stopsToRender = stops.map(stop => {
          const stopLngLat: [number, number] = [stop.longitude, stop.latitude];
          
          // Find the closest point on the route
          let minDistance = Infinity;
          let closestPoint = stopLngLat;
          
          routeCoords.forEach(coord => {
            const dx = coord[0] - stopLngLat[0];
            const dy = coord[1] - stopLngLat[1];
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
              minDistance = distance;
              closestPoint = coord;
            }
          });
          
          // If the stop is very far from the route (>0.01 degrees ~1km), use original position
          // Otherwise, snap to the route
          const useSnapped = minDistance < 0.01;
          
          return {
            position: useSnapped ? closestPoint : stopLngLat,
            title: stop.nome,
            isTerminal: stop.isTerminal,
          };
        });
      } else {
        stopsToRender = defaultStops;
      }

      stopsToRender.forEach((stop) => {
        const el = document.createElement("div");
        el.style.cssText = `
          width: ${stop.isTerminal ? "18px" : "14px"};
          height: ${stop.isTerminal ? "18px" : "14px"};
          background: ${stop.isTerminal ? "#1f2937" : "#6b7280"};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
        `;

        new maplibregl.Marker({ element: el })
          .setLngLat(stop.position as [number, number])
          .setPopup(
            new maplibregl.Popup({ offset: 15 }).setHTML(`<strong>${stop.title}</strong>`)
          )
          .addTo(map);
      });

      // Calculate bearing between two points
      function calculateBearing(start: [number, number], end: [number, number]): number {
        const startLat = start[1] * Math.PI / 180;
        const startLng = start[0] * Math.PI / 180;
        const endLat = end[1] * Math.PI / 180;
        const endLng = end[0] * Math.PI / 180;

        const dLng = endLng - startLng;

        const y = Math.sin(dLng) * Math.cos(endLat);
        const x = Math.cos(startLat) * Math.sin(endLat) -
                  Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

        const bearing = Math.atan2(y, x) * 180 / Math.PI;
        return (bearing + 360) % 360; // Normalize to 0-360
      }

      // Start position on the route
      const startPos = routeCoords[0];
      const nextPos = routeCoords[1];
      const initialBearing = calculateBearing(startPos, nextPos);

      // Create 3D bus that tilts with the map
      const arrowElement = document.createElement('div');
      arrowElement.innerHTML = `
        <svg width="48" height="56" viewBox="0 0 48 56" style="display: block; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#3b82f6"/>
              <stop offset="100%" style="stop-color:#1e40af"/>
            </linearGradient>
          </defs>
          
          <!-- Shadow -->
          <ellipse cx="24" cy="52" rx="18" ry="3" fill="#000000" opacity="0.3"/>
          
          <!-- Main bus body -->
          <rect x="8" y="16" width="32" height="34" rx="2" fill="url(#bodyGrad)" stroke="#0a1f5c" stroke-width="1.5"/>
          
          <!-- Roof -->
          <rect x="10" y="12" width="28" height="5" rx="1" fill="#1e3a8a" stroke="#0a1f5c" stroke-width="1"/>
          
          <!-- Front windshield -->
          <rect x="12" y="18" width="24" height="8" rx="1" fill="#e0f2fe" opacity="0.8" stroke="#1e40af" stroke-width="0.5"/>
          
          <!-- Side windows (left) -->
          <rect x="10" y="28" width="6" height="6" rx="0.5" fill="#dbeafe" opacity="0.7"/>
          <rect x="10" y="36" width="6" height="6" rx="0.5" fill="#dbeafe" opacity="0.7"/>
          <rect x="10" y="44" width="6" height="6" rx="0.5" fill="#dbeafe" opacity="0.7"/>
          
          <!-- Side windows (right) -->
          <rect x="32" y="28" width="6" height="6" rx="0.5" fill="#bfdbfe" opacity="0.6"/>
          <rect x="32" y="36" width="6" height="6" rx="0.5" fill="#bfdbfe" opacity="0.6"/>
          <rect x="32" y="44" width="6" height="6" rx="0.5" fill="#bfdbfe" opacity="0.6"/>
          
          <!-- Front headlights (YELLOW - these point forward) -->
          <circle cx="16" cy="14" r="3" fill="#fef08a" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="16" cy="14" r="1.8" fill="#fde047"/>
          
          <circle cx="32" cy="14" r="3" fill="#fef08a" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="32" cy="14" r="1.8" fill="#fde047"/>
          
          <!-- Wheels -->
          <circle cx="14" cy="50" r="4" fill="#1f2937" stroke="#000" stroke-width="1"/>
          <circle cx="14" cy="50" r="2.5" fill="#4b5563"/>
          <circle cx="14" cy="50" r="1" fill="#6b7280"/>
          
          <circle cx="34" cy="50" r="4" fill="#1f2937" stroke="#000" stroke-width="1"/>
          <circle cx="34" cy="50" r="2.5" fill="#4b5563"/>
          <circle cx="34" cy="50" r="1" fill="#6b7280"/>
          
          <!-- Rear lights (red) -->
          <circle cx="16" cy="51" r="1.5" fill="#ef4444" opacity="0.9"/>
          <circle cx="32" cy="51" r="1.5" fill="#ef4444" opacity="0.9"/>
          
          <!-- Door -->
          <rect x="9" y="34" width="3" height="12" rx="0.5" fill="#1e3a8a" stroke="#0a1f5c" stroke-width="0.5"/>
          
          <!-- 3D effect highlights -->
          <rect x="9" y="17" width="2" height="32" fill="#60a5fa" opacity="0.3"/>
          <rect x="37" y="17" width="2" height="32" fill="#1e3a8a" opacity="0.4"/>
        </svg>
      `;

      // Adicionar marcador do transporte
      const transportMarker = new maplibregl.Marker({ 
        element: arrowElement,
        anchor: 'center',
        rotationAlignment: 'map',
        pitchAlignment: 'map'  // Changed back to 'map' so it tilts with the map
      })
        .setLngLat(startPos)
        .setRotation(initialBearing)
        .setPopup(
          new maplibregl.Popup({ offset: 30 }).setHTML(
            `<div style="color: #000;"><strong>Transporte ${transportMatricula}</strong><br>Em movimento</div>`
          )
        )
        .addTo(map);

      transportMarkerRef.current = transportMarker;

      // Simulate bus movement along the route
      let currentSegment = 0;
      let progress = 0;
      const busSpeed = 0.002; // Adjust speed
      let currentBearingValue = initialBearing;

      // Animate bus along the route
      function animateBus() {
        if (currentSegment >= routeCoords.length - 1) {
          // Reset to start
          currentSegment = 0;
          progress = 0;
        }

        const start = routeCoords[currentSegment];
        const end = routeCoords[currentSegment + 1];

        // Interpolate position
        const lng = start[0] + (end[0] - start[0]) * progress;
        const lat = start[1] + (end[1] - start[1]) * progress;

        // Calculate bearing for this segment
        const bearing = calculateBearing(start, end);

        // Update rotation using MapLibre's setRotation method
        if (Math.abs(bearing - currentBearingValue) > 2) {
          currentBearingValue = bearing;
          transportMarker.setRotation(bearing);
        }

        // Update bus position
        transportMarker.setLngLat([lng, lat]);

        // Update progress
        progress += busSpeed;

        if (progress >= 1) {
          progress = 0;
          currentSegment++;
        }

        requestAnimationFrame(animateBus);
      }

      // Start animation
      animateBus();

      // Criar elemento HTML para o marcador da paragem
      const paragemEl = document.createElement("div");
      paragemEl.className = "paragem-marker-container";
      paragemEl.innerHTML = `
        <div class="paragem-pulse"></div>
        <div class="paragem-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#dc2626" stroke="white" stroke-width="3"/>
            <circle cx="16" cy="16" r="5" fill="white"/>
          </svg>
        </div>
      `;

      // Adicionar marcador da paragem
      const paragemMarker = new maplibregl.Marker({ element: paragemEl })
        .setLngLat([paragemLng, paragemLat])
        .setPopup(
          new maplibregl.Popup({ offset: 16 }).setHTML(
            `<strong>${paragemNome || "Sua Paragem"}</strong><br><span style="color: black;">Aguardando transporte</span>`
          )
        )
        .addTo(map);

      paragemMarkerRef.current = paragemMarker;

      // Ajustar bounds para mostrar toda a rota
      const bounds = new maplibregl.LngLatBounds();
      routeCoords.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50 });
      } // End of addStopsAndBus function
    }); // End of map.on("load")

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array - only initialize map once

  // Resize map when maximized state changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        mapInstanceRef.current?.resize();
      }, 100);
    }
  }, [isMaximized]);

  // Note: Bus position is now animated along the route automatically
  // If you need to update based on real GPS data, you can modify the animation logic
  // to use transportLat/transportLng props instead of the simulated route animation

  return (
    <>
      <style jsx global>{`
        /* Estilos do mapa MapLibre */
        .maplibregl-map {
          height: 100%;
          width: 100%;
          border-radius: 0.75rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Map container styles */
        .map-container {
          position: relative;
          height: 500px;
          width: 100%;
          border-radius: 0.75rem;
          overflow: hidden;
          background: #f3f4f6;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .map-container.maximized {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          border-radius: 0;
          margin: 0;
        }

        /* Maximize button */
        .map-maximize-btn {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 1000;
          background: white;
          border: none;
          border-radius: 6px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .map-maximize-btn:hover {
          background: #f9fafb;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .map-maximize-btn:active {
          transform: scale(0.95);
        }

        .map-maximize-btn svg {
          width: 20px;
          height: 20px;
          color: #374151;
        }

        /* Marcador da paragem */
        .paragem-marker-container {
          position: relative;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
        }

        .paragem-icon {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          filter: drop-shadow(0 4px 8px rgba(220, 38, 38, 0.4));
        }

        .paragem-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: #dc2626;
          border-radius: 50%;
          opacity: 0.6;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          z-index: 1;
        }

        /* Animações */
        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }

        /* Ajustes para popups do MapLibre */
        .maplibregl-popup-content {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 12px 16px;
          font-size: 14px;
          line-height: 1.5;
        }

        .maplibregl-popup-content strong {
          color: #1f2937;
          font-weight: 600;
        }

        .maplibregl-popup-tip {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Controles do mapa */
        .maplibregl-ctrl-group {
          border-radius: 6px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }

        .maplibregl-ctrl-group button {
          border-bottom: 1px solid #e5e7eb;
        }

        .maplibregl-ctrl-group button:last-child {
          border-bottom: none;
        }
      `}</style>
      <div className={`map-container ${isMaximized ? 'maximized' : ''}`}>
        <button
          className="map-maximize-btn"
          onClick={() => setIsMaximized(!isMaximized)}
          title={isMaximized ? "Minimizar mapa" : "Maximizar mapa"}
        >
          {isMaximized ? (
            // Minimize icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            // Maximize icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>
        <div 
          ref={mapRef} 
          style={{ 
            height: "100%", 
            width: "100%"
          }} 
        />
      </div>
    </>
  );
}
