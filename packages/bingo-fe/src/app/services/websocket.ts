import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameState';
import { useAuthStore } from '../store/authState';

export class WebSocketService {
  private socket: Socket | null = null;
  private readonly url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(url: string) {
    this.url = `${url}`;
  }

  connect() {
    const token = useAuthStore.getState().token;

    if (!token) {
      console.error('No token available for WebSocket connection');
      return;
    }

    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.socket = io(this.url, {
      auth: {
        token: token
      },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      useGameStore.getState().setWsConnected(true);
    });

    this.socket.on('gameUpdate', (game) => {
      useGameStore.getState().updateGame(game);
    });

    this.socket.on('gameDeleted', (gameId) => {
      useGameStore.getState().deleteGameFromStore(gameId);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      // this.handleReconnect();
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      useGameStore.getState().setWsConnected(false);
      // this.handleReconnect();
    });
  }

  // private handleReconnect() {
  //   if (this.reconnectAttempts >= this.maxReconnectAttempts) {
  //     console.error('Max reconnection attempts reached');
  //     return;
  //   }

  //   if (this.reconnectTimeout) {
  //     clearTimeout(this.reconnectTimeout);
  //   }

  //   this.reconnectTimeout = setTimeout(() => {
  //     if (!this.socket?.connected && useAuthStore.getState().token) {
  //       console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
  //       this.reconnectAttempts++;
  //       this.connect();
  //     }
  //   }, 1000 * Math.min(this.reconnectAttempts + 1, 5));
  // }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.reconnectAttempts = 0;
    useGameStore.getState().setWsConnected(false);
  }

  emitExtraction(gameId: string) {
    if (this.socket?.connected) {
      this.socket.emit('extract', gameId);
    } else {
      console.error('Cannot emit extraction: WebSocket not connected');
    }
  }
}
