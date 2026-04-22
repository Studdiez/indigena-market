/**
 * Warehouse Management Service
 * Fulfillment and storage operations
 */

class WarehouseService {
  constructor() {
    this.warehouses = new Map();
    this.zones = new Map();
    this.workOrders = new Map();
    this.staff = new Map();
    this.initializeDefaultWarehouses();
  }

  initializeDefaultWarehouses() {
    // Already initialized in inventory service, but add operational details
    const operationalWarehouses = [
      {
        id: 'WH_MAIN_001',
        operations: {
          hours: {
            receiving: 'Mon-Fri 8AM-6PM',
            shipping: 'Mon-Fri 9AM-5PM',
            pickup: 'Mon-Sat 10AM-4PM'
          },
          capabilities: ['receiving', 'storage', 'picking', 'packing', 'shipping', 'returns'],
          equipment: ['forklift', 'climate_control', 'security_system', 'barcode_scanners'],
          certifications: ['fine_art_handling', 'indigenous_cultural_sensitivity']
        },
        zones: [
          { code: 'A', type: 'climate_controlled', temp: '70F', humidity: '50%' },
          { code: 'B', type: 'secure_storage', temp: 'ambient', humidity: 'controlled' },
          { code: 'C', type: 'receiving', temp: 'ambient', humidity: 'ambient' },
          { code: 'D', type: 'shipping', temp: 'ambient', humidity: 'ambient' }
        ]
      }
    ];

    operationalWarehouses.forEach(wh => {
      this.warehouses.set(wh.id, { ...this.warehouses.get(wh.id), ...wh });
      wh.zones.forEach(zone => {
        this.zones.set(`${wh.id}-${zone.code}`, { ...zone, warehouseId: wh.id });
      });
    });
  }

  /**
   * Create work order
   */
  async createWorkOrder(orderData) {
    try {
      const {
        type, // 'receive', 'pick', 'pack', 'ship', 'inspect', 'move'
        priority, // 'low', 'normal', 'high', 'urgent'
        inventoryId,
        shipmentId,
        fromLocation,
        toLocation,
        instructions,
        requiredBy
      } = orderData;

      const workOrder = {
        workOrderId: this.generateWorkOrderId(),
        type: type,
        priority: priority || 'normal',
        status: 'pending', // 'pending', 'assigned', 'in_progress', 'completed', 'cancelled'
        references: {
          inventoryId: inventoryId,
          shipmentId: shipmentId
        },
        locations: {
          from: fromLocation,
          to: toLocation
        },
        instructions: instructions,
        requiredBy: requiredBy,
        assignedTo: null,
        timeline: {
          createdAt: new Date().toISOString(),
          assignedAt: null,
          startedAt: null,
          completedAt: null
        },
        tasks: this.generateTasks(type),
        notes: [],
        quality: {
          inspectionPassed: null,
          inspector: null,
          notes: null
        }
      };

      this.workOrders.set(workOrder.workOrderId, workOrder);

      return {
        success: true,
        workOrderId: workOrder.workOrderId,
        type: type,
        status: 'pending',
        tasks: workOrder.tasks.length,
        message: 'Work order created successfully'
      };
    } catch (error) {
      console.error('Create work order error:', error);
      throw error;
    }
  }

  /**
   * Generate tasks based on work order type
   */
  generateTasks(type) {
    const taskTemplates = {
      'receive': [
        { name: 'Verify shipment', completed: false },
        { name: 'Inspect packaging', completed: false },
        { name: 'Unbox item', completed: false },
        { name: 'Condition assessment', completed: false },
        { name: 'Photograph item', completed: false },
        { name: 'Assign storage location', completed: false },
        { name: 'Update inventory', completed: false }
      ],
      'pick': [
        { name: 'Locate item', completed: false },
        { name: 'Verify item ID', completed: false },
        { name: 'Condition check', completed: false },
        { name: 'Secure for transport', completed: false },
        { name: 'Move to packing', completed: false }
      ],
      'pack': [
        { name: 'Select appropriate materials', completed: false },
        { name: 'Wrap item', completed: false },
        { name: 'Cushion and secure', completed: false },
        { name: 'Apply label', completed: false },
        { name: 'Final inspection', completed: false }
      ],
      'ship': [
        { name: 'Verify shipping label', completed: false },
        { name: 'Apply any special handling', completed: false },
        { name: 'Hand to carrier', completed: false },
        { name: 'Confirm pickup', completed: false },
        { name: 'Update tracking', completed: false }
      ],
      'inspect': [
        { name: 'Visual inspection', completed: false },
        { name: 'Condition documentation', completed: false },
        { name: 'Photograph current state', completed: false },
        { name: 'Compare to records', completed: false },
        { name: 'Report findings', completed: false }
      ],
      'move': [
        { name: 'Locate item at source', completed: false },
        { name: 'Verify condition before move', completed: false },
        { name: 'Secure for transport', completed: false },
        { name: 'Transport to destination', completed: false },
        { name: 'Place in new location', completed: false },
        { name: 'Verify placement', completed: false }
      ]
    };

    return taskTemplates[type] || [{ name: 'Complete work', completed: false }];
  }

