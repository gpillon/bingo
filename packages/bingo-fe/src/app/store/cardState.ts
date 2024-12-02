import { create } from 'zustand';
import { useAuthStore } from './authState';

interface CardState {
  userCards: BingoCard[];
  allUserCards: BingoCard[];
  loading: boolean;
  error: string | null;
  setCards: (cards: BingoCard[]) => void;
  fetchUserCards: (gameId?: string) => Promise<void>;
  fetchAllUserCards: (gameId?: string) => Promise<void>;
  buyCard: (gameId: string) => Promise<void>;
}

export interface BingoCard {
  id: number;
  date: string;
  gameId: string;
  owner: {
    id: number;
    username: string;
    email: string;
    name: string;
  }
  numbers: number[][];
}

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const useCardStore = create<CardState>((set) => ({
  userCards: [],
  allUserCards: [],
  loading: false,
  error: null,
  setCards: (cards) => set({ userCards: cards }),
  fetchUserCards: async (gameId?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(gameId ? `/api/cards?gameId=${gameId}` : '/api/cards', {
        headers: getAuthHeader()
      });
      if (!response.ok) throw new Error('Failed to fetch cards');
      const cards = await response.json();
      set({ userCards: cards, loading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  fetchAllUserCards: async (gameId?: string): Promise<void> => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(gameId ? `/api/cards?gameId=${gameId}` : '/api/cards', {
        headers: getAuthHeader()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch cards:', errorText);
        throw new Error(`Failed to fetch all cards: ${response.status} ${errorText}`);
      }

      const cards = await response.json();

      if (!Array.isArray(cards)) {
        console.error('Received non-array response:', cards);
        throw new Error('Invalid response format');
      }
      set({ allUserCards: cards, loading: false });
    } catch (error: unknown) {
      console.error('Error fetching cards:', error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  buyCard: async (gameId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/cards`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ gameId })
      });

      if (!response.ok) throw new Error('Failed to buy card');

      const newCard = await response.json();
      set(state => ({
        userCards: [...state.userCards, newCard],
        loading: false
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));
