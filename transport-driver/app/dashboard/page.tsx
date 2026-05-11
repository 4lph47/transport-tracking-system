"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Motorista {
  id: string;
  nome: string;
  bi: string;
  transporte: {
    id: string;
    matricula: string;
    modelo: string;
    marca: string;
  };
  via: {
    id: string;
    nome: string;
    codigo: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [motorista, setMotorista] = useState<Motorista | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [speed, setSpeed] = useState(0);
  const [passengers, setPassengers] = useState(0);
  const [tripActive, setTripActive] = useState(false);

  useEffect(() => {
    const motoristaData = localStorage.getItem("motorista");
    if (!motoristaData) {
      router.push("/");
      return;
    }

    setMotorista(JSON.parse(motoristaData));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setCurrentLocation({ lat: -25.9692, lng: 32.5732 });
        }
      );
    } else {
      setCurrentLocation({ lat: -25.9692, lng: 32.5732 });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("motorista");
    router.push("/");
  };

  const toggleOnline = () => {
    setIsOnline(!isOnline);
  };

  const updatePassengers = (change: number) => {
    setPassengers(Math.max(0, Math.min(15, passengers + change)));
  };

  const toggleTrip = () => {
    if (!tripActive) {
      if (confirm("Iniciar viagem?")) {
        setTripActive(true);
        setIsOnline(true);
      }
    } else {
      if (confirm("Finalizar viagem?")) {
        setTripActive(false);
        setPassengers(0);
      }
    }
  };

  if (!motorista) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TransportMZ Driver</h1>
                <p className="text-xs text-gray-500">Portal do Motorista</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Olá, {motorista.nome}!</h2>
              <p className="text-blue-100">
                {motorista.transporte.marca} {motorista.transporte.modelo} • {motorista.transporte.matricula}
              </p>
              <p className="text-blue-100 text-sm mt-1">
                Rota: {motorista.via.nome}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">👨‍✈️</div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                isOnline ? 'bg-green-500' : 'bg-gray-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-gray-300'}`}></span>
                {isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        </div>

        {/* Status Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Status de Serviço</h3>
              <p className="text-sm text-gray-600">
                {isOnline ? 'Você está em serviço e visível para passageiros' : 'Você está offline'}
              </p>
            </div>
            <button
              onClick={toggleOnline}
              className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                isOnline ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                  isOnline ? 'translate-x-12' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Trip Control */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Controle de Viagem</h3>
              <p className="text-sm text-gray-600">
                {tripActive ? 'Viagem em andamento' : 'Nenhuma viagem ativa'}
              </p>
            </div>
            <button
              onClick={toggleTrip}
              disabled={!isOnline && !tripActive}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                tripActive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {tripActive ? '⏹️ Finalizar Viagem' : '▶️ Iniciar Viagem'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📍</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentLocation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {currentLocation ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Localização GPS</h3>
            <p className="text-lg font-bold text-gray-900">
              {currentLocation ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 'N/A'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Velocidade</h3>
            <p className="text-2xl font-bold text-gray-900">{speed} km/h</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Passageiros</h3>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold text-gray-900">{passengers}/15</p>
              <div className="flex gap-2">
                <button
                  onClick={() => updatePassengers(-1)}
                  disabled={!tripActive}
                  className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <button
                  onClick={() => updatePassengers(1)}
                  disabled={!tripActive}
                  className="w-8 h-8 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/route"
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="text-3xl">🗺️</span>
              <span className="text-sm font-medium text-gray-900">Ver Rota</span>
            </Link>
            
            <Link
              href="/stats"
              className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <span className="text-3xl">📊</span>
              <span className="text-sm font-medium text-gray-900">Estatísticas</span>
            </Link>
            
            <Link
              href="/report"
              className="flex flex-col items-center gap-2 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <span className="text-3xl">⚠️</span>
              <span className="text-sm font-medium text-gray-900">Reportar</span>
            </Link>
            
            <Link
              href="/support"
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <span className="text-3xl">💬</span>
              <span className="text-sm font-medium text-gray-900">Suporte</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {tripActive ? (
              <>
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg text-white">▶️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Viagem em Andamento</p>
                    <p className="text-xs text-gray-600">{motorista.via.nome}</p>
                    <p className="text-xs text-gray-400 mt-1">Agora</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🚏</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Paragem Xipamanine</p>
                    <p className="text-xs text-gray-600">3 passageiros embarcaram</p>
                    <p className="text-xs text-gray-400 mt-1">Há 5 minutos</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✅</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Viagem Concluída</p>
                    <p className="text-xs text-gray-600">Terminal Zimpeto → Terminal Baixa</p>
                    <p className="text-xs text-gray-400 mt-1">Há 15 minutos</p>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🔔</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Notificação do Sistema</p>
                <p className="text-xs text-gray-600">Manutenção programada para amanhã</p>
                <p className="text-xs text-gray-400 mt-1">Há 1 hora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
