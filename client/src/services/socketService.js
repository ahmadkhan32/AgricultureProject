/**
 * Socket.io Service - Real-time Communication with Backend
 * 
 * This service manages Socket.io connection for real-time updates.
 * When data is inserted/updated/deleted from backend, it automatically
 * notifies the frontend via Socket.io events.
 * 
 * Location: client/src/services/socketService.js
 */

import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map(); // Store event listeners
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Connect to Socket.io server
   */
  connect() {
    if (this.socket?.connected) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Socket.io already connected');
      }
      return;
    }

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 
      (process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:5000');

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 20000,
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Socket.io connected:', this.socket.id);
      }
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Join resources room for resource updates
      this.socket.emit('join:resources');
    });

    this.socket.on('disconnect', (reason) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Socket.io disconnected:', reason);
      }
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Socket.io connection error:', error.message);
      }
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Max reconnection attempts reached. Please check server connection.');
        }
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Socket.io reconnected after ${attemptNumber} attempts`);
      }
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Rejoin resources room
      this.socket.emit('join:resources');
    });
  }

  /**
   * Disconnect from Socket.io server
   */
  disconnect() {
    if (this.socket) {
      this.socket.emit('leave:resources');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      if (process.env.NODE_ENV === 'development') {
        console.log('Socket.io disconnected');
      }
    }
  }

  /**
   * Subscribe to an event
   * @param {String} eventName - Event name (e.g., 'resource:created')
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.socket) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Socket.io not connected. Call connect() first.');
      }
      return () => {};
    }

    this.socket.on(eventName, callback);

    // Store listener for cleanup
    const listenerKey = `${eventName}_${Date.now()}`;
    this.listeners.set(listenerKey, { eventName, callback });

    // Return unsubscribe function
    return () => {
      this.socket.off(eventName, callback);
      this.listeners.delete(listenerKey);
    };
  }

  /**
   * Unsubscribe from an event
   * @param {String} eventName - Event name
   * @param {Function} callback - Callback function (optional)
   */
  off(eventName, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(eventName, callback);
      } else {
        this.socket.off(eventName);
      }
    }
  }

  /**
   * Emit an event to server
   * @param {String} eventName - Event name
   * @param {Object} data - Data to send
   */
  emit(eventName, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(eventName, data);
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Socket.io not connected. Cannot emit event:', eventName);
      }
    }
  }

  /**
   * Get connection status
   * @returns {Boolean} Connection status
   */
  getConnectionStatus() {
    return this.isConnected && this.socket?.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;

