import { create } from 'zustand';
import { useAuthStore } from './authState';
import { WebSocketService } from '../services/websocket';

// Initialize WebSocket service
const wsService = new WebSocketService(process.env.REACT_APP_WS_URL || '/game');

interface GameState {
  currentGame: Game | null;
  games: Game[];
  loading: boolean;
  error: string | null;
  setGames: (games: Game[]) => void;
  updateGame: (game: Game) => void;
  fetchGames: () => Promise<void>;
  fetchGame: (id: string) => Promise<void>;
  updateGameStatus: (id: string, status: Game['gameStatus']) => Promise<void>;
  extractNumber: (id: string) => Promise<void>;
  wsConnected: boolean;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  setWsConnected: (connected: boolean) => void;
  deleteGame: (id: string) => Promise<void>;
  createGame: (gameData: CreateGamePayload) => Promise<void>;
  editGame: (id: string, gameData: Partial<CreateGamePayload>) => Promise<void>;
  deleteGameFromStore: (id: string) => void;
}

// Add this interface to match backend expectations
interface CreateGamePayload {
  name: string;
  description: string;
  variant: IGameVariant;
  maxCards: number;
  allowedUsers: number[];
  cinquinaPrice?: { id: number } | null;
  bingoPrice?: { id: number } | null;
  miniBingoPrice?: { id: number } | null;
}

// Add this interface for API error responses
interface ApiError {
  message: string[] | string;
  error: string;
  statusCode: number;
}

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export enum IGameVariant {
  REDHAT = 'RedHat',
  REDHATITA = 'RedHatIta',
  ITALIAN = 'Italian',
  ENGLISH = 'English',
  NAPOLETANA = 'Napoletana',
  ROMANO = 'Romano',
  MILANESE = 'Milanese',
}
export enum IGameStatus {
  RUNNING = 'Running',
  CREATED = 'Created',
  CLOSED = 'Closed',
}


export interface Game {
  id: string;
  name: string;
  description?: string;
  image?: string;
  prize?: string;
  prizeImage?: string;
  variant: IGameVariant;
  gameStatus: IGameStatus;
  currentNumber?: number;
  allowedUsers: {id: number, username: string, name: string, email: string}[];
  extractedNumbers: number[];
  createTs: string;
  endTs?: string;
  cinquinaNumber?: number;
  bingoNumber?: number;
  miniBingoNumber?: number;
  cinquinaCard?: {
    id: number;
    owner?: {
      name: string;
    };
  };
  bingoCard?: {
    id: number;
    owner?: {
      name: string;
    };
  };
  miniBingoCard?: {
    id: number;
    owner?: {
      name: string;
    };
  };
  cinquinaPrice?: { id: number, name: string };
  bingoPrice?: { id: number, name: string };
  miniBingoPrice?: { id: number, name: string };
  startTs?: string;
  maxCards: number;
  owner: {
    id: number;
    username: string;
    name: string;
    email: string;
  };
}

export const useGameStore = create<GameState>((set) => ({
  currentGame: null,
  games: [],
  loading: false,
  error: null,
  deleteGameFromStore: async (id) => {
    set({ loading: true, error: null });
    try {
      set((state) => ({ games: state.games.filter(game => game.id !== id), loading: false }));
    } catch (error : any) {
      set({ error: error.message, loading: false });
    }
  },
  setGames: (games) => set({ games }),
  updateGame: (updatedGame) =>
    set((state) => ({
      games: state.games.map(game =>
        game.id === updatedGame.id ? updatedGame : game
      ),
      currentGame: state.currentGame?.id === updatedGame.id ? updatedGame : state.currentGame
    })),
  fetchGames: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/games', {
        headers: getAuthHeader()
      });
      if (!response.ok) throw new Error('Failed to fetch games');
      const games = await response.json();
      set({ games, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  fetchGame: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/games/${id}`, {
        headers: getAuthHeader()
      });
      if (!response.ok) throw new Error('Failed to fetch game');
      const game = await response.json();
      set({ currentGame: game, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  updateGameStatus: async (id, status) => {
    try {
      const response = await fetch(`/api/games/${id}`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify({ gameStatus: status })
      });
      if (!response.ok) throw new Error('Failed to update game status');
      const updatedGame = await response.json();
      set((state) => ({
        games: state.games.map(game => game.id === id ? updatedGame : game),
        currentGame: state.currentGame?.id === id ? updatedGame : state.currentGame
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
  extractNumber: async (id: string) => {
    try {
      if (!wsService) {
        throw new Error('WebSocket not initialized');
      }
      wsService.emitExtraction(id);
    } catch (error) {
      set({ error: error.message });
    }
  },
  wsConnected: false,

  connectWebSocket: () => {
    wsService.connect();
    set({ wsConnected: true });
  },

  disconnectWebSocket: () => {
    wsService.disconnect();
    set({ wsConnected: false });
  },

  setWsConnected: (connected: boolean) => {
    set({ wsConnected: connected });
  },

  deleteGame: async (id) => {
    try {
      const response = await fetch(`/api/games/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }

      // Remove the deleted game from the state
      set((state) => ({
        games: state.games.filter(game => game.id !== id),
        currentGame: state.currentGame?.id === id ? null : state.currentGame
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  createGame: async (gameData: CreateGamePayload) => {
    set({ loading: true, error: null });
    try {
      // Transform the data to match backend expectations
      const payload: CreateGamePayload =  gameData

      const response = await fetch('/api/games', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message);
      }

      const newGame = await response.json();
      set((state) => ({
        games: [...state.games, newGame],
        loading: false
      }));
      return newGame;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  editGame: async (id: string, gameData: Partial<CreateGamePayload>) => {
    set({ loading: true, error: null });
    try {
      // Transform the data to match backend expectations
      const payload: Partial<CreateGamePayload> = {
        ...gameData,
        cinquinaPrice: gameData.cinquinaPrice?.id ? { id: gameData.cinquinaPrice.id } : null,
        bingoPrice: gameData.bingoPrice?.id ? { id: gameData.bingoPrice.id } : null,
        miniBingoPrice: gameData.miniBingoPrice?.id ? { id: gameData.miniBingoPrice.id } : null,
      };

      // Remove the old price ID fields
      delete (payload as any).cinquinaPriceId;
      delete (payload as any).bingoPriceId;
      delete (payload as any).miniBingoPriceId;

      const response = await fetch(`/api/games/${id}`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message);
      }

      const updatedGame = await response.json();
      set((state) => ({
        games: state.games.map(game => game.id === id ? updatedGame : game),
        currentGame: state.currentGame?.id === id ? updatedGame : state.currentGame,
        loading: false
      }));
      return updatedGame;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
