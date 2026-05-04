export interface Transport {
  id: string;
  matricula: string;
  via: string;
  direcao: string;
  distancia: number; // em metros
  tempoEstimado: number; // em minutos
  velocidade: number;
  latitude: number;
  longitude: number;
  status: "Em Circulação" | "Parado";
}

export interface Via {
  id: string;
  nome: string;
  municipio: string;
  preco: number;
}

export interface Paragem {
  id: string;
  nome: string;
  via: string;
  latitude: number;
  longitude: number;
}
