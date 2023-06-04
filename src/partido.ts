export interface Partido {
  liga: string;
  timestamp: number;
  jugador1: string;
  score1?: number;
  score2?: number;
  jugador2: string;
  html: string;
}
