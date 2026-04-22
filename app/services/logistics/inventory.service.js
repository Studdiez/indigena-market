/**
 * Inventory Management Service
 * Track physical artwork inventory
 */

class InventoryService {
  constructor() {
    this.inventory = new Map();
    this.warehouses = new Map();
    this.movements = new Map();
    this.initializeWarehouses();
  }

  initializeWarehouses() {
    // Tribal community warehouses
    const warehouses = [
      {
        id: 'WH_NN_001',
        name: 'Navajo Nation Art Repository',
        type: 'tribal',
        location: {
          address: 'Window Rock, AZ',
          nation: 'Navajo',
          coordinates: { lat: 35.6806, lng: -109.0526 }
        },
        facilities: ['climate_controlled', 'secure_vault', 'exhibition_space'],
        capacity: 1000,
        current: 0,
        contact: {
          name: 'Cultural Affairs Office',
          phone: '+1-928-XXX-XXXX',
          email: 'warehouse@navajoarts.gov'
        }
      },
      {
        id: 'WH_CN_001',
        name: 'Cherokee Nation Cultural Storage',
        type: 'tribal',
        location: {
          address: 'Tahlequah, OK',
          nation: 'Cherokee',
          coordinates: { lat: 35.9154, lng: -94.9699 }
        },
        facilities: ['climate_controlled', 'secure_storage'],
        capacity: 750,
        current: 0,
        contact: {
          name: 'Heritage Preservation',
          phone: '+1-918-XXX-XXXX',
          email: 'storage@cherokee.org'
        }
      },
      {
        id: 'WH_MAIN_001',
        name: 'Indigena Central Fulfillment',
        type: 'commercial',
        location: {
          address: 'Phoenix, AZ',
          coordinates: { lat: 33.4484, lng: -112.0740 }
        },
        facilities: ['climate_controlled', 'secure_vault', 'packaging', 'photography'],
        capacity: 5000,
        current: 0,
        contact: {
          name: 'Operations Center',
          phone: '+1-602-XXX-XXXX',
          email: 'ops@indigenamarket.com'
        }
      }
    ];

    warehouses.forEach(wh => {
      this.warehouses.set(wh.id, wh);
    });
  }

