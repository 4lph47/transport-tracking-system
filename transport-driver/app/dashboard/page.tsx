"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MotoristaData {
  id: string;
  nome: string;
  bi: string;
  telefone: string;
  email: string;
  foto?: string;
  status: string;
  categoriaCarta: string;
  experienciaAnos: number;
  transporte?: {
    id: string;
    matricula: string;
    marca: string;
    modelo: string;
    cor: string;
    lotacao: number;
    currGeoLocation?: string;
  };
  via?: {
    id: string;
    nome: string;
    codigo: string;
    terminalPartida: string;
    terminalChegada: string;
    geoLocationPath: string;
    municipio: string;
    paragens: Array<{
      id: string;
      nome: string;
      geoLocation: string;
      isTerminal: boolean;
    }>;
  };
}

interface ClientInfo {
  total: number;
  stops: Array<{
    stopName: string;
    clients: number;
    money: number;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [motorista, setMotorista] = useState<MotoristaData | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [clients, setClients] = useState(0);
  const [rideTime, setRideTime] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showClientsModal, setShowClientsModal] = useState(false);
  const [showRideInfoModal, setShowRideInfoModal] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const busMarkerRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);

  // Calculate client info based on current clients and stops
  const clientInfo: ClientInfo = {
    total: clients,
    stops: motorista?.via?.paragens.map((stop, idx) => ({
      stopName: stop.nome,
      clients: Math.floor(clients * (idx + 1) / (motorista?.via?.paragens.length || 1)),
      money: Math.floor(clients * (idx + 1) / (motorista?.via?.paragens.length || 1) * 15) // 15 MT per client
    })) || []
  };

  useEffect(() => {
    const stored = localStorage.getItem('motorista');
    if (!stored) {
      router.push('/');
      return;
    }

    const data = JSON.parse(stored);
    setMotorista(data);

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setSpeed(Math.round((position.coords.speed || 0) * 3.6)); // Convert m/s to km/h
        },
        () => {},
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [router]);

  // Initialize map
  useEffect(() => {
    if (!motorista || !mapRef.current || mapInstanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [32.5732, -25.9692],
      zoom: 17,
      pitch: 60,
      bearing: 0,
    });

    mapInstanceRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      // Add 3D buildings
      if (!map.getLayer('3d-buildings')) {
        map.addSource('openmaptiles', {
          type: 'vector',
          url: 'https://tiles.openfreemap.org/planet'
        });

        map.addLayer({
          id: '3d-buildings',
          source: 'openmaptiles',
          'source-layer': 'building',
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': '#d1d5db',
            'fill-extrusion-height': ['case', ['has', 'render_height'], ['get', 'render_height'], 5],
            'fill-extrusion-base': ['case', ['has', 'render_min_height'], ['get', 'render_min_height'], 0],
            'fill-extrusion-opacity': 0.8
          }
        });
      }

      // Draw route if available
      if (motorista.via?.geoLocationPath) {
        const coords = motorista.via.geoLocationPath.split(';').map(c => {
          const [lng, lat] = c.split(',').map(Number);
          return [lng, lat] as [number, number];
        });

        if (coords.length > 0) {
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: coords }
            }
          });

          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#374151", "line-width": 5, "line-opacity": 0.8 }
          });

          // Add stops markers
          motorista.via.paragens.forEach((stop, idx) => {
            const [lng, lat] = stop.geoLocation.split(',').map(Number);
            const el = document.createElement('div');
            el.style.cssText = `
              width: ${stop.isTerminal ? '20px' : '14px'};
              height: ${stop.isTerminal ? '20px' : '14px'};
              background: ${stop.isTerminal ? '#000' : '#666'};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            `;
            new maplibregl.Marker({ element: el })
              .setLngLat([lng, lat])
              .addTo(map);
          });

          // Add bus marker
          const startPos = coords[0];
          const busEl = document.createElement('div');
          busEl.innerHTML = `
            <svg width="40" height="48" viewBox="0 0 48 56" style="display: block; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">
              <defs>
                <linearGradient id="busGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#374151"/>
                  <stop offset="100%" style="stop-color:#111827"/>
                </linearGradient>
              </defs>
              <ellipse cx="24" cy="52" rx="18" ry="3" fill="#000" opacity="0.3"/>
              <rect x="8" y="16" width="32" height="34" rx="2" fill="url(#busGrad)" stroke="#000" stroke-width="1"/>
              <rect x="10" y="12" width="28" height="5" rx="1" fill="#000" stroke="#000"/>
              <rect x="12" y="18" width="24" height="8" rx="1" fill="#fff" opacity="0.5"/>
              <circle cx="16" cy="14" r="3" fill="#fff" stroke="#000" stroke-width="1"/>
              <circle cx="32" cy="14" r="3" fill="#fff" stroke="#000" stroke-width="1"/>
              <circle cx="14" cy="50" r="4" fill="#000"/>
              <circle cx="34" cy="50" r="4" fill="#000"/>
            </svg>
          `;

          busMarkerRef.current = new maplibregl.Marker({ element: busEl, anchor: 'center', rotationAlignment: 'map', pitchAlignment: 'map' })
            .setLngLat(startPos)
            .addTo(map);

          map.flyTo({ center: startPos, zoom: 17, pitch: 60, duration: 1500 });

          // Start animation if active
          if (isActive) {
            animateBus(coords);
          }
        }
      }
    });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [motorista]);

  // Update animation when active state changes
  useEffect(() => {
    if (!mapInstanceRef.current || !motorista?.via?.geoLocationPath || !busMarkerRef.current) return;

    const driver = motorista;
    if (!driver?.via) return;

    const coords = driver.via.geoLocationPath.split(';').map(c => {
      const [lng, lat] = c.split(',').map(Number);
      return [lng, lat] as [number, number];
    });

    if (isActive) {
      animateBus(coords);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, [isActive]);

  function animateBus(coords: [number, number][]) {
    let currentIndex = 0;
    let progress = 0;
    const targetSpeed = 45;

    function calculateDistance(start: [number, number], end: [number, number]): number {
      const R = 6371000;
      const lat1 = start[1] * Math.PI / 180;
      const lat2 = end[1] * Math.PI / 180;
      const deltaLat = (end[1] - start[1]) * Math.PI / 180;
      const deltaLng = (end[0] - start[0]) * Math.PI / 180;
      const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function animate() {
      if (currentIndex >= coords.length - 1) {
        currentIndex = 0;
        progress = 0;
      }

      const start = coords[currentIndex];
      const end = coords[currentIndex + 1];
      const segmentDist = calculateDistance(start, end);
      const speedMps = (targetSpeed * 1000) / 3600;
      const progressInc = segmentDist > 0 ? speedMps / segmentDist : 0;

      const lng = start[0] + (end[0] - start[0]) * progress;
      const lat = start[1] + (end[1] - start[1]) * progress;

      busMarkerRef.current?.setLngLat([lng, lat]);
      setSpeed(targetSpeed);

      progress += progressInc;
      if (progress >= 1) {
        progress = 0;
        currentIndex++;
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();
  }

  // Update ride time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setRideTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleLogout = () => {
    localStorage.removeItem('motorista');
    router.push('/');
  };

  const toggleRide = () => {
    if (!isActive) {
      if (confirm('Iniciar viagem?')) {
        setIsActive(true);
      }
    } else {
      if (confirm('Finalizar viagem?')) {
        setIsActive(false);
        setClients(0);
        setRideTime(0);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!motorista) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-500 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Full Screen Map */}
      <div ref={mapRef} className="absolute inset-0" />

      {/* Top Left - Driver Info */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-3 bg-gray-900/90 backdrop-blur-sm p-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors"
        >
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            {motorista.foto ? (
              <img src={motorista.foto} alt={motorista.nome} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">{motorista.nome}</p>
            <p className="text-gray-400 text-xs">{motorista.transporte?.matricula || 'Sem veiculo'}</p>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${showInfo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Info Panel */}
        {showInfo && (
          <div className="mt-2 bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-700 p-4 w-64">
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-xs">BI</p>
                <p className="text-white text-sm">{motorista.bi}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Telefone</p>
                <p className="text-white text-sm">{motorista.telefone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Email</p>
                <p className="text-white text-sm">{motorista.email}</p>
              </div>
              {motorista.transporte && (
                <>
                  <div>
                    <p className="text-gray-400 text-xs">Veiculo</p>
                    <p className="text-white text-sm">{motorista.transporte.marca} {motorista.transporte.modelo}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Matricula</p>
                    <p className="text-white text-sm">{motorista.transporte.matricula}</p>
                  </div>
                </>
              )}
              {motorista.via && (
                <div>
                  <p className="text-gray-400 text-xs">Rota</p>
                  <p className="text-white text-sm">{motorista.via.nome}</p>
                </div>
              )}
              <div className="pt-2 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Right - Ride Control */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleRide}
          className={`px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg ${
            isActive
              ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
              : 'bg-white hover:bg-gray-100 text-gray-900'
          }`}
        >
          {isActive ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Finalizar
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Iniciar
            </span>
          )}
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="flex items-center justify-around">
          {/* Speed */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white">{speed}</p>
            <p className="text-gray-400 text-xs">km/h</p>
          </div>

          {/* Clients Following */}
          <button
            onClick={() => setShowClientsModal(true)}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-white">{clients}</span>
            </div>
            <p className="text-gray-400 text-xs">Seguidores</p>
          </button>

          {/* Ride Time */}
          <button
            onClick={() => setShowRideInfoModal(true)}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-white">{formatTime(rideTime)}</p>
          </button>
        </div>
      </div>

      {/* Clients Modal */}
      {showClientsModal && (
        <div className="fixed inset-0 bg-black/70 z-30 flex items-end">
          <div className="bg-gray-900 w-full rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Passageiros por Paragem</h2>
              <button onClick={() => setShowClientsModal(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {clientInfo.stops.map((stop, idx) => (
                <div key={idx} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{stop.stopName}</p>
                    <p className="text-gray-400 text-sm">{stop.clients} passageiros</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{stop.money}</p>
                    <p className="text-gray-400 text-xs">MT</p>
                  </div>
                </div>
              ))}
              <div className="bg-gray-700 rounded-xl p-4 flex items-center justify-between">
                <p className="text-white font-bold">Total</p>
                <p className="text-2xl font-bold text-white">
                  {clientInfo.stops.reduce((sum, s) => sum + s.money, 0)} MT
                </p>
              </div>
            </div>

            {/* Client controls */}
            {isActive && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => setClients(Math.max(0, clients - 1))}
                  className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full text-white text-xl font-bold"
                >
                  -
                </button>
                <span className="text-white text-xl font-bold w-12 text-center">{clients}</span>
                <button
                  onClick={() => setClients(clients + 1)}
                  className="w-12 h-12 bg-white hover:bg-gray-200 rounded-full text-gray-900 text-xl font-bold"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ride Info Modal */}
      {showRideInfoModal && (
        <div className="fixed inset-0 bg-black/70 z-30 flex items-end">
          <div className="bg-gray-900 w-full rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Informacoes da Viagem</h2>
              <button onClick={() => setShowRideInfoModal(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Tempo Total</span>
                  <span className="text-2xl font-bold text-white">{formatTime(rideTime)}</span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Velocidade Media</span>
                  <span className="text-2xl font-bold text-white">{speed} km/h</span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Distancia Estimada</span>
                  <span className="text-2xl font-bold text-white">
                    {motorista.via?.geoLocationPath ? (
                      Math.round(motorista.via.geoLocationPath.split(';').length * 0.05)
                    ) : 0} km
                  </span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Combustivel Estimado</span>
                  <span className="text-2xl font-bold text-white">
                    ~{Math.round((motorista.via?.geoLocationPath?.split(';').length || 0) * 0.05 * 0.15)} L
                  </span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Receita Estimada</span>
                  <span className="text-2xl font-bold text-white">
                    {clientInfo.stops.reduce((sum, s) => sum + s.money, 0)} MT
                  </span>
                </div>
              </div>

              {motorista.transporte && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Lotacao</span>
                    <span className="text-2xl font-bold text-white">{motorista.transporte.lotacao} lugares</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}