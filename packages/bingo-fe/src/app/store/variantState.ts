import { create } from 'zustand';
import { useAuthStore } from './authState';

interface VariantConfig {
  name: string;
  min: number;
  max: number;
  cardNumbers: number;
  labels: Record<string, string>;
}

interface VariantState {
  variants: Record<string, VariantConfig>;
  loading: boolean;
  error: string | null;
  fetchVariants: () => Promise<void>;
}

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const useVariantStore = create<VariantState>((set) => ({
  variants: {},
  loading: false,
  error: null,
  fetchVariants: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/constants/variants', {
        headers: getAuthHeader()
      });
      if (!response.ok) throw new Error('Failed to fetch variants');
      const variants = await response.json();
      set({ variants, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));
