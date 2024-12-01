import { create } from 'zustand';
import { useGameStore } from './gameState';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  userName: string | null;
  userRole: string | null;
  name: string | null;
  email: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Helper function to decode JWT token
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => {
  // Initialize WebSocket if token exists in localStorage
  const token = localStorage.getItem('token');
  if (token) {
    // Connect WebSocket on store creation if user is authenticated
    setTimeout(() => useGameStore.getState().connectWebSocket(), 0);
  }

  return {
    token,
    isAuthenticated: !!token,
    userName: token ? decodeJWT(token)?.username : null,
    userRole: token ? decodeJWT(token)?.role : null,
    name: token ? decodeJWT(token)?.name : null,
    email: token ? decodeJWT(token)?.email : null,

    login: async (username: string, password: string) => {
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const data = await response.json();
        const token = data.access_token;
        localStorage.setItem('token', token);

        const decodedToken = decodeJWT(token);
        const userRole = decodedToken?.role || null;

        set({
          token,
          isAuthenticated: true,
          userRole,
          userName: decodedToken?.username || null,
          name: decodedToken?.name || null,
          email: decodedToken?.email || null,
        });

        // Connect WebSocket after successful login
        useGameStore.getState().connectWebSocket();
      } catch (error) {
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      // Disconnect WebSocket on logout
      useGameStore.getState().disconnectWebSocket();
      set({
        token: null,
        isAuthenticated: false,
        userRole: null,
      });
    },
  };
});

// Helper hook to check if user has specific role
export const useHasRole = (requiredRole: string) => {
  const userRole = useAuthStore((state) => state.userRole);
  return userRole === requiredRole;
};