  /**
   * Assign work order to staff
   */
  async assignWorkOrder(workOrderId, staffId) {
    try {
      const workOrder = this.workOrders.get(workOrderId);
      if (!workOrder) throw new Error('Work order not found');

      const staff = this.staff.get(staffId);
      if (!staff) throw new Error('Staff member not found');

      workOrder.assignedTo = staffId;
      workOrder.status = 'assigned';
      workOrder.timeline.assignedAt = new Date().toISOString();

      // Update staff workload
      staff.activeWorkOrders.push(workOrderId);

      return {
        success: true,
        workOrderId: workOrderId,
        assignedTo: staff.name,
        status: 'assigned'
      };
    } catch (error) {
      console.error('Assign work order error:', error);
      throw error;
    }
  }

  /**
   * Start work order
   */
  async startWorkOrder(workOrderId, staffId) {
    try {
      const workOrder = this.workOrders.get(workOrderId);
      if (!workOrder) throw new Error('Work order not found');
      if (workOrder.assignedTo !== staffId) {
        throw new Error('Not assigned to this staff member');
      }

      workOrder.status = 'in_progress';
      workOrder.timeline.startedAt = new Date().toISOString();

      return {
        success: true,
        workOrderId: workOrderId,
        status: 'in_progress',
        startedAt: workOrder.timeline.startedAt
      };
    } catch (error) {
      console.error('Start work order error:', error);
      throw error;
    }
  }

  /**
   * Complete task
   */
  async completeTask(workOrderId, taskIndex, staffId, notes) {
    try {
      const workOrder = this.workOrders.get(workOrderId);
      if (!workOrder) throw new Error('Work order not found');
      if (workOrder.assignedTo !== staffId) {
        throw new Error('Not assigned to this staff member');
      }

      if (taskIndex < 0 || taskIndex >= workOrder.tasks.length) {
        throw new Error('Invalid task index');
      }

      workOrder.tasks[taskIndex].completed = true;
      workOrder.tasks[taskIndex].completedAt = new Date().toISOString();
      workOrder.tasks[taskIndex].notes = notes;

      // Check if all tasks complete
      const allComplete = workOrder.tasks.every(t => t.completed);
      if (allComplete) {
        workOrder.status = 'completed';
        workOrder.timeline.completedAt = new Date().toISOString();

        // Remove from staff workload
        const staff = this.staff.get(staffId);
        if (staff) {
          staff.activeWorkOrders = staff.activeWorkOrders.filter(id => id !== workOrderId);
          staff.completedWorkOrders.push(workOrderId);
        }
      }

      return {
        success: true,
        workOrderId: workOrderId,
        taskCompleted: workOrder.tasks[taskIndex].name,
        allComplete: allComplete,
        status: workOrder.status
      };
    } catch (error) {
      console.error('Complete task error:', error);
      throw error;
    }
  }

  /**
   * Record quality inspection
   */
  async recordInspection(workOrderId, inspectionData) {
    try {
      const workOrder = this.workOrders.get(workOrderId);
      if (!workOrder) throw new Error('Work order not found');

      workOrder.quality = {
        inspectionPassed: inspectionData.passed,
        inspector: inspectionData.inspector,
        notes: inspectionData.notes,
        images: inspectionData.images || [],
        inspectedAt: new Date().toISOString()
      };

      if (!inspectionData.passed) {
        workOrder.status = 'quality_hold';
      }

      return {
        success: true,
        workOrderId: workOrderId,
        passed: inspectionData.passed,
        status: workOrder.status
      };
    } catch (error) {
      console.error('Record inspection error:', error);
      throw error;
    }
  }

