/**
 * Tax Reporting Service
 * Automated tax calculations and reporting
 */

const indiToken = require('./indiToken.service.js');

class TaxReportingService {
  constructor() {
    this.reports = new Map();
    this.taxRules = new Map();
    this.initializeTaxRules();
  }

  initializeTaxRules() {
    // Tax rules by jurisdiction
    this.taxRules.set('USA', {
      name: 'United States',
      currency: 'USD',
      shortTermRate: 0.37, // Up to 37% for short-term
      longTermRate: 0.20,  // Up to 20% for long-term
      longTermThreshold: 365, // days
      nftTaxRate: 0.28,    // 28% for collectibles
      reportingThreshold: 600, // $600
      forms: ['1099', '8949', 'Schedule D'],
      deadlines: {
        filing: '04-15',
        extension: '10-15'
      }
    });

    this.taxRules.set('CAN', {
      name: 'Canada',
      currency: 'CAD',
      capitalGainsRate: 0.50, // 50% of gains taxable
      businessIncomeRate: 0.33,
      reportingThreshold: 0,
      forms: ['T5008', 'Schedule 3'],
      deadlines: {
        filing: '04-30',
        selfEmployed: '06-15'
      }
    });

    this.taxRules.set('UK', {
      name: 'United Kingdom',
      currency: 'GBP',
      annualExemption: 12300, // £12,300 tax-free
      basicRate: 0.10,
      higherRate: 0.20,
      reportingThreshold: 12300,
      forms: ['SA108'],
      deadlines: {
        filing: '01-31'
      }
    });

    this.taxRules.set('EU', {
      name: 'European Union (General)',
      currency: 'EUR',
      variesByCountry: true,
      generalGuidance: 'Tax treatment varies by member state'
    });
  }

  /**
   * Record a taxable transaction
   */
  async recordTransaction(userAddress, transactionData) {
    try {
      const {
        type, // 'sale', 'purchase', 'swap', 'airdrop', 'staking_reward', 'royalty'
        asset,
        amount,
        valueAtTransaction,
        costBasis,
        date,
        txId,
        buyer,
        seller
      } = transactionData;

      const transaction = {
        recordId: this.generateRecordId(),
        userAddress: userAddress,
        type: type,
        asset: {
          name: asset.name,
          nftId: asset.nftId || null,
          tokenId: asset.tokenId || null
        },
        amount: amount,
        valueAtTransaction: valueAtTransaction, // in USD
        costBasis: costBasis, // in USD (for calculating gains)
        gainLoss: type === 'sale' ? valueAtTransaction - costBasis : 0,
        date: date,
        txId: txId,
        counterparty: type === 'sale' ? buyer : (type === 'purchase' ? seller : null),
        jurisdiction: transactionData.jurisdiction || 'USA',
        recordedAt: new Date().toISOString(),
        includedInReport: false
      };

      // Store transaction
      const userKey = `${userAddress}-${new Date(date).getFullYear()}`;
      if (!this.reports.has(userKey)) {
        this.reports.set(userKey, {
          userAddress: userAddress,
          year: new Date(date).getFullYear(),
          transactions: [],
          summary: null,
          generatedAt: null
        });
      }

      const report = this.reports.get(userKey);
      report.transactions.push(transaction);

      return {
        success: true,
        recordId: transaction.recordId,
        type: type,
        gainLoss: transaction.gainLoss
      };
    } catch (error) {
      console.error('Record transaction error:', error);
      throw error;
    }
  }

  /**
   * Generate annual tax report
   */
  async generateReport(userAddress, year, jurisdiction = 'USA') {
    try {
      const userKey = `${userAddress}-${year}`;
      let report = this.reports.get(userKey);

      if (!report) {
        report = {
          userAddress: userAddress,
          year: year,
          transactions: [],
          summary: null,
          generatedAt: null
        };
      }

      const taxRules = this.taxRules.get(jurisdiction);
      if (!taxRules) {
        throw new Error(`Tax rules not available for jurisdiction: ${jurisdiction}`);
      }

      // Calculate summary
      const summary = this.calculateTaxSummary(report.transactions, taxRules, year);

      report.summary = summary;
      report.generatedAt = new Date().toISOString();
      report.jurisdiction = jurisdiction;
      report.taxRules = taxRules;

      this.reports.set(userKey, report);

      // Mark transactions as included
      report.transactions.forEach(t => t.includedInReport = true);

      return {
        success: true,
        reportId: `${userAddress}-${year}`,
        year: year,
        jurisdiction: jurisdiction,
        summary: summary,
        generatedAt: report.generatedAt,
        forms: this.generateFormData(report, taxRules)
      };
    } catch (error) {
      console.error('Generate report error:', error);
      throw error;
    }
  }

