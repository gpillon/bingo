import { create } from 'zustand';
import { useAuthStore } from './authState';

export interface Price {
  id: number;
  name: string;

  description: string;
  hasImage?: boolean;
  imageUrl?: string;
}

interface PriceState {
  prices: Price[];
  loading: boolean;
  error: string | null;
  fetchPrices: () => Promise<void>;
  createPrice: (data: { name: string; description: string }) => Promise<void>;
  updatePrice: (id: number, data: { name: string; description: string }) => Promise<void>;
  uploadPriceImage: (id: number, image: File) => Promise<void>;
  deletePrice: (id: number) => Promise<void>;
  removeImage: (id: number) => Promise<void>;
}

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getAuthHeaderMultipart = () => {
  const token = useAuthStore.getState().token;
  return {
    'Authorization': `Bearer ${token}`
  };
};


export const usePriceStore = create<PriceState>((set) => ({
  prices: [],
  loading: false,
  error: null,

  fetchPrices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/prices', {
        headers: getAuthHeader()
      });
      if (!response.ok) throw new Error('Failed to fetch prices');
      const prices = await response.json();

      // Add imageUrl to each price
      const pricesWithImages = prices.map(price => ({
        ...price,
        imageUrl: `/api/prices/${price.id}/image`
      }));

      set({ prices: pricesWithImages, loading: false });
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  createPrice: async (data: { name: string; description: string }) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/prices', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to create price');

      const newPrice = await response.json();
      set(state => ({
        prices: [...state.prices, { ...newPrice, imageUrl: `/api/prices/${newPrice.id}/image` }],
        loading: false
      }));
      return newPrice;
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updatePrice: async (id: number, data: { name: string; description: string }) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/prices/${id}`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to update price');

      const updatedPrice = await response.json();
      set(state => ({
        prices: state.prices.map(price =>
          price.id === id
            ? {
                ...updatedPrice,
                hasImage: price.hasImage
              }
            : price
        ),
        loading: false
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  uploadPriceImage: async (id: number, image: File) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch(`/api/prices/${id}/image`, {
        method: 'POST',
        headers: getAuthHeaderMultipart(),
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload image');

      // Update the price's imageUrl in the state
      set(state => ({
        prices: state.prices.map(price =>
          price.id === id
            ? { ...price, imageUrl: `/api/prices/${id}/image?${Date.now()}` }
            : price
        ),
        loading: false
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deletePrice: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/prices/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (!response.ok) throw new Error('Failed to delete price');

      set(state => ({
        prices: state.prices.filter(price => price.id !== id),
        loading: false
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  removeImage: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/prices/${id}/image`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (!response.ok) throw new Error('Failed to remove image');

      set(state => ({
        prices: state.prices.map(price =>
          price.id === id
            ? { ...price, hasImage: false, imageUrl: undefined }
            : price
        ),
        loading: false
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  }
}));
