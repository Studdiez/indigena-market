/**
 * PILLAR 2: PHYSICAL ITEMS
 * Tangible cultural expression marketplace
 */

class PhysicalItemsService {
  constructor() {
    this.products = new Map();
    this.orders = new Map();
  }

  async createProduct(seller, productData) {
    const product = {
      productId: this.generateId('PI'),
      pillar: 'physical_items',
      seller: seller,
      title: productData.title,
      description: productData.description,
      category: productData.category, // 'weaving', 'pottery', 'jewelry', 'regalia', 'instruments'
      materials: productData.materials || [],
      dimensions: productData.dimensions,
      weight: productData.weight,
      images: productData.images || [],
      story: {
        maker: productData.maker,
        makerNation: productData.makerNation,
        creationProcess: productData.creationProcess,
        culturalSignificance: productData.culturalSignificance
      },
      pricing: {
        price: productData.price,
        currency: productData.currency || 'INDI',
        compareAtPrice: productData.compareAtPrice || null
      },
      inventory: {
        quantity: productData.quantity || 1,
        sku: productData.sku || null,
        trackInventory: productData.trackInventory !== false
      },
      shipping: {
        weight: productData.weight,
        dimensions: productData.dimensions,
        origin: productData.shippingOrigin,
        processingTime: productData.processingTime || '3-5 days'
      },
      verification: {
        authenticityCard: productData.authenticityCard || false,
        nfcTag: productData.nfcTag || false,
        certificateOfAuthenticity: productData.coa || false
      },
      ar: {
        enabled: productData.arEnabled || false,
        modelUrl: productData.arModelUrl || null
      },
      status: productData.status || 'active',
      createdAt: new Date().toISOString()
    };

    this.products.set(product.productId, product);

    return {
      success: true,
      productId: product.productId,
      status: product.status
    };
  }

  async createOrder(buyer, orderData) {
    const order = {
      orderId: this.generateId('ORD'),
      pillar: 'physical_items',
      buyer: buyer,
      items: orderData.items.map(item => {
        const product = this.products.get(item.productId);
        return {
          productId: item.productId,
          title: product?.title,
          price: product?.pricing.price,
          quantity: item.quantity,
          seller: product?.seller
        };
      }),
      totals: {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0
      },
      shipping: {
        address: orderData.shippingAddress,
        method: orderData.shippingMethod,
        cost: 0,
        status: 'pending'
      },
      payment: {
        method: orderData.paymentMethod || 'INDI',
        status: 'pending',
        txId: null
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Calculate totals
    order.totals.subtotal = order.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    order.totals.total = order.totals.subtotal + order.totals.shipping + order.totals.tax;

    this.orders.set(order.orderId, order);

    return {
      success: true,
      orderId: order.orderId,
      status: 'pending',
      total: order.totals.total
    };
  }

  async getProducts(filters = {}) {
    let products = Array.from(this.products.values())
      .filter(p => p.status === 'active');

    if (filters.category) products = products.filter(p => p.category === filters.category);
    if (filters.nation) products = products.filter(p => p.story.makerNation === filters.nation);
    if (filters.seller) products = products.filter(p => p.seller === filters.seller);

    return products.map(p => ({
      productId: p.productId,
      title: p.title,
      category: p.category,
      price: p.pricing.price,
      currency: p.pricing.currency,
      thumbnail: p.images[0],
      maker: p.story.maker,
      makerNation: p.story.makerNation
    }));
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new PhysicalItemsService();
