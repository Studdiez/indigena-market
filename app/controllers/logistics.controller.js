/**
 * Logistics Controller
 * Provides endpoints for:
 * - Shipping Integration
 * - Insurance API
 * - Inventory Management
 * - NFC/QR Verification
 * - Warehouse Management
 */

const shippingService = require('../services/logistics/shipping.service.js');
const insuranceService = require('../services/logistics/insurance.service.js');
const inventoryService = require('../services/logistics/inventory.service.js');
const verificationService = require('../services/logistics/verification.service.js');
const warehouseService = require('../services/logistics/warehouse.service.js');

// ==================== SHIPPING ====================

exports.calculateShippingRates = async (req, res) => {
  try {
    const { packageDetails, origin, destination } = req.body;
    const result = await shippingService.calculateRates(packageDetails, origin, destination);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createShipment = async (req, res) => {
  try {
    const result = await shippingService.createShipment(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.schedulePickup = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const result = await shippingService.schedulePickup(shipmentId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.trackShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const result = await shippingService.trackShipment(trackingNumber);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateShipmentStatus = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const result = await shippingService.updateStatus(trackingNumber, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPickupLocations = async (req, res) => {
  try {
    const { nation, zipCode } = req.query;
    const result = await shippingService.getPickupLocations(nation, zipCode);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== INSURANCE ====================

exports.getInsuranceQuote = async (req, res) => {
  try {
    const result = await insuranceService.getQuote(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.purchasePolicy = async (req, res) => {
  try {
    const result = await insuranceService.purchasePolicy(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.activatePolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const result = await insuranceService.activatePolicy(policyId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.fileClaim = async (req, res) => {
  try {
    const { policyId } = req.params;
    const result = await insuranceService.fileClaim(policyId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reviewClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { reviewer, approved, reasoning, payoutAmount } = req.body;
    const result = await insuranceService.reviewClaim(claimId, reviewer, { approved, reasoning, payoutAmount });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processPayout = async (req, res) => {
  try {
    const { claimId } = req.params;
    const result = await insuranceService.processPayout(claimId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { requester } = req.query;
    const result = await insuranceService.getPolicy(policyId, requester);
    res.status(200).json({ success: true, policy: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserPolicies = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await insuranceService.getUserPolicies(address);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.extendPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const result = await insuranceService.extendPolicy(policyId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { owner } = req.body;
    const result = await insuranceService.cancelPolicy(policyId, owner);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== INVENTORY ====================

exports.addInventoryItem = async (req, res) => {
  try {
    const result = await inventoryService.addItem(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.moveInventoryItem = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const result = await inventoryService.moveItem(inventoryId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCondition = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const result = await inventoryService.updateCondition(inventoryId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAppraisal = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const result = await inventoryService.updateAppraisal(inventoryId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInventoryItem = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { requester } = req.query;
    const result = await inventoryService.getItem(inventoryId, requester);
    res.status(200).json({ success: true, item: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOwnerInventory = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await inventoryService.getOwnerInventory(address);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWarehouseInventory = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const result = await inventoryService.getWarehouseInventory(warehouseId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWarehouses = async (req, res) => {
  try {
    const result = await inventoryService.getWarehouses();
    res.status(200).json({ success: true, warehouses: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markSold = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const result = await inventoryService.markSold(inventoryId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMovementHistory = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const result = await inventoryService.getMovementHistory(inventoryId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== VERIFICATION ====================

exports.generateTag = async (req, res) => {
  try {
    const result = await verificationService.generateTag(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.activateTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const result = await verificationService.activateTag(tagId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyArtwork = async (req, res) => {
  try {
    const result = await verificationService.verify(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reportCounterfeit = async (req, res) => {
  try {
    const result = await verificationService.reportCounterfeit(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.batchGenerateTags = async (req, res) => {
  try {
    const result = await verificationService.batchGenerateTags(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTagStats = async (req, res) => {
  try {
    const { tagId } = req.params;
    const result = await verificationService.getTagStats(tagId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.transferTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const result = await verificationService.transferTag(tagId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deactivateTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const { reason, authorizedBy } = req.body;
    const result = await verificationService.deactivateTag(tagId, reason, authorizedBy);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== WAREHOUSE ====================

exports.createWorkOrder = async (req, res) => {
  try {
    const result = await warehouseService.createWorkOrder(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignWorkOrder = async (req, res) => {
  try {
    const { workOrderId } = req.params;
    const { staffId } = req.body;
    const result = await warehouseService.assignWorkOrder(workOrderId, staffId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.startWorkOrder = async (req, res) => {
  try {
    const { workOrderId } = req.params;
    const { staffId } = req.body;
    const result = await warehouseService.startWorkOrder(workOrderId, staffId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { workOrderId, taskIndex } = req.params;
    const { staffId, notes } = req.body;
    const result = await warehouseService.completeTask(workOrderId, parseInt(taskIndex), staffId, notes);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recordInspection = async (req, res) => {
  try {
    const { workOrderId } = req.params;
    const result = await warehouseService.recordInspection(workOrderId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkOrder = async (req, res) => {
  try {
    const { workOrderId } = req.params;
    const result = await warehouseService.getWorkOrder(workOrderId);
    res.status(200).json({ success: true, workOrder: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPendingWorkOrders = async (req, res) => {
  try {
    const { warehouseId, type } = req.query;
    const result = await warehouseService.getPendingWorkOrders(warehouseId, type);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerStaff = async (req, res) => {
  try {
    const result = await warehouseService.registerStaff(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWarehouseDashboard = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const result = await warehouseService.getDashboard(warehouseId);
    res.status(200).json({ success: true, dashboard: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
