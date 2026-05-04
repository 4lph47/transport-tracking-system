"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Transport } from "../types";
import LoadingScreen from "../components/LoadingScreen";

interface Municipio {
  id: string;
  nome: string;
  codigo: string;
}

interface Via {
  id: string;
  nome: string;
  codigo: string;
  municipioId: string;
  terminalPartida: string;
  terminalChegada: string;
}

interface Paragem {
  id: string;
  nome: string;
  codigo: string;
  geoLocation: string;
  viaIds: string[];
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedVia, setSelectedVia] = useState("");
  const [selectedParagem, setSelectedParagem] = useState("");
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [vias, setVias] = useState<Via[]>([]);
  const [paragens, setParagens] = useState<Paragem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [utente, setUtente] = useState<{ nome: string; telefone: string } | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const utenteData = localStorage.getItem("utente");
    if (utenteData) {
      setUtente(JSON.parse(utenteData));
    }
  }, []);

  useEffect(() => {
    const municipio = searchParams.get('municipio');
    const via = searchParams.get('via');
    const paragem = searchParams.get('paragem');

    // If no search params, show the search form
    if (!municipio || !via || !paragem) {
      setShowForm(true);
      // Fetch locations data for the form
      fetch('/api/locations')
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setMunicipios(data.municipios || []);
          setVias(data.vias || []);
          setParagens(data.paragens || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching locations:', error);
          setError('Erro ao carregar dados. Por favor, tente novamente.');
          setMunicipios([]);
          setVias([]);
          setParagens([]);
          setLoading(false);
        });
      return;
    }

    setShowForm(false);
    const apiUrl = `/api/buses?paragemId=${paragem}&viaId=${via}`;

    // Fetch buses from API
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          console.error('API returned error:', data.error);
          setTransports([]);
        } else if (data.buses) {
          setTransports(data.buses);
        } else {
          setTransports([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching buses:', error);
        setTransports([]);
        setLoading(false);
      });
  }, [searchParams]);

  const handleSearch = () => {
    if (selectedMunicipio && selectedVia && selectedParagem) {
      router.push(
        `/search?municipio=${selectedMunicipio}&via=${selectedVia}&paragem=${selectedParagem}`
      );
    }
  };

  const handleTrackTransport = (transportId: string) => {
    console.log('Tracking transport with ID:', transportId);
    const paragem = searchParams.get('paragem');
    if (paragem) {
      console.log('With paragem:', paragem);
      router.push(`/track/${transportId}?paragem=${paragem}`);
    } else {
      console.log('Without paragem');
      router.push(`/track/${transportId}`);
    }
  };

  const viasFiltered = vias?.filter((via) => via.municipioId === selectedMunicipio) || [];
  const paragensFiltered = paragens?.filter((paragem) => paragem.viaIds.includes(selectedVia)) || [];

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1: return !!selectedMunicipio;
      case 2: return !!selectedVia;
      case 3: return !!selectedParagem;
      default: return false;
    }
  };

  if (loading) {
    return <LoadingScreen message={showForm ? "Carregando..." : "Procurando transportes"} />;
  }

  // Show search form
  if (showForm) {
    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-sm border border-red-200 p-12 max-w-md mx-4">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Erro ao Carregar</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors group"
              >
                <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium text-lg">Voltar</span>
              </button>

              <div className="flex items-center space-x-3">
                <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              
              {/* Auth Button */}
              {utente ? (
                <button
                  onClick={() => router.push("/my-transports")}
                  className="flex items-center justify-center w-10 h-10 bg-slate-800 text-white rounded-full hover:bg-slate-900 transition-colors font-semibold text-sm shadow-sm"
                  title={utente.nome}
                >
                  {(() => {
                    const names = utente.nome.trim().split(' ');
                    const firstInitial = names[0]?.[0]?.toUpperCase() || '';
                    const lastInitial = names[names.length - 1]?.[0]?.toUpperCase() || '';
                    return firstInitial + lastInitial;
                  })()}
                </button>
              ) : (
                <button
                  onClick={() => router.push("/auth")}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Entrar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 overflow-x-hidden">
          <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step, index) => (
                  <div key={step} className="flex items-center" style={{ flex: index < 2 ? '1 1 0%' : '0 0 auto' }}>
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                      isStepComplete(step) 
                        ? 'bg-slate-700 border-slate-700 text-white shadow-md' 
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}>
                      {isStepComplete(step) ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-base font-bold leading-none">{step}</span>
                      )}
                    </div>
                    {index < 2 && (
                      <div className={`flex-1 h-1 rounded-full transition-all duration-200 ${
                        isStepComplete(step) ? 'bg-slate-700' : 'bg-slate-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-8 overflow-hidden">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Pesquisar Transporte
              </h2>

              <style jsx global>{`
                body {
                  overflow-x: hidden;
                }
                select {
                  max-width: 100% !important;
                  box-sizing: border-box !important;
                }
                select option {
                  max-width: 100% !important;
                  overflow: hidden !important;
                  text-overflow: ellipsis !important;
                  white-space: nowrap !important;
                  padding: 8px 12px !important;
                  box-sizing: border-box !important;
                }
              `}</style>

              <div className="flex flex-col gap-5">
                {/* Município */}
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Município
                  </label>
                  <div className="relative">
                    <select
                      value={selectedMunicipio}
                      onChange={(e) => {
                        setSelectedMunicipio(e.target.value);
                        setSelectedVia("");
                        setSelectedParagem("");
                      }}
                      className="w-full px-4 py-3.5 pr-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white transition-all appearance-none cursor-pointer hover:border-slate-400"
                      style={{ maxWidth: '100%' }}
                    >
                      <option value="">Selecione o município</option>
                      {municipios.map((municipio) => (
                        <option key={municipio.id} value={municipio.id}>
                          {municipio.nome}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Via */}
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Via / Rota
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVia}
                      onChange={(e) => {
                        setSelectedVia(e.target.value);
                        setSelectedParagem("");
                      }}
                      disabled={!selectedMunicipio}
                      className="w-full px-4 py-3.5 pr-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all appearance-none cursor-pointer hover:border-slate-400 disabled:hover:border-slate-300"
                      style={{ maxWidth: '100%' }}
                    >
                      <option value="">Selecione a via</option>
                      {viasFiltered.map((via) => {
                        // Truncate long route names for mobile
                        const maxLength = 35;
                        const displayName = via.nome.length > maxLength 
                          ? via.nome.substring(0, maxLength) + '...'
                          : via.nome;
                        return (
                          <option key={via.id} value={via.id}>
                            {displayName}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Paragem */}
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Sua Paragem
                  </label>
                  <div className="relative">
                    <select
                      value={selectedParagem}
                      onChange={(e) => setSelectedParagem(e.target.value)}
                      disabled={!selectedVia}
                      className="w-full px-4 py-3.5 pr-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all appearance-none cursor-pointer hover:border-slate-400 disabled:hover:border-slate-300"
                      style={{ maxWidth: '100%' }}
                    >
                      <option value="">Selecione a paragem</option>
                      {paragensFiltered.map((paragem) => {
                        // Truncate long stop names for mobile
                        const maxLength = 35;
                        const displayName = paragem.nome.length > maxLength 
                          ? paragem.nome.substring(0, maxLength) + '...'
                          : paragem.nome;
                        return (
                          <option key={paragem.id} value={paragem.id}>
                            {displayName}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={!selectedMunicipio || !selectedVia || !selectedParagem}
                  className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:shadow-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Pesquisar Transportes</span>
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-900">
                  Selecione sua localização para ver transportes disponíveis em tempo real com estimativa de chegada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show search results
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/search")}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors group"
          >
            <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium text-lg">Voltar</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Results Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Transportes Disponíveis
            </h1>
            <p className="text-slate-600">
              {transports.length} transporte{transports.length !== 1 ? "s" : ""} em circulação
            </p>
          </div>

          {transports.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Nenhum transporte disponível
              </h3>
              <p className="text-slate-600">
                Não há transportes circulando nesta via no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transports.map((transport) => (
                <div
                  key={transport.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Transport Info */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="bg-slate-100 rounded-xl p-3">
                          <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">
                            {transport.matricula}
                          </h3>
                          <p className="text-slate-600 font-medium">{transport.via}</p>
                          <p className="text-sm text-slate-500">{transport.direcao}</p>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-slate-600 font-medium">Tempo</span>
                          </div>
                          <p className="text-lg font-bold text-slate-900">
                            {transport.tempoEstimado} min
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span className="text-xs text-slate-600 font-medium">Distância</span>
                          </div>
                          <p className="text-lg font-bold text-slate-900">
                            {transport.distancia > 1000
                              ? `${(transport.distancia / 1000).toFixed(1)} km`
                              : `${transport.distancia} m`}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-xs text-slate-600 font-medium">Velocidade</span>
                          </div>
                          <p className="text-lg font-bold text-slate-900">
                            {transport.velocidade} km/h
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="lg:w-48">
                      <button
                        onClick={() => handleTrackTransport(transport.id)}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>Acompanhar</span>
                      </button>
                      <div className="mt-2 flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-slate-600">Em circulação</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Footer */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-900">
                Clique em "Acompanhar" para ver a localização do transporte no mapa em tempo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SearchContent />
    </Suspense>
  );
}
