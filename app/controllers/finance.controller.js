/**
 * Financial Controller
 * Provides endpoints for:
 * - INDI Token Management
 * - Escrow Service
 * - Installment Payments
 * - Crypto-to-Fiat Bridge
 * - Tax Reporting
 * - Micro-Loans
 */

const indiToken = require('../services/finance/indiToken.service.js');
const escrowService = require('../services/finance/escrow.service.js');
const installmentService = require('../services/finance/installment.service.js');
const fiatBridge = require('../services/finance/fiatBridge.service.js');
const taxReporting = require('../services/finance/taxReporting.service.js');
const microLoan = require('../services/finance/microLoan.service.js');

// ==================== INDI TOKEN ====================

exports.createWallet = async (req, res) => {
  try {
    const { address } = req.body;
    const result = await indiToken.createWallet(address);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWallet = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await indiToken.getWallet(address);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.transfer = async (req, res) => {
  try {
    const { from, to, amount, memo } = req.body;
    const result = await indiToken.transfer(from, to, amount, memo);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.stakeTokens = async (req, res) => {
  try {
    const { address, amount, lockPeriodDays } = req.body;
    const result = await indiToken.stakeTokens(address, amount, lockPeriodDays);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unstakeTokens = async (req, res) => {
  try {
    const { address, stakeId } = req.body;
    const result = await indiToken.unstakeTokens(address, stakeId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await indiToken.getTransactionHistory(address, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTokenomics = async (req, res) => {
  try {
    const result = await indiToken.getTokenomics();
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPlatformFee = async (req, res) => {
  try {
    const { action, amount } = req.query;
    const fee = indiToken.getPlatformFee(action, parseFloat(amount) || 0);
    res.status(200).json({ success: true, action, amount: parseFloat(amount) || 0, fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ESCROW ====================

exports.createEscrow = async (req, res) => {
  try {
    const { buyer, seller, amount, terms } = req.body;
    const result = await escrowService.createEscrow(buyer, seller, amount, terms);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markDelivered = async (req, res) => {
  try {
    const { escrowId } = req.params;
    const { seller } = req.body;
    const result = await escrowService.markDelivered(escrowId, seller);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.releaseEscrow = async (req, res) => {
  try {
    const { escrowId } = req.params;
    const { buyer } = req.body;
    const result = await escrowService.releaseFunds(escrowId, buyer);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.raiseDispute = async (req, res) => {
  try {
    const { escrowId } = req.params;
    const { raisedBy, reason, description, evidence } = req.body;
    const result = await escrowService.raiseDispute(escrowId, raisedBy, { reason, description, evidence });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resolveDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { arbitrator, outcome, reasoning, buyerPercent, sellerPercent } = req.body;
    const result = await escrowService.resolveDispute(disputeId, arbitrator, { outcome, reasoning, buyerPercent, sellerPercent });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelEscrow = async (req, res) => {
  try {
    const { escrowId } = req.params;
    const { requester } = req.body;
    const result = await escrowService.cancelEscrow(escrowId, requester);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEscrow = async (req, res) => {
  try {
    const { escrowId } = req.params;
    const { requester } = req.query;
    const result = await escrowService.getEscrow(escrowId, requester);
    res.status(200).json({ success: true, escrow: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserEscrows = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await escrowService.getUserEscrows(address);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== INSTALLMENTS ====================

exports.calculateCreditScore = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await installmentService.calculateCreditScore(address);
    res.status(200).json({ success: true, credit: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createInstallmentPlan = async (req, res) => {
  try {
    const { buyer, seller, itemDetails, planConfig } = req.body;
    const result = await installmentService.createPlan(buyer, seller, itemDetails, planConfig);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.activateInstallmentPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { buyer } = req.body;
    const result = await installmentService.activatePlan(planId, buyer);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.makeInstallmentPayment = async (req, res) => {
  try {
    const { planId } = req.params;
    const { buyer, amount } = req.body;
    const result = await installmentService.makePayment(planId, buyer, amount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInstallmentPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { requester } = req.query;
    const result = await installmentService.getPlan(planId, requester);
    res.status(200).json({ success: true, plan: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserInstallmentPlans = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await installmentService.getUserPlans(address);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== FIAT BRIDGE ====================

exports.getExchangeRates = async (req, res) => {
  try {
    const result = await fiatBridge.getExchangeRates();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.calculateConversion = async (req, res) => {
  try {
    const { from, to, amount, method } = req.query;
    const result = await fiatBridge.calculateConversion(from, to, parseFloat(amount), method);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSellRequest = async (req, res) => {
  try {
    const { userAddress, amount, targetCurrency, method, bankDetails } = req.body;
    const result = await fiatBridge.createSellRequest(userAddress, amount, targetCurrency, method, bankDetails);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBuyRequest = async (req, res) => {
  try {
    const { userAddress, fiatAmount, fiatCurrency, method } = req.body;
    const result = await fiatBridge.createBuyRequest(userAddress, fiatAmount, fiatCurrency, method);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.confirmFiatPayment = async (req, res) => {
  try {
    const { conversionId } = req.params;
    const { paymentProof } = req.body;
    const result = await fiatBridge.confirmPayment(conversionId, paymentProof);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConversion = async (req, res) => {
  try {
    const { conversionId } = req.params;
    const { userAddress } = req.query;
    const result = await fiatBridge.getConversion(conversionId, userAddress);
    res.status(200).json({ success: true, conversion: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserConversions = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await fiatBridge.getUserConversions(address);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentMethods = async (req, res) => {
  try {
    const { currency } = req.query;
    const result = await fiatBridge.getPaymentMethods(currency);
    res.status(200).json({ success: true, methods: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== TAX REPORTING ====================

exports.recordTaxTransaction = async (req, res) => {
  try {
    const { userAddress, transactionData } = req.body;
    const result = await taxReporting.recordTransaction(userAddress, transactionData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateTaxReport = async (req, res) => {
  try {
    const { userAddress, year, jurisdiction } = req.body;
    const result = await taxReporting.generateReport(userAddress, year, jurisdiction);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTaxReport = async (req, res) => {
  try {
    const { userAddress, year } = req.params;
    const result = await taxReporting.getReport(userAddress, parseInt(year));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportTaxReport = async (req, res) => {
  try {
    const { userAddress, year, format } = req.params;
    const result = await taxReporting.exportReport(userAddress, parseInt(year), format);
    res.status(200).json({ success: true, export: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTaxJurisdictions = async (req, res) => {
  try {
    const result = await taxReporting.getJurisdictions();
    res.status(200).json({ success: true, jurisdictions: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTaxOptimization = async (req, res) => {
  try {
    const { userAddress, year } = req.params;
    const result = await taxReporting.getTaxOptimization(userAddress, parseInt(year));
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== MICRO-LOANS ====================

exports.getLoanPrograms = async (req, res) => {
  try {
    const result = await microLoan.getLoanPrograms();
    res.status(200).json({ success: true, programs: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkLoanEligibility = async (req, res) => {
  try {
    const { address, programId } = req.params;
    const result = await microLoan.checkEligibility(address, programId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyForLoan = async (req, res) => {
  try {
    const { borrower, programId, loanDetails } = req.body;
    const result = await microLoan.applyForLoan(borrower, programId, loanDetails);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { approver } = req.body;
    const result = await microLoan.approveLoan(loanId, approver);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.makeLoanPayment = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { borrower, amount } = req.body;
    const result = await microLoan.makePayment(loanId, borrower, amount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { requester } = req.query;
    const result = await microLoan.getLoan(loanId, requester);
    res.status(200).json({ success: true, loan: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserLoans = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await microLoan.getUserLoans(address);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