  calculateTaxSummary(transactions, taxRules, year) {
    const sales = transactions.filter(t => t.type === 'sale');
    const purchases = transactions.filter(t => t.type === 'purchase');
    const rewards = transactions.filter(t => t.type === 'staking_reward' || t.type === 'airdrop');
    const royalties = transactions.filter(t => t.type === 'royalty');

    // Calculate gains/losses
    let shortTermGains = 0;
    let shortTermLosses = 0;
    let longTermGains = 0;
    let longTermLosses = 0;

    sales.forEach(sale => {
      const holdingPeriod = this.calculateHoldingPeriod(sale.asset.nftId, sale.date, transactions);
      
      if (sale.gainLoss > 0) {
        if (holdingPeriod <= taxRules.longTermThreshold) {
          shortTermGains += sale.gainLoss;
        } else {
          longTermGains += sale.gainLoss;
        }
      } else {
        if (holdingPeriod <= taxRules.longTermThreshold) {
          shortTermLosses += Math.abs(sale.gainLoss);
        } else {
          longTermLosses += Math.abs(sale.gainLoss);
        }
      }
    });

    // NFT-specific calculations (collectibles in US)
    let nftGains = 0;
    let nftLosses = 0;
    sales.filter(s => s.asset.nftId).forEach(sale => {
      if (sale.gainLoss > 0) {
        nftGains += sale.gainLoss;
      } else {
        nftLosses += Math.abs(sale.gainLoss);
      }
    });

    // Income from rewards and royalties
    const stakingIncome = rewards.reduce((sum, r) => sum + r.valueAtTransaction, 0);
    const royaltyIncome = royalties.reduce((sum, r) => sum + r.valueAtTransaction, 0);

    // Net calculations
    const netShortTerm = shortTermGains - shortTermLosses;
    const netLongTerm = longTermGains - longTermLosses;
    const netNft = nftGains - nftLosses;

    // Estimated tax liability
    let estimatedTax = 0;
    if (taxRules.shortTermRate) {
      estimatedTax += Math.max(0, netShortTerm) * taxRules.shortTermRate;
    }
    if (taxRules.longTermRate) {
      estimatedTax += Math.max(0, netLongTerm) * taxRules.longTermRate;
    }
    if (taxRules.nftTaxRate) {
      estimatedTax += Math.max(0, netNft) * taxRules.nftTaxRate;
    }
    if (taxRules.capitalGainsRate) {
      // Canada style: 50% of gains taxable at marginal rate (assume 33%)
      estimatedTax += (Math.max(0, netShortTerm + netLongTerm) * taxRules.capitalGainsRate * 0.33);
    }

    // Income tax on rewards
    estimatedTax += (stakingIncome + royaltyIncome) * 0.25; // Assume 25% income tax

    return {
      year: year,
      totalTransactions: transactions.length,
      sales: {
        count: sales.length,
        proceeds: sales.reduce((sum, s) => sum + s.valueAtTransaction, 0),
        costBasis: sales.reduce((sum, s) => sum + s.costBasis, 0)
      },
      gains: {
        shortTerm: { gains: shortTermGains, losses: shortTermLosses, net: netShortTerm },
        longTerm: { gains: longTermGains, losses: longTermLosses, net: netLongTerm },
        nft: { gains: nftGains, losses: nftLosses, net: netNft },
        totalNet: netShortTerm + netLongTerm + netNft
      },
      income: {
        staking: stakingIncome,
        royalties: royaltyIncome,
        total: stakingIncome + royaltyIncome
      },
      estimatedTax: estimatedTax,
      currency: taxRules.currency
    };
  }

  calculateHoldingPeriod(nftId, saleDate, allTransactions) {
    if (!nftId) return 0;

    // Find purchase transaction
    const purchase = allTransactions.find(t => 
      t.type === 'purchase' && t.asset.nftId === nftId
    );

    if (!purchase) return 0;

    const purchaseDate = new Date(purchase.date);
    const sale = new Date(saleDate);
    return (sale - purchaseDate) / (1000 * 60 * 60 * 24);
  }

  generateFormData(report, taxRules) {
    const forms = {};

    if (taxRules.forms.includes('8949')) {
      // US Form 8949 data
      forms['8949'] = {
        description: 'Sales and Other Dispositions of Capital Assets',
        shortTerm: report.transactions
          .filter(t => t.type === 'sale')
          .filter(t => {
            const holdingPeriod = this.calculateHoldingPeriod(t.asset.nftId, t.date, report.transactions);
            return holdingPeriod <= 365;
          })
          .map(t => ({
            description: t.asset.name,
            dateAcquired: this.findAcquisitionDate(t.asset.nftId, report.transactions),
            dateSold: t.date,
            proceeds: t.valueAtTransaction,
            costBasis: t.costBasis,
            gainLoss: t.gainLoss
          })),
        longTerm: report.transactions
          .filter(t => t.type === 'sale')
          .filter(t => {
            const holdingPeriod = this.calculateHoldingPeriod(t.asset.nftId, t.date, report.transactions);
            return holdingPeriod > 365;
          })
          .map(t => ({
            description: t.asset.name,
            dateAcquired: this.findAcquisitionDate(t.asset.nftId, report.transactions),
            dateSold: t.date,
            proceeds: t.valueAtTransaction,
            costBasis: t.costBasis,
            gainLoss: t.gainLoss
          }))
      };
    }

    if (taxRules.forms.includes('Schedule D')) {
      forms['Schedule D'] = {
        description: 'Capital Gains and Losses',
        summary: report.summary.gains
      };
    }

    return forms;
  }

