/**
 * Socket.io Event Emitter
 * 
 * This file emits Socket.io events whenever CRUD operations occur.
 * It allows real-time updates to the frontend without manual refresh.
 * 
 * Location: server/src/utils/socketEmitter.js
 */

let io = null;

/**
 * Initialize Socket.io instance
 * @param {Object} socketIoInstance - Socket.io instance from server
 */
const initializeSocket = (socketIoInstance) => {
  io = socketIoInstance;
  console.log('✅ Socket.io Event Emitter initialized');
};

/**
 * Emit event when resource is created
 * @param {Object} resource - The created resource
 */
const emitResourceCreated = (resource) => {
  if (io) {
    io.emit('resource:created', { resource });
    console.log('📢 Socket.io: Emitted resource:created event', resource.id);
  }
};

/**
 * Emit event when resource is updated
 * @param {Object} resource - The updated resource
 */
const emitResourceUpdated = (resource) => {
  if (io) {
    io.emit('resource:updated', { resource });
    console.log('📢 Socket.io: Emitted resource:updated event', resource.id);
  }
};

/**
 * Emit event when resource is deleted
 * @param {Number} resourceId - The deleted resource ID
 */
const emitResourceDeleted = (resourceId) => {
  if (io) {
    io.emit('resource:deleted', { resourceId });
    console.log('📢 Socket.io: Emitted resource:deleted event', resourceId);
  }
};

/**
 * Generic emitter for any model/event
 * @param {String} eventName - Event name (e.g., 'news:created', 'producer:updated')
 * @param {Object} data - Data to emit
 */
const emitEvent = (eventName, data) => {
  if (io) {
    io.emit(eventName, data);
    console.log(`📢 Socket.io: Emitted ${eventName} event`);
  }
};

module.exports = {
  initializeSocket,
  emitResourceCreated,
  emitResourceUpdated,
  emitResourceDeleted,
  emitEvent
};

