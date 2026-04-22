/**
 * WebSocket Service for Real-time Dashboards
 * Provides live updates for sales, royalties, and marketplace activity
 */

const EventEmitter = require('events');

class WebSocketService extends EventEmitter {
  constructor() {
    super();
    this.clients = new Map(); // clientId -> { socket, userType, subscriptions }
    this.rooms = new Map(); // roomName -> Set of clientIds
    this.metrics = {
      totalConnections: 0,
      peakConnections: 0,
      messagesSent: 0,
      startTime: Date.now()
    };
    this.eventBuffer = new Map(); // Buffer recent events for new connections
    this.maxBufferSize = 100;
  }

  /**
   * Initialize WebSocket server (called from server.js)
   */
  initialize(server) {
    const WebSocket = require('ws');
    this.wss = new WebSocket.Server({ server, path: '/ws/analytics' });

    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });

    console.log('WebSocket analytics server initialized on /ws/analytics');
    
    // Start periodic broadcasts
    this.startPeriodicBroadcasts();
    
    return this;
  }

  /**
   * Handle new WebSocket connection
   */
  handleConnection(ws, req) {
    const clientId = this.generateClientId();
    const clientInfo = {
      id: clientId,
      socket: ws,
      userType: 'guest', // guest, artist, buyer, admin
      subscriptions: new Set(),
      connectedAt: new Date(),
      lastPing: Date.now()
    };

    this.clients.set(clientId, clientInfo);
    this.metrics.totalConnections++;
    this.metrics.peakConnections = Math.max(
      this.metrics.peakConnections,
      this.clients.size
    );

    console.log(`Client ${clientId} connected. Total: ${this.clients.size}`);

    // Send initial connection acknowledgment
    this.sendToClient(clientId, {
      type: 'connection',
      clientId,
      timestamp: new Date().toISOString(),
      message: 'Connected to Indigena Analytics'
    });

    // Send recent buffered events
    this.sendBufferedEvents(clientId);

    // Handle messages from client
    ws.on('message', (data) => {
      this.handleMessage(clientId, data);
    });

    // Handle disconnection
    ws.on('close', () => {
      this.handleDisconnection(clientId);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
    });

    // Setup ping/pong for connection health
    this.setupHeartbeat(clientId);
  }

  /**
   * Handle incoming message from client
   */
  handleMessage(clientId, data) {
    try {
      const message = JSON.parse(data);
      const client = this.clients.get(clientId);

      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(clientId, message.channels);
          break;
        case 'unsubscribe':
          this.handleUnsubscribe(clientId, message.channels);
          break;
        case 'authenticate':
          this.handleAuthentication(clientId, message.token, message.userType);
          break;
        case 'ping':
          this.handlePing(clientId);
          break;
        case 'request_data':
          this.handleDataRequest(clientId, message.request);
          break;
        default:
          console.log(`Unknown message type from ${clientId}:`, message.type);
      }
    } catch (error) {
      console.error(`Error handling message from ${clientId}:`, error);
      this.sendToClient(clientId, {
        type: 'error',
        message: 'Invalid message format'
      });
    }
  }

  /**
   * Handle subscription request
   */
  handleSubscribe(clientId, channels) {
    const client = this.clients.get(clientId);
    if (!client) return;

    channels.forEach(channel => {
      client.subscriptions.add(channel);
      
      // Add to room
      if (!this.rooms.has(channel)) {
        this.rooms.set(channel, new Set());
      }
      this.rooms.get(channel).add(clientId);
    });

    this.sendToClient(clientId, {
      type: 'subscribed',
      channels: Array.from(client.subscriptions)
    });

    console.log(`Client ${clientId} subscribed to:`, channels);
  }

  /**
   * Handle unsubscribe request
   */
  handleUnsubscribe(clientId, channels) {
    const client = this.clients.get(clientId);
    if (!client) return;

    channels.forEach(channel => {
      client.subscriptions.delete(channel);
      
      // Remove from room
      const room = this.rooms.get(channel);
      if (room) {
        room.delete(clientId);
        if (room.size === 0) {
          this.rooms.delete(channel);
        }
      }
    });

    this.sendToClient(clientId, {
      type: 'unsubscribed',
      channels
    });
  }

  /**
   * Handle client authentication
   */
  handleAuthentication(clientId, token, userType) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // In production, verify JWT token
    client.userType = userType || 'guest';
    client.authenticated = true;

    this.sendToClient(clientId, {
      type: 'authenticated',
      userType: client.userType
    });
  }

  /**
   * Handle ping from client
   */
  handlePing(clientId) {
    const client = this.clients.get(clientId);
    if (client) {
      client.lastPing = Date.now();
      this.sendToClient(clientId, { type: 'pong' });
    }
  }

  /**
   * Handle data request from client
   */
  async handleDataRequest(clientId, request) {
    const { type, params } = request;
    
    // Handle different data requests
    switch (type) {
      case 'market_overview':
        await this.sendMarketOverview(clientId);
        break;
      case 'artist_dashboard':
        await this.sendArtistDashboard(clientId, params.artistAddress);
        break;
      case 'sales_feed':
        await this.sendSalesFeed(clientId, params.limit);
        break;
      case 'royalty_updates':
        await this.sendRoyaltyUpdates(clientId, params.artistAddress);
        break;
      default:
        this.sendToClient(clientId, {
          type: 'error',
          message: `Unknown data request type: ${type}`
        });
    }
  }

  /**
   * Send message to specific client
   */
  sendToClient(clientId, data) {
    const client = this.clients.get(clientId);
    if (client && client.socket.readyState === 1) { // WebSocket.OPEN
      client.socket.send(JSON.stringify(data));
      this.metrics.messagesSent++;
    }
  }

  /**
   * Broadcast to all clients subscribed to a channel
   */
  broadcastToChannel(channel, data) {
    const room = this.rooms.get(channel);
    if (!room) return;

    const message = {
      type: 'update',
      channel,
      data,
      timestamp: new Date().toISOString()
    };

    room.forEach(clientId => {
      this.sendToClient(clientId, message);
    });

    // Buffer the event
    this.bufferEvent(channel, message);
  }

  /**
   * Broadcast to all connected clients
   */
  broadcastToAll(data) {
    const message = {
      type: 'broadcast',
      data,
      timestamp: new Date().toISOString()
    };

    this.clients.forEach((client, clientId) => {
      this.sendToClient(clientId, message);
    });
  }

  /**
   * Buffer recent events for new connections
   */
  bufferEvent(channel, event) {
    if (!this.eventBuffer.has(channel)) {
      this.eventBuffer.set(channel, []);
    }
    
    const buffer = this.eventBuffer.get(channel);
    buffer.push(event);
    
    // Keep only recent events
    if (buffer.length > this.maxBufferSize) {
      buffer.shift();
    }
  }

  /**
   * Send buffered events to new client
   */
  sendBufferedEvents(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.subscriptions.forEach(channel => {
      const buffer = this.eventBuffer.get(channel);
      if (buffer && buffer.length > 0) {
        // Send last 10 events
        const recentEvents = buffer.slice(-10);
        this.sendToClient(clientId, {
          type: 'buffered_events',
          channel,
          events: recentEvents
        });
      }
    });
  }

  /**
   * Handle client disconnection
   */
  handleDisconnection(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Remove from all rooms
    client.subscriptions.forEach(channel => {
      const room = this.rooms.get(channel);
      if (room) {
        room.delete(clientId);
        if (room.size === 0) {
          this.rooms.delete(channel);
        }
      }
    });

    this.clients.delete(clientId);
    console.log(`Client ${clientId} disconnected. Total: ${this.clients.size}`);
  }

  /**
   * Setup heartbeat/ping for connection health
   */
  setupHeartbeat(clientId) {
    const interval = setInterval(() => {
      const client = this.clients.get(clientId);
      if (!client) {
        clearInterval(interval);
        return;
      }

      // Check if client is still responsive
      if (Date.now() - client.lastPing > 60000) { // 60 seconds
        console.log(`Client ${clientId} timed out`);
        client.socket.close();
        clearInterval(interval);
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Start periodic broadcasts (market updates, stats, etc.)
   */
  startPeriodicBroadcasts() {
    // Market overview every 30 seconds
    setInterval(() => {
      this.broadcastMarketOverview();
    }, 30000);

    // Active users count every 10 seconds
    setInterval(() => {
      this.broadcastActiveUsers();
    }, 10000);
  }

  /**
   * Broadcast market overview to all clients
   */
  async broadcastMarketOverview() {
    const overview = await this.generateMarketOverview();
    this.broadcastToChannel('market', overview);
  }

  /**
   * Broadcast active users count
   */
  broadcastActiveUsers() {
    const stats = {
      activeConnections: this.clients.size,
      totalConnections: this.metrics.totalConnections,
      peakConnections: this.metrics.peakConnections,
      uptime: Date.now() - this.metrics.startTime
    };

    this.broadcastToChannel('stats', stats);
  }

  /**
   * Generate market overview data
   */
  async generateMarketOverview() {
    // In production, fetch from database
    return {
      type: 'market_overview',
      data: {
        totalVolume24h: Math.floor(Math.random() * 10000) + 5000,
        totalSales24h: Math.floor(Math.random() * 100) + 20,
        averagePrice: Math.floor(Math.random() * 500) + 100,
        activeListings: Math.floor(Math.random() * 1000) + 500,
        newArtists: Math.floor(Math.random() * 10) + 1,
        topCategory: ['weaving', 'pottery', 'jewelry', 'painting'][Math.floor(Math.random() * 4)],
        trendingNation: ['Navajo', 'Cherokee', 'Hopi', 'Lakota'][Math.floor(Math.random() * 4)]
      }
    };
  }

  /**
   * Send market overview to specific client
   */
  async sendMarketOverview(clientId) {
    const overview = await this.generateMarketOverview();
    this.sendToClient(clientId, overview);
  }

  /**
   * Send artist dashboard data
   */
  async sendArtistDashboard(clientId, artistAddress) {
    // In production, fetch from database
    const dashboard = {
      type: 'artist_dashboard',
      artistAddress,
      data: {
        totalSales: Math.floor(Math.random() * 50) + 5,
        totalRevenue: Math.floor(Math.random() * 5000) + 500,
        royaltiesEarned: Math.floor(Math.random() * 1000) + 100,
        viewsThisWeek: Math.floor(Math.random() * 500) + 50,
        favoritesCount: Math.floor(Math.random() * 100) + 10,
        topPerformingWork: 'Traditional Weaving #3',
        recentActivity: [
          { type: 'sale', amount: 250, time: '2 minutes ago' },
          { type: 'view', count: 15, time: '5 minutes ago' },
          { type: 'favorite', count: 3, time: '10 minutes ago' }
        ]
      }
    };

    this.sendToClient(clientId, dashboard);
  }

  /**
   * Send sales feed
   */
  async sendSalesFeed(clientId, limit = 20) {
    const feed = {
      type: 'sales_feed',
      data: Array.from({ length: limit }, (_, i) => ({
        id: `sale_${Date.now()}_${i}`,
        artwork: `Artwork ${i + 1}`,
        artist: `Artist ${Math.floor(Math.random() * 50) + 1}`,
        price: Math.floor(Math.random() * 1000) + 50,
        buyer: `Buyer ${Math.floor(Math.random() * 100) + 1}`,
        time: new Date(Date.now() - i * 60000).toISOString(),
        type: ['primary', 'secondary'][Math.floor(Math.random() * 2)]
      }))
    };

    this.sendToClient(clientId, feed);
  }

  /**
   * Send royalty updates
   */
  async sendRoyaltyUpdates(clientId, artistAddress) {
    const updates = {
      type: 'royalty_updates',
      artistAddress,
      data: {
        pendingRoyalties: Math.floor(Math.random() * 500) + 50,
        claimedThisMonth: Math.floor(Math.random() * 1000) + 200,
        secondarySales: Math.floor(Math.random() * 20) + 5,
        recentPayments: Array.from({ length: 5 }, (_, i) => ({
          amount: Math.floor(Math.random() * 100) + 10,
          from: `Sale ${i + 1}`,
          time: new Date(Date.now() - i * 3600000).toISOString()
        }))
      }
    };

    this.sendToClient(clientId, updates);
  }

  /**
   * Public methods for triggering broadcasts from other services
   */

  // Trigger when new sale occurs
  notifyNewSale(saleData) {
    this.broadcastToChannel('sales', {
      type: 'new_sale',
      ...saleData
    });
  }

  // Trigger when royalty is earned
  notifyRoyaltyEarned(royaltyData) {
    this.broadcastToChannel('royalties', {
      type: 'royalty_earned',
      ...royaltyData
    });

    // Also send to specific artist channel
    if (royaltyData.artistAddress) {
      this.broadcastToChannel(`artist:${royaltyData.artistAddress}`, {
        type: 'royalty_earned',
        ...royaltyData
      });
    }
  }

  // Trigger when new listing is added
  notifyNewListing(listingData) {
    this.broadcastToChannel('listings', {
      type: 'new_listing',
      ...listingData
    });
  }

  // Trigger when price changes
  notifyPriceUpdate(priceData) {
    this.broadcastToChannel('prices', {
      type: 'price_update',
      ...priceData
    });
  }

  /**
   * Generate unique client ID
   */
  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get service metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      activeConnections: this.clients.size,
      activeRooms: this.rooms.size,
      uptime: Date.now() - this.metrics.startTime
    };
  }
}

// Export singleton instance
module.exports = new WebSocketService();