  /**
   * Add item to inventory
   */
  async addItem(itemData) {
    try {
      const {
        nftId,
        owner,
        name,
        description,
        artist,
        dimensions,
        weight,
        materials,
        year,
        condition,
        value,
        warehouseId,
        storageRequirements,
        images
      } = itemData;

      // Check warehouse capacity
      const warehouse = this.warehouses.get(warehouseId);
      if (!warehouse) throw new Error('Warehouse not found');
      if (warehouse.current >= warehouse.capacity) {
        throw new Error('Warehouse at capacity');
      }

      // Generate unique inventory ID
      const inventoryId = this.generateInventoryId();

      const item = {
        inventoryId: inventoryId,
        nftId: nftId,
        owner: owner,
        name: name,
        description: description,
        artist: artist,
        specifications: {
          dimensions: dimensions,
          weight: weight,
          materials: materials,
          year: year
        },
        condition: {
          current: condition || 'excellent',
          history: [{
            condition: condition || 'excellent',
            date: new Date().toISOString(),
            assessedBy: 'intake'
          }]
        },
        value: {
          declared: value,
          appraised: null,
          appraisalDate: null
        },
        location: {
          warehouseId: warehouseId,
          zone: null,
          shelf: null,
          bin: null
        },
        storage: {
          requirements: storageRequirements || ['standard'],
          temperature: null,
          humidity: null
        },
        status: 'in_storage', // 'in_storage', 'in_transit', 'on_exhibition', 'sold', 'returned'
        images: images || [],
        documents: {
          certificateOfAuthenticity: null,
          appraisal: null,
          provenance: null,
          insurance: null
        },
        history: [{
          action: 'received',
          date: new Date().toISOString(),
          from: null,
          to: warehouseId,
          notes: 'Initial intake'
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Assign storage location
      item.location = await this.assignStorageLocation(warehouseId, storageRequirements);

      // Update warehouse count
      warehouse.current++;

      this.inventory.set(inventoryId, item);

      return {
        success: true,
        inventoryId: inventoryId,
        location: item.location,
        message: 'Item added to inventory'
      };
    } catch (error) {
      console.error('Add item error:', error);
      throw error;
    }
  }

  /**
   * Assign storage location
   */
  async assignStorageLocation(warehouseId, requirements) {
    // Simplified location assignment
    const warehouse = this.warehouses.get(warehouseId);
    
    return {
      warehouseId: warehouseId,
      zone: requirements?.includes('climate_controlled') ? 'A' : 'B',
      shelf: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      bin: Math.floor(Math.random() * 100) + 1
    };
  }

  /**
   * Move item between locations
   */
  async moveItem(inventoryId, moveData) {
    try {
      const item = this.inventory.get(inventoryId);
      if (!item) throw new Error('Item not found');

      const { fromLocation, toLocation, reason, authorizedBy } = moveData;

      // Update previous warehouse count
      const fromWarehouse = this.warehouses.get(item.location.warehouseId);
      if (fromWarehouse) fromWarehouse.current--;

      // Update to warehouse count
      const toWarehouse = this.warehouses.get(toLocation.warehouseId);
      if (toWarehouse) toWarehouse.current++;

      // Record movement
      const movement = {
        movementId: this.generateMovementId(),
        inventoryId: inventoryId,
        from: item.location,
        to: toLocation,
        reason: reason,
        authorizedBy: authorizedBy,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      this.movements.set(movement.movementId, movement);

      // Update item
      item.location = toLocation;
      item.history.push({
        action: 'moved',
        date: movement.timestamp,
        from: fromLocation,
        to: toLocation,
        movementId: movement.movementId,
        notes: reason
      });
      item.updatedAt = movement.timestamp;

      return {
        success: true,
        movementId: movement.movementId,
        newLocation: toLocation
      };
    } catch (error) {
      console.error('Move item error:', error);
      throw error;
    }
  }

  /**
   * Update item condition
   */
  async updateCondition(inventoryId, conditionData) {
    try {
      const item = this.inventory.get(inventoryId);
      if (!item) throw new Error('Item not found');

      const { condition, assessedBy, notes, images } = conditionData;

      item.condition.history.push({
        condition: condition,
        date: new Date().toISOString(),
        assessedBy: assessedBy,
        notes: notes,
        images: images || []
      });

      item.condition.current = condition;
      item.updatedAt = new Date().toISOString();

      return {
        success: true,
        inventoryId: inventoryId,
        newCondition: condition,
        assessmentCount: item.condition.history.length
      };
    } catch (error) {
      console.error('Update condition error:', error);
      throw error;
    }
  }

  /**
   * Update item value/appraisal
   */
  async updateAppraisal(inventoryId, appraisalData) {
    try {
      const item = this.inventory.get(inventoryId);
      if (!item) throw new Error('Item not found');

      const { appraisedValue, appraiser, certificate, date } = appraisalData;

      item.value.appraised = appraisedValue;
      item.value.appraisalDate = date || new Date().toISOString();
      item.documents.appraisal = certificate;
      item.updatedAt = new Date().toISOString();

      return {
        success: true,
        inventoryId: inventoryId,
        appraisedValue: appraisedValue,
        previousValue: item.value.declared,
        appreciation: appraisedValue - item.value.declared
      };
    } catch (error) {
      console.error('Update appraisal error:', error);
      throw error;
    }
  }

  /**
   * Get item details
   */
  async getItem(inventoryId, requester) {
    const item = this.inventory.get(inventoryId);
    if (!item) throw new Error('Item not found');

    // Check authorization
    if (item.owner !== requester) {
      throw new Error('Not authorized');
    }

    const warehouse = this.warehouses.get(item.location.warehouseId);

    return {
      ...item,
      warehouse: warehouse ? {
        id: warehouse.id,
        name: warehouse.name,
        type: warehouse.type,
        location: warehouse.location
      } : null
    };
  }

  /**
   * Get inventory by owner
   */
  async getOwnerInventory(ownerAddress) {
    const items = Array.from(this.inventory.values())
      .filter(item => item.owner === ownerAddress)
      .map(item => ({
        inventoryId: item.inventoryId,
        nftId: item.nftId,
        name: item.name,
        artist: item.artist,
        status: item.status,
        location: item.location,
        condition: item.condition.current,
        value: item.value,
        updatedAt: item.updatedAt
      }));

    return {
      owner: ownerAddress,
      totalItems: items.length,
      items: items
    };
  }

  /**
   * Get warehouse inventory
   */
  async getWarehouseInventory(warehouseId) {
    const warehouse = this.warehouses.get(warehouseId);
    if (!warehouse) throw new Error('Warehouse not found');

    const items = Array.from(this.inventory.values())
      .filter(item => item.location.warehouseId === warehouseId)
      .map(item => ({
        inventoryId: item.inventoryId,
        nftId: item.nftId,
        name: item.name,
        owner: item.owner,
        location: item.location,
        status: item.status
      }));

    return {
      warehouse: {
        id: warehouse.id,
        name: warehouse.name,
        location: warehouse.location
      },
      capacity: warehouse.capacity,
      current: warehouse.current,
      available: warehouse.capacity - warehouse.current,
      items: items
    };
  }

  /**
   * Get all warehouses
   */
  async getWarehouses() {
    return Array.from(this.warehouses.values()).map(wh => ({
      id: wh.id,
      name: wh.name,
      type: wh.type,
      location: wh.location,
      facilities: wh.facilities,
      capacity: wh.capacity,
      available: wh.capacity - wh.current
    }));
  }

  /**
   * Mark item as sold
   */
  async markSold(inventoryId, saleData) {
    try {
      const item = this.inventory.get(inventoryId);
      if (!item) throw new Error('Item not found');

      item.status = 'sold';
      item.sale = {
        buyer: saleData.buyer,
        price: saleData.price,
        date: new Date().toISOString(),
        txId: saleData.txId
      };
      item.history.push({
        action: 'sold',
        date: item.sale.date,
        to: saleData.buyer,
        price: saleData.price,
        notes: 'Item sold'
      });

      // Decrement warehouse count
      const warehouse = this.warehouses.get(item.location.warehouseId);
      if (warehouse) warehouse.current--;

      return {
        success: true,
        inventoryId: inventoryId,
        status: 'sold',
        salePrice: saleData.price
      };
    } catch (error) {
      console.error('Mark sold error:', error);
      throw error;
    }
  }

  /**
   * Get movement history
   */
  async getMovementHistory(inventoryId) {
    const movements = Array.from(this.movements.values())
      .filter(m => m.inventoryId === inventoryId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      inventoryId: inventoryId,
      movements: movements
    };
  }

  generateInventoryId() {
    return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateMovementId() {
    return `MOV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new InventoryService();