  /**
   * Get work order details
   */
  async getWorkOrder(workOrderId) {
    const workOrder = this.workOrders.get(workOrderId);
    if (!workOrder) throw new Error('Work order not found');

    const staff = workOrder.assignedTo ? this.staff.get(workOrder.assignedTo) : null;

    return {
      workOrderId: workOrder.workOrderId,
      type: workOrder.type,
      priority: workOrder.priority,
      status: workOrder.status,
      assignedTo: staff ? { id: staff.id, name: staff.name } : null,
      references: workOrder.references,
      tasks: workOrder.tasks,
      progress: {
        total: workOrder.tasks.length,
        completed: workOrder.tasks.filter(t => t.completed).length,
        percentage: Math.round((workOrder.tasks.filter(t => t.completed).length / workOrder.tasks.length) * 100)
      },
      timeline: workOrder.timeline,
      quality: workOrder.quality
    };
  }

  /**
   * Get pending work orders
   */
  async getPendingWorkOrders(warehouseId, type) {
    let orders = Array.from(this.workOrders.values())
      .filter(wo => wo.status === 'pending' || wo.status === 'assigned');

    if (warehouseId) {
      orders = orders.filter(wo => 
        wo.locations.from?.warehouseId === warehouseId ||
        wo.locations.to?.warehouseId === warehouseId
      );
    }

    if (type) {
      orders = orders.filter(wo => wo.type === type);
    }

    // Sort by priority and date
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    orders.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.timeline.createdAt) - new Date(b.timeline.createdAt);
    });

    return {
      total: orders.length,
      orders: orders.map(wo => ({
        workOrderId: wo.workOrderId,
        type: wo.type,
        priority: wo.priority,
        status: wo.status,
        assignedTo: wo.assignedTo,
        createdAt: wo.timeline.createdAt
      }))
    };
  }

  /**
   * Register staff member
   */
  async registerStaff(staffData) {
    try {
      const staff = {
        id: this.generateStaffId(),
        name: staffData.name,
        email: staffData.email,
        role: staffData.role, // 'warehouse', 'inspector', 'manager'
        certifications: staffData.certifications || [],
        warehouseId: staffData.warehouseId,
        activeWorkOrders: [],
        completedWorkOrders: [],
        joinedAt: new Date().toISOString(),
        status: 'active'
      };

      this.staff.set(staff.id, staff);

      return {
        success: true,
        staffId: staff.id,
        name: staff.name,
        role: staff.role
      };
    } catch (error) {
      console.error('Register staff error:', error);
      throw error;
    }
  }

  /**
   * Get warehouse operations dashboard
   */
  async getDashboard(warehouseId) {
    try {
      const warehouse = this.warehouses.get(warehouseId);
      if (!warehouse) throw new Error('Warehouse not found');

      const allOrders = Array.from(this.workOrders.values())
        .filter(wo => 
          wo.locations.from?.warehouseId === warehouseId ||
          wo.locations.to?.warehouseId === warehouseId
        );

      const today = new Date().toDateString();

      return {
        warehouse: {
          id: warehouse.id,
          name: warehouse.name
        },
        operations: {
          hours: warehouse.operations.hours,
          status: 'operational'
        },
        metrics: {
          pendingOrders: allOrders.filter(wo => wo.status === 'pending').length,
          inProgress: allOrders.filter(wo => wo.status === 'in_progress').length,
          completedToday: allOrders.filter(wo => 
            wo.status === 'completed' && 
            new Date(wo.timeline.completedAt).toDateString() === today
          ).length,
          qualityHolds: allOrders.filter(wo => wo.status === 'quality_hold').length
        },
        staff: Array.from(this.staff.values())
          .filter(s => s.warehouseId === warehouseId)
          .map(s => ({
            id: s.id,
            name: s.name,
            activeOrders: s.activeWorkOrders.length,
            completedOrders: s.completedWorkOrders.length
          })),
        urgentOrders: allOrders
          .filter(wo => wo.priority === 'urgent' && wo.status !== 'completed')
          .map(wo => ({
            workOrderId: wo.workOrderId,
            type: wo.type,
            status: wo.status,
            requiredBy: wo.requiredBy
          }))
      };
    } catch (error) {
      console.error('Get dashboard error:', error);
      throw error;
    }
  }

  generateWorkOrderId() {
    return `WO-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateStaffId() {
    return `STF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new WarehouseService();