  findAcquisitionDate(nftId, transactions) {
    const purchase = transactions.find(t => 
      t.type === 'purchase' && t.asset.nftId === nftId
    );
    return purchase ? purchase.date : 'Various';
  }

  /**
   * Get tax report
   */
  async getReport(userAddress, year) {
    const userKey = `${userAddress}-${year}`;
    const report = this.reports.get(userKey);

    if (!report || !report.summary) {
      throw new Error('Report not found. Generate it first.');
    }

    return {
      reportId: userKey,
      year: year,
      jurisdiction: report.jurisdiction,
      summary: report.summary,
      transactions: report.transactions.map(t => ({
        date: t.date,
        type: t.type,
        asset: t.asset.name,
        amount: t.amount,
        value: t.valueAtTransaction,
        gainLoss: t.gainLoss
      })),
      generatedAt: report.generatedAt,
      forms: this.generateFormData(report, report.taxRules)
    };
  }

  /**
   * Export report in various formats
   */
  async exportReport(userAddress, year, format = 'json') {
    const report = await this.getReport(userAddress, year);

    switch (format.toLowerCase()) {
      case 'csv':
        return this.exportToCSV(report);
      case 'pdf':
        return this.exportToPDF(report);
      case 'turbotax':
        return this.exportToTurboTax(report);
      case 'json':
      default:
        return report;
    }
  }

  exportToCSV(report) {
    const headers = ['Date,Type,Asset,Amount,Value USD,Cost Basis,Gain/Loss'];
    const rows = report.transactions.map(t => 
      `${t.date},${t.type},${t.asset},${t.amount},${t.value},${t.costBasis || ''},${t.gainLoss}`
    );
    
    return {
      format: 'csv',
      content: headers.concat(rows).join('\n'),
      filename: `indigena_tax_${report.year}.csv`
    };
  }

  exportToPDF(report) {
    // In production: Generate actual PDF
    return {
      format: 'pdf',
      url: `/downloads/tax-reports/${report.reportId}.pdf`,
      filename: `indigena_tax_${report.year}.pdf`
    };
  }

  exportToTurboTax(report) {
    // TurboTax compatible TXF format
    return {
      format: 'txf',
      content: 'V042\nAindigena_market\n...', // Simplified
      filename: `indigena_tax_${report.year}.txf`
    };
  }

  /**
   * Get supported jurisdictions
   */
  async getJurisdictions() {
    return Array.from(this.taxRules.entries()).map(([code, rules]) => ({
      code: code,
      name: rules.name,
      currency: rules.currency,
      reportingThreshold: rules.reportingThreshold,
      deadlines: rules.deadlines
    }));
  }

  /**
   * Get tax optimization suggestions
   */
  async getTaxOptimization(userAddress, year) {
    const userKey = `${userAddress}-${year}`;
    const report = this.reports.get(userKey);

    if (!report) {
      throw new Error('No transactions found for this year');
    }

    const suggestions = [];
    const summary = report.summary;

    // Loss harvesting suggestion
    if (summary.gains.shortTerm.net > 0) {
      suggestions.push({
        type: 'tax_loss_harvesting',
        description: 'Consider selling underperforming assets to offset short-term gains',
        potentialSavings: summary.gains.shortTerm.net * 0.37
      });
    }

    // Long-term holding suggestion
    const shortTermSales = report.transactions.filter(t => {
      if (t.type !== 'sale') return false;
      const holdingPeriod = this.calculateHoldingPeriod(t.asset.nftId, t.date, report.transactions);
      return holdingPeriod < 365 && holdingPeriod > 300; // Close to 1 year
    });

    if (shortTermSales.length > 0) {
      const potentialSavings = shortTermSales.reduce((sum, t) => {
        const gain = t.gainLoss;
        return sum + (gain * (0.37 - 0.20)); // Difference between short and long term rates
      }, 0);

      suggestions.push({
        type: 'long_term_holding',
        description: `${shortTermSales.length} assets approaching long-term status. Consider holding longer for favorable tax rates.`,
        potentialSavings: potentialSavings
      });
    }

    // Staking income timing
    suggestions.push({
      type: 'income_timing',
      description: 'Consider timing of staking reward claims to manage income tax bracket',
      potentialSavings: 'Varies by bracket'
    });

    return {
      year: year,
      currentEstimatedTax: summary.estimatedTax,
      suggestions: suggestions,
      totalPotentialSavings: suggestions.reduce((sum, s) => sum + (s.potentialSavings || 0), 0)
    };
  }

  generateRecordId() {
    return `TAX-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new TaxReportingService();
