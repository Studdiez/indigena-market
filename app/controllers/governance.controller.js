/**
 * Governance Controller
 * DAO governance and voting
 */

const daoMembership = require('../services/governance/daoMembership.service.js');
const votingSystem = require('../services/governance/votingSystem.service.js');
const treasury = require('../services/governance/treasury.service.js');
const proposalService = require('../services/governance/proposal.service.js');

// ==================== DAO MEMBERSHIP ====================

exports.joinDAO = async (req, res) => {
  try {
    const { user, stakeAmount, delegateTo } = req.body;
    const result = await daoMembership.joinDAO(user, { stakeAmount, delegateTo });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delegateVotingPower = async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    const result = await daoMembership.delegateVotingPower(from, to, amount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.revokeDelegation = async (req, res) => {
  try {
    const { from } = req.body;
    const result = await daoMembership.revokeDelegation(from);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignRole = async (req, res) => {
  try {
    const { user, targetAddress, roleName, reason } = req.body;
    const result = await daoMembership.assignRole(user, targetAddress, roleName, reason);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMember = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await daoMembership.getMember(address);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const result = await daoMembership.getAllMembers(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.leaveDAO = async (req, res) => {
  try {
    const { address } = req.body;
    const result = await daoMembership.leaveDAO(address);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== VOTING SYSTEM ====================

exports.createVote = async (req, res) => {
  try {
    const { proposalId, votingType, options } = req.body;
    const result = await votingSystem.createVote(proposalId, votingType, options);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.castVote = async (req, res) => {
  try {
    const { voter, voteId, choice, votingPower } = req.body;
    const result = await votingSystem.castVote(voter, voteId, choice, votingPower);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.castRankedVote = async (req, res) => {
  try {
    const { voter, voteId, rankings, votingPower } = req.body;
    const result = await votingSystem.castRankedVote(voter, voteId, rankings, votingPower);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVoteResults = async (req, res) => {
  try {
    const { voteId } = req.params;
    const result = await votingSystem.getResults(voteId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.finalizeVote = async (req, res) => {
  try {
    const { voteId } = req.params;
    const result = await votingSystem.finalizeVote(voteId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActiveVotes = async (req, res) => {
  try {
    const result = await votingSystem.getActiveVotes();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVoterVote = async (req, res) => {
  try {
    const { voter, voteId } = req.params;
    const result = await votingSystem.getVoterVote(voter, voteId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== TREASURY ====================

exports.getTreasuryBalance = async (req, res) => {
  try {
    const result = await treasury.getBalance();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSpendingProposal = async (req, res) => {
  try {
    const { proposer, amount, currency, recipient, category, description, justification } = req.body;
    const result = await treasury.createSpendingProposal(proposer, { 
      amount, currency, recipient, category, description, justification 
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.signProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { signer } = req.body;
    const result = await treasury.signProposal(signer, proposalId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.allocateBudget = async (req, res) => {
  try {
    const { proposer, category, amount, period, description } = req.body;
    const result = await treasury.allocateBudget(proposer, { category, amount, period, description });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveAllocation = async (req, res) => {
  try {
    const { allocationId } = req.params;
    const result = await treasury.approveAllocation(allocationId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBudgetStatus = async (req, res) => {
  try {
    const result = await treasury.getBudgetStatus();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTreasuryTransactions = async (req, res) => {
  try {
    const result = await treasury.getTransactionHistory(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPendingProposals = async (req, res) => {
  try {
    const result = await treasury.getPendingProposals();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.depositToTreasury = async (req, res) => {
  try {
    const { from, amount, currency, source } = req.body;
    const result = await treasury.deposit(from, amount, currency, source);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PROPOSALS ====================

exports.createProposal = async (req, res) => {
  try {
    const { proposer, type, title, description, details, actions, discussionPeriod } = req.body;
    const result = await proposalService.createProposal(proposer, { 
      type, title, description, details, actions, discussionPeriod 
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitForDiscussion = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { proposer } = req.body;
    const result = await proposalService.submitForDiscussion(proposer, proposalId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.startVoting = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { proposer } = req.body;
    const result = await proposalService.startVoting(proposer, proposalId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { proposer } = req.body;
    const result = await proposalService.cancelProposal(proposer, proposalId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.executeProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { executor } = req.body;
    const result = await proposalService.executeProposal(executor, proposalId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { user, content, parentId } = req.body;
    const result = await proposalService.addComment(user, proposalId, { content, parentId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const result = await proposalService.getProposal(proposalId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProposals = async (req, res) => {
  try {
    const result = await proposalService.getProposals(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProposalTypes = async (req, res) => {
  try {
    const result = await proposalService.getProposalTypes();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GOVERNANCE DASHBOARD ====================

exports.getGovernanceDashboard = async (req, res) => {
  try {
    const [treasuryBalance, budgetStatus, activeVotes, pendingProposals] = await Promise.all([
      treasury.getBalance(),
      treasury.getBudgetStatus(),
      votingSystem.getActiveVotes(),
      treasury.getPendingProposals()
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        treasury: treasuryBalance.balances,
        budget: budgetStatus.budgets,
        activeVotes: activeVotes.votes.length,
        pendingProposals: pendingProposals.proposals.length,
        totalMembers: (await daoMembership.getAllMembers()).members.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
