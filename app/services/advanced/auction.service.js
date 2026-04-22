/**
 * Auction System Service
 * English, Dutch, and Sealed-bid auctions
 */

class AuctionService {
  constructor() {
    this.auctions = new Map();
    this.bids = new Map();
    this.watchlists = new Map();
  }

  /**
   * Create auction
   */
  async createAuction(seller, auctionData) {
    try {
      const {
        nftId,
        type, // 'english', 'dutch', 'sealed'
        startPrice,
        reservePrice,
        buyNowPrice,
        duration,
        minBidIncrement = 0.05, // 5% for English
        description
      } = auctionData;

      const auction = {
        auctionId: this.generateId('AUC'),
        nftId: nftId,
        seller: seller,
        type: type,
        status: 'pending',
        startPrice: startPrice,
        currentPrice: type === 'dutch' ? startPrice : startPrice,
        reservePrice: reservePrice,
        buyNowPrice: buyNowPrice,
        minBidIncrement: minBidIncrement,
        description: description,
        startTime: null,
        endTime: null,
        duration: duration * 60 * 60 * 1000, // Convert hours to ms
        highestBid: null,
        bidCount: 0,
        watchers: [],
        createdAt: new Date().toISOString()
      };

      this.auctions.set(auction.auctionId, auction);

      return {
        success: true,
        auctionId: auction.auctionId,
        type: type,
        status: auction.status
      };
    } catch (error) {
      console.error('Create auction error:', error);
      throw error;
    }
  }

  /**
   * Start auction
   */
  async startAuction(seller, auctionId) {
    try {
      const auction = this.auctions.get(auctionId);
      if (!auction) throw new Error('Auction not found');
      if (auction.seller !== seller) throw new Error('Not your auction');
      if (auction.status !== 'pending') throw new Error('Auction already started');

      auction.status = 'active';
      auction.startTime = new Date().toISOString();
      auction.endTime = new Date(Date.now() + auction.duration).toISOString();

      // For Dutch auctions, start price reduction timer
      if (auction.type === 'dutch') {
        this.startDutchReduction(auction);
      }

      return {
        success: true,
        auctionId: auctionId,
        status: 'active',
        endTime: auction.endTime
      };
    } catch (error) {
      console.error('Start auction error:', error);
      throw error;
    }
  }

  /**
   * Place bid
   */
  async placeBid(bidder, auctionId, bidData) {
    try {
      const auction = this.auctions.get(auctionId);
      if (!auction) throw new Error('Auction not found');
      if (auction.status !== 'active') throw new Error('Auction not active');
      if (auction.seller === bidder) throw new Error('Cannot bid on your own auction');

      // Check if ended
      if (new Date() > new Date(auction.endTime)) {
        throw new Error('Auction has ended');
      }

      const { amount, sealed = false } = bidData;

      // Validate bid based on auction type
      if (auction.type === 'english') {
        const minBid = auction.highestBid 
          ? auction.highestBid.amount * (1 + auction.minBidIncrement)
          : auction.startPrice;
        
        if (amount < minBid) {
          throw new Error(`Minimum bid is ${minBid} INDI`);
        }
      } else if (auction.type === 'dutch') {
        if (amount < auction.currentPrice) {
          throw new Error(`Current price is ${auction.currentPrice} INDI`);
        }
      }

      const bid = {
        bidId: this.generateId('BID'),
        auctionId: auctionId,
        bidder: bidder,
        amount: amount,
        sealed: sealed,
        timestamp: new Date().toISOString()
      };

      this.bids.set(bid.bidId, bid);

      // Update auction
      auction.bidCount++;

      if (auction.type === 'english') {
        auction.highestBid = bid;
        auction.currentPrice = amount;
        
        // Extend auction if bid in last 5 minutes
        const timeLeft = new Date(auction.endTime) - new Date();
        if (timeLeft < 5 * 60 * 1000) {
          auction.endTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        }
      } else if (auction.type === 'dutch') {
        // Dutch auction ends when someone bids
        await this.endAuction(auctionId, bid);
        return {
          success: true,
          bidId: bid.bidId,
          message: 'You won the Dutch auction!',
          won: true
        };
      }

      return {
        success: true,
        bidId: bid.bidId,
        amount: amount,
        isHighest: auction.type === 'english' && auction.highestBid?.bidId === bid.bidId
      };
    } catch (error) {
      console.error('Place bid error:', error);
      throw error;
    }
  }

  /**
   * Buy now
   */
  async buyNow(buyer, auctionId) {
    try {
      const auction = this.auctions.get(auctionId);
      if (!auction) throw new Error('Auction not found');
      if (!auction.buyNowPrice) throw new Error('Buy now not available');
      if (auction.status !== 'active') throw new Error('Auction not active');

      const bid = {
        bidId: this.generateId('BID'),
        auctionId: auctionId,
        bidder: buyer,
        amount: auction.buyNowPrice,
        buyNow: true,
        timestamp: new Date().toISOString()
      };

      this.bids.set(bid.bidId, bid);
      auction.highestBid = bid;

      await this.endAuction(auctionId, bid);

      return {
        success: true,
        bidId: bid.bidId,
        amount: auction.buyNowPrice,
        message: 'Purchase successful!'
      };
    } catch (error) {
      console.error('Buy now error:', error);
      throw error;
    }
  }

