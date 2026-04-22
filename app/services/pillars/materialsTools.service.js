/**
 * PILLAR 10: MATERIALS & TOOLS
 * Supply chain sovereignty marketplace
 */

class MaterialsToolsService {
  constructor() {
    this.products = new Map();
    this.toolLibrary = new Map();
    this.bulkOrders = new Map();
    this.rentals = new Map();
  }

  async createProduct(seller, productData) {
    const product = {
      productId: this.generateId('MT'),
      pillar: 'materials_tools',
      seller: seller,
      name: productData.name,
      description: productData.description,
      category: productData.category, // 'raw_materials', 'tools', 'equipment', 'supplies'
      subcategory: productData.subcategory,
      specifications: {
        material: productData.material,
        dimensions: productData.dimensions,
        weight: productData.weight,
        origin: productData.origin,
        quality: productData.quality
      },
      cultural: {
        traditionalSource: productData.traditionalSource || false,
        harvestMethod: productData.harvestMethod,
        sustainable: productData.sustainable || false,
        stories: productData.stories || []
      },
      pricing: {
        unitPrice: productData.unitPrice,
        currency: productData.currency || 'INDI',
        unit: productData.unit || 'piece',
        bulkDiscounts: productData.bulkDiscounts || []
      },
      inventory: {
        quantity: productData.quantity || 0,
        minOrder: productData.minOrder || 1,
        maxOrder: productData.maxOrder || null
      },
      shipping: {
        weight: productData.shippingWeight,
        dimensions: productData.shippingDimensions,
        hazardous: productData.hazardous || false,
        restrictions: productData.restrictions || []
      },
      images: productData.images || [],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.products.set(product.productId, product);

    return {
      success: true,
      productId: product.productId,
      name: product.name,
      category: product.category
    };
  }

  async addToToolLibrary(owner, toolData) {
    const tool = {
      toolId: this.generateId('TL'),
      pillar: 'materials_tools',
      owner: owner,
      name: toolData.name,
      description: toolData.description,
      category: toolData.category, // 'pottery', 'weaving', 'woodworking', 'metalwork', 'general'
      specifications: {
        brand: toolData.brand,
        model: toolData.model,
        condition: toolData.condition || 'good',
        age: toolData.age,
        accessories: toolData.accessories || []
      },
      availability: {
        status: 'available', // 'available', 'rented', 'maintenance', 'unavailable'
        location: toolData.location,
        pickupOptions: toolData.pickupOptions || ['pickup']
      },
      rental: {
        dailyRate: toolData.dailyRate,
        weeklyRate: toolData.weeklyRate,
        monthlyRate: toolData.monthlyRate,
        deposit: toolData.deposit || 0,
        currency: toolData.currency || 'INDI'
      },
      requirements: {
        training: toolData.trainingRequired || false,
        experience: toolData.experienceLevel || 'any',
        safety: toolData.safetyRequirements || []
      },
      schedule: {
        bookings: [],
        blockedDates: []
      },
      images: toolData.images || [],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.toolLibrary.set(tool.toolId, tool);

    return {
      success: true,
      toolId: tool.toolId,
      name: tool.name,
      dailyRate: tool.rental.dailyRate
    };
  }

  async rentTool(renter, toolId, rentalData) {
    const tool = this.toolLibrary.get(toolId);
    if (!tool) throw new Error('Tool not found');
    if (tool.availability.status !== 'available') {
      throw new Error('Tool not available for rent');
    }

    const days = this.calculateDays(rentalData.startDate, rentalData.endDate);
    let rate = tool.rental.dailyRate;
    if (days >= 30 && tool.rental.monthlyRate) {
      rate = tool.rental.monthlyRate / 30;
    } else if (days >= 7 && tool.rental.weeklyRate) {
      rate = tool.rental.weeklyRate / 7;
    }

    const rentalTotal = rate * days;
    const total = rentalTotal + tool.rental.deposit;

    const rental = {
      rentalId: this.generateId('RTL'),
      toolId: toolId,
      renter: renter,
      owner: tool.owner,
      dates: {
        start: rentalData.startDate,
        end: rentalData.endDate,
        days: days
      },
      pricing: {
        dailyRate: rate,
        rentalTotal: rentalTotal,
        deposit: tool.rental.deposit,
        total: total,
        currency: tool.rental.currency
      },
      pickup: {
        method: rentalData.pickupMethod || 'pickup',
        date: rentalData.pickupDate,
        location: tool.availability.location
      },
      status: 'reserved', // 'reserved', 'picked_up', 'active', 'returned', 'completed'
      condition: {
        pickup: null,
        returned: null
      },
      createdAt: new Date().toISOString()
    };

    this.rentals.set(rental.rentalId, rental);
    tool.schedule.bookings.push(rental.rentalId);

    return {
      success: true,
      rentalId: rental.rentalId,
      total: total,
      deposit: tool.rental.deposit,
      days: days
    };
  }

  async createBulkOrder(buyer, orderData) {
    const order = {
      orderId: this.generateId('BLK'),
      pillar: 'materials_tools',
      buyer: buyer,
      type: orderData.type, // 'cooperative', 'community', 'organization'
      items: orderData.items.map(item => {
        const product = this.products.get(item.productId);
        const discount = this.calculateBulkDiscount(product, item.quantity);
        return {
          productId: item.productId,
          name: product?.name,
          quantity: item.quantity,
          unitPrice: product?.pricing.unitPrice,
          discount: discount,
          finalPrice: product?.pricing.unitPrice * (1 - discount)
        };
      }),
      totals: {
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0
      },
      delivery: {
        address: orderData.deliveryAddress,
        preferredDate: orderData.preferredDate,
        instructions: orderData.deliveryInstructions
      },
      status: 'pending_quote',
      createdAt: new Date().toISOString()
    };

    // Calculate totals
    order.totals.subtotal = order.items.reduce((sum, item) => 
      sum + (item.unitPrice * item.quantity), 0
    );
    order.totals.discount = order.items.reduce((sum, item) => 
      sum + (item.unitPrice * item.quantity * item.discount), 0
    );
    order.totals.total = order.totals.subtotal - order.totals.discount + order.totals.shipping;

    this.bulkOrders.set(order.orderId, order);

    return {
      success: true,
      orderId: order.orderId,
      status: 'pending_quote',
      estimatedTotal: order.totals.total,
      savings: order.totals.discount
    };
  }

  calculateBulkDiscount(product, quantity) {
    if (!product?.pricing.bulkDiscounts) return 0;
    
    const applicable = product.pricing.bulkDiscounts
      .filter(d => quantity >= d.minQuantity)
      .sort((a, b) => b.discount - a.discount)[0];
    
    return applicable ? applicable.discount : 0;
  }

  async getProducts(filters = {}) {
    let products = Array.from(this.products.values())
      .filter(p => p.status === 'active');

    if (filters.category) products = products.filter(p => p.category === filters.category);
    if (filters.subcategory) products = products.filter(p => p.subcategory === filters.subcategory);
    if (filters.sustainable) products = products.filter(p => p.cultural.sustainable);
    if (filters.traditional) products = products.filter(p => p.cultural.traditionalSource);

    return products.map(p => ({
      productId: p.productId,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      thumbnail: p.images[0],
      unitPrice: p.pricing.unitPrice,
      unit: p.pricing.unit,
      inStock: p.inventory.quantity > 0,
      sustainable: p.cultural.sustainable
    }));
  }

  async getToolLibrary(filters = {}) {
    let tools = Array.from(this.toolLibrary.values())
      .filter(t => t.status === 'active');

    if (filters.category) tools = tools.filter(t => t.category === filters.category);
    if (filters.available) tools = tools.filter(t => t.availability.status === 'available');
    if (filters.location) tools = tools.filter(t => t.availability.location === filters.location);

    return tools.map(t => ({
      toolId: t.toolId,
      name: t.name,
      category: t.category,
      condition: t.specifications.condition,
      dailyRate: t.rental.dailyRate,
      location: t.availability.location,
      available: t.availability.status === 'available'
    }));
  }

  calculateDays(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new MaterialsToolsService();
