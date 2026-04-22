/**
 * PILLAR 8: LAND & FOOD
 * Regeneration and stewardship marketplace
 */

class LandFoodService {
  constructor() {
    this.products = new Map();
    this.seeds = new Map();
    this.stewardships = new Map();
    this.orders = new Map();
  }

  async createProduct(seller, productData) {
    const product = {
      productId: this.generateId('LF'),
      pillar: 'land_food',
      seller: seller,
      type: productData.type, // 'food', 'seed', 'plant', 'handcrafted'
      category: productData.category, // 'heirloom', 'wild_harvested', 'organic', 'traditional'
      name: productData.name,
      description: productData.description,
      origin: {
        nation: productData.nation,
        community: productData.community,
        land: productData.landDescription,
        harvestMethod: productData.harvestMethod
      },
      specifications: {
        weight: productData.weight,
        quantity: productData.quantity,
        packaging: productData.packaging,
        shelfLife: productData.shelfLife,
        storage: productData.storageInstructions
      },
      cultural: {
        traditionalUses: productData.traditionalUses || [],
        stories: productData.stories || [],
        seasonal: productData.seasonal || false,
        harvestSeason: productData.harvestSeason || null
      },
      certifications: {
        organic: productData.organic || false,
        wildCrafted: productData.wildCrafted || false,
        traditional: productData.traditional || false,
        certificates: productData.certificates || []
      },
      pricing: {
        price: productData.price,
        currency: productData.currency || 'INDI',
        unit: productData.unit || 'item'
      },
      images: productData.images || [],
      inventory: {
        quantity: productData.stockQuantity || 0,
        trackInventory: true
      },
      shipping: {
        restrictions: productData.shippingRestrictions || [],
        perishable: productData.perishable || false,
        requiresCold: productData.requiresCold || false
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.products.set(product.productId, product);

    return {
      success: true,
      productId: product.productId,
      name: product.name,
      status: product.status
    };
  }

  async createSeedListing(grower, seedData) {
    const seed = {
      seedId: this.generateId('SEED'),
      pillar: 'land_food',
      grower: grower,
      name: seedData.name,
      variety: seedData.variety,
      species: seedData.species,
      origin: {
        nation: seedData.nation,
        community: seedData.community,
        familyLineage: seedData.familyLineage || null,
        generationsSaved: seedData.generationsSaved || null
      },
      characteristics: {
        type: seedData.seedType, // 'heirloom', 'landrace', 'wild', 'cultivated'
        growthHabit: seedData.growthHabit,
        daysToMaturity: seedData.daysToMaturity,
        climate: seedData.climate,
        soil: seedData.soil
      },
      cultural: {
        traditionalUses: seedData.traditionalUses || [],
        stories: seedData.stories || [],
        ceremonies: seedData.ceremonies || [],
        preservationStory: seedData.preservationStory || null
      },
      package: {
        quantity: seedData.seedQuantity,
        viability: seedData.viability,
        harvestYear: seedData.harvestYear,
        germinationRate: seedData.germinationRate
      },
      pricing: {
        price: seedData.price,
        currency: seedData.currency || 'INDI',
        bulkPricing: seedData.bulkPricing || []
      },
      growing: {
        instructions: seedData.plantingInstructions || null,
        tips: seedData.growingTips || [],
        companionPlants: seedData.companionPlants || []
      },
      images: seedData.images || [],
      inventory: seedData.inventory || 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.seeds.set(seed.seedId, seed);

    return {
      success: true,
      seedId: seed.seedId,
      name: seed.name,
      variety: seed.variety
    };
  }

  async createStewardshipProject(creator, projectData) {
    const project = {
      projectId: this.generateId('STWD'),
      pillar: 'land_food',
      creator: creator,
      name: projectData.name,
      description: projectData.description,
      type: projectData.type, // 'land_restoration', 'seed_bank', 'water_protection', 'forest_garden'
      location: {
        nation: projectData.nation,
        community: projectData.community,
        acres: projectData.acres,
        description: projectData.locationDescription
      },
      goals: projectData.goals || [],
      timeline: {
        start: projectData.startDate,
        phases: projectData.phases || []
      },
      funding: {
        goal: projectData.fundingGoal,
        raised: 0,
        currency: projectData.currency || 'INDI',
        contributors: 0
      },
      activities: projectData.activities || [],
      impact: {
        trees: projectData.impactTrees || 0,
        water: projectData.impactWater || 0,
        species: projectData.impactSpecies || 0,
        carbon: projectData.impactCarbon || 0
      },
      team: projectData.team || [],
      updates: [],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.stewardships.set(project.projectId, project);

    return {
      success: true,
      projectId: project.projectId,
      name: project.name,
      fundingGoal: project.funding.goal
    };
  }

  async contributeToStewardship(contributor, projectId, contributionData) {
    const project = this.stewardships.get(projectId);
    if (!project) throw new Error('Project not found');

    const contribution = {
      contributionId: this.generateId('CNT'),
      projectId: projectId,
      contributor: contributor,
      amount: contributionData.amount,
      currency: contributionData.currency || 'INDI',
      type: contributionData.type || 'financial', // 'financial', 'labor', 'materials', 'expertise'
      message: contributionData.message || null,
      txId: contributionData.txId,
      createdAt: new Date().toISOString()
    };

    project.funding.raised += contribution.amount;
    project.funding.contributors++;

    return {
      success: true,
      contributionId: contribution.contributionId,
      project: project.name,
      totalRaised: project.funding.raised,
      percentFunded: Math.round((project.funding.raised / project.funding.goal) * 100)
    };
  }

  async createOrder(buyer, orderData) {
    const order = {
      orderId: this.generateId('ORD'),
      pillar: 'land_food',
      buyer: buyer,
      items: orderData.items.map(item => {
        const product = this.products.get(item.productId) || this.seeds.get(item.productId);
        return {
          productId: item.productId,
          name: product?.name || product?.seedId,
          price: product?.pricing?.price,
          quantity: item.quantity,
          seller: product?.seller || product?.grower
        };
      }),
      totals: {
        subtotal: 0,
        shipping: 0,
        total: 0
      },
      shipping: {
        address: orderData.shippingAddress,
        method: orderData.shippingMethod,
        status: 'pending'
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    order.totals.subtotal = order.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    order.totals.total = order.totals.subtotal + order.totals.shipping;

    this.orders.set(order.orderId, order);

    return {
      success: true,
      orderId: order.orderId,
      total: order.totals.total
    };
  }

  async getProducts(filters = {}) {
    let products = Array.from(this.products.values())
      .filter(p => p.status === 'active');

    if (filters.type) products = products.filter(p => p.type === filters.type);
    if (filters.nation) products = products.filter(p => p.origin.nation === filters.nation);
    if (filters.category) products = products.filter(p => p.category === filters.category);
    if (filters.organic) products = products.filter(p => p.certifications.organic);

    return products.map(p => ({
      productId: p.productId,
      name: p.name,
      type: p.type,
      category: p.category,
      thumbnail: p.images[0],
      price: p.pricing.price,
      origin: p.origin.nation,
      inStock: p.inventory.quantity > 0
    }));
  }

  async getSeeds(filters = {}) {
    let seeds = Array.from(this.seeds.values())
      .filter(s => s.status === 'active');

    if (filters.nation) seeds = seeds.filter(s => s.origin.nation === filters.nation);
    if (filters.type) seeds = seeds.filter(s => s.characteristics.type === filters.type);
    if (filters.species) seeds = seeds.filter(s => s.species === filters.species);

    return seeds.map(s => ({
      seedId: s.seedId,
      name: s.name,
      variety: s.variety,
      type: s.characteristics.type,
      thumbnail: s.images[0],
      price: s.pricing.price,
      origin: s.origin.nation,
      inStock: s.inventory > 0
    }));
  }

  async getStewardshipProjects(filters = {}) {
    let projects = Array.from(this.stewardships.values())
      .filter(p => p.status === 'active');

    if (filters.nation) projects = projects.filter(p => p.location.nation === filters.nation);
    if (filters.type) projects = projects.filter(p => p.type === filters.type);

    return projects.map(p => ({
      projectId: p.projectId,
      name: p.name,
      type: p.type,
      location: p.location.nation,
      goal: p.funding.goal,
      raised: p.funding.raised,
      percentFunded: Math.round((p.funding.raised / p.funding.goal) * 100),
      acres: p.location.acres
    }));
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new LandFoodService();