  /**
   * End auction
   */
  async endAuction(auctionId, winningBid = null) {
    try {
      const auction = this.auctions.get(auctionId);
      if (!auction) throw new Error('Auction not found');

      auction.status = 'ended';
      auction.endedAt = new Date().toISOString();

      if (winningBid) {
        auction.winner = winningBid.bidder;
        auction.finalPrice = winningBid.amount;
        auction.winningBid = winningBid;

        // Check reserve price
        if (auction.reservePrice && winningBid.amount < auction.reservePrice) {
          auction.reserveMet = false;
          auction.status = 'reserve_not_met';
        } else {
          auction.reserveMet = true;
        }
      } else {
        auction.winner = null;
        auction.status = 'no_bids';
      }

      return {
        success: true,
        auctionId: auctionId,
        status: auction.status,
        winner: auction.winner,
        finalPrice: auction.finalPrice
      };
    } catch (error) {
      console.error('End auction error:', error);
      throw error;
    }
  }

  /**
   * Start Dutch auction price reduction
   */
  startDutchReduction(auction) {
    // Reduce price every 5 minutes
    const reductionInterval = setInterval(() => {
      if (auction.status !== 'active') {
        clearInterval(reductionInterval);
        return;
      }

      const reduction = auction.startPrice * 0.05; // 5% reduction
      auction.currentPrice = Math.max(auction.currentPrice - reduction, auction.reservePrice * 0.5);

      // End if price too low
      if (auction.currentPrice <= auction.reservePrice * 0.5) {
        this.endAuction(auction.auctionId);
        clearInterval(reductionInterval);
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Get auction details
   */
  async getAuction(auctionId) {
    try {
      const auction = this.auctions.get(auctionId);
      if (!auction) throw new Error('Auction not found');

      // Get bids
      const bids = Array.from(this.bids.values())
        .filter(b => b.auctionId === auctionId)
        .sort((a, b) => b.amount - a.amount);

      return {
        success: true,
        auction: {
          ...auction,
          bids: auction.type === 'sealed' && auction.status === 'active' 
            ? bids.length // Don't show sealed bids
            : bids,
          timeLeft: auction.status === 'active' 
            ? Math.max(0, new Date(auction.endTime) - new Date())
            : 0
        }
      };
    } catch (error) {
      console.error('Get auction error:', error);
      throw error;
    }
  }

  /**
   * Get active auctions
   */
  async getActiveAuctions(options = {}) {
    try {
      const { type, seller, limit = 20 } = options;

      let auctions = Array.from(this.auctions.values())
        .filter(a => a.status === 'active');

      if (type) auctions = auctions.filter(a => a.type === type);
      if (seller) auctions = auctions.filter(a => a.seller === seller);

      auctions.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));

      return {
        success: true,
        auctions: auctions.slice(0, limit).map(a => ({
          auctionId: a.auctionId,
          nftId: a.nftId,
          type: a.type,
          currentPrice: a.currentPrice,
          endTime: a.endTime,
          bidCount: a.bidCount
        }))
      };
    } catch (error) {
      console.error('Get active auctions error:', error);
      throw error;
    }
  }

  /**
   * Add to watchlist
   */
  async addToWatchlist(user, auctionId) {
    try {
      let watchlist = this.watchlists.get(user) || [];
      
      if (!watchlist.includes(auctionId)) {
        watchlist.push(auctionId);
        this.watchlists.set(user, watchlist);

        // Update auction
        const auction = this.auctions.get(auctionId);
        if (auction && !auction.watchers.includes(user)) {
          auction.watchers.push(user);
        }
      }

      return {
        success: true,
        auctionId: auctionId,
        watching: true
      };
    } catch (error) {
      console.error('Add to watchlist error:', error);
      throw error;
    }
  }

  /**
   * Remove from watchlist
   */
  async removeFromWatchlist(user, auctionId) {
    try {
      let watchlist = this.watchlists.get(user) || [];
      watchlist = watchlist.filter(id => id !== auctionId);
      this.watchlists.set(user, watchlist);

      return {
        success: true,
        auctionId: auctionId,
        watching: false
      };
    } catch (error) {
      console.error('Remove from watchlist error:', error);
      throw error;
    }
  }

  /**
   * Get user's watchlist
   */
  async getWatchlist(user) {
    try {
      const watchlist = this.watchlists.get(user) || [];
      const auctions = watchlist
        .map(id => this.auctions.get(id))
        .filter(a => a);

      return {
        success: true,
        watchlist: auctions.map(a => ({
          auctionId: a.auctionId,
          nftId: a.nftId,
          currentPrice: a.currentPrice,
          endTime: a.endTime,
          status: a.status
        }))
      };
    } catch (error) {
      console.error('Get watchlist error:', error);
      throw error;
    }
  }

  /**
   * Get user's bids
   */
  async getUserBids(user) {
    try {
      const bids = Array.from(this.bids.values())
        .filter(b => b.bidder === user)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return {
        success: true,
        bids: bids.map(b => ({
          bidId: b.bidId,
          auctionId: b.auctionId,
          amount: b.amount,
          timestamp: b.timestamp,
          auction: this.auctions.get(b.auctionId)?.status
        }))
      };
    } catch (error) {
      console.error('Get user bids error:', error);
      throw error;
    }
  }

  /**
   * Cancel auction (before start)
   */
  async cancelAuction(seller, auctionId) {
    try {
      const auction = this.auctions.get(auctionId);
      if (!auction) throw new Error('Auction not found');
      if (auction.seller !== seller) throw new Error('Not your auction');
      if (auction.status !== 'pending') throw new Error('Cannot cancel started auction');

      auction.status = 'cancelled';
      auction.cancelledAt = new Date().toISOString();

      return {
        success: true,
        auctionId: auctionId,
        status: 'cancelled'
      };
    } catch (error) {
      console.error('Cancel auction error:', error);
      throw error;
    }
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new AuctionService();
