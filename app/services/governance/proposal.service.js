/**
 * Proposal Management Service
 * DAO proposal lifecycle management
 */

class ProposalService {
  constructor() {
    this.proposals = new Map();
    this.comments = new Map();
    this.proposalTypes = new Map();
    this.initializeProposalTypes();
  }

  initializeProposalTypes() {
    this.proposalTypes.set('spending', {
      name: 'Treasury Spending',
      description: 'Request funds from DAO treasury',
      requiredRole: 'contributor',
      votingType: 'treasury'
    });

    this.proposalTypes.set('parameter_change', {
      name: 'Parameter Change',
      description: 'Change platform parameters',
      requiredRole: 'steward',
      votingType: 'standard'
    });

    this.proposalTypes.set('constitutional', {
      name: 'Constitutional Amendment',
      description: 'Change DAO constitution',
      requiredRole: 'elder_council',
      votingType: 'constitutional'
    });

    this.proposalTypes.set('council_election', {
      name: 'Council Election',
      description: 'Elect new council members',
      requiredRole: 'member',
      votingType: 'council_election'
    });

    this.proposalTypes.set('role_assignment', {
      name: 'Role Assignment',
      description: 'Assign roles to members',
      requiredRole: 'steward',
      votingType: 'standard'
    });

    this.proposalTypes.set('emergency_action', {
      name: 'Emergency Action',
      description: 'Urgent action requiring immediate vote',
      requiredRole: 'elder_council',
      votingType: 'emergency'
    });

    this.proposalTypes.set('feature_request', {
      name: 'Feature Request',
      description: 'Request new platform feature',
      requiredRole: 'contributor',
      votingType: 'standard'
    });

    this.proposalTypes.set('partnership', {
      name: 'Partnership Proposal',
      description: 'Propose strategic partnership',
      requiredRole: 'steward',
      votingType: 'standard'
    });
  }

  /**
   * Create a new proposal
   */
  async createProposal(proposer, proposalData) {
    try {
      const { 
        type, 
        title, 
        description, 
        details,
        actions,
        discussionPeriod = 3 // days
      } = proposalData;

      const proposalType = this.proposalTypes.get(type);
      if (!proposalType) throw new Error('Invalid proposal type');

      const proposal = {
        proposalId: this.generateId('PROP'),
        type: type,
        typeInfo: proposalType,
        title: title,
        description: description,
        details: details,
        actions: actions || [],
        proposer: proposer,
        status: 'draft',
        discussionPeriod: discussionPeriod,
        discussionEnd: null,
        voteId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        votesFor: 0,
        votesAgainst: 0,
        votesAbstain: 0,
        executed: false,
        executedAt: null,
        executionResult: null
      };

      this.proposals.set(proposal.proposalId, proposal);

      return {
        success: true,
        proposalId: proposal.proposalId,
        status: proposal.status,
        message: 'Proposal created successfully'
      };
    } catch (error) {
      console.error('Create proposal error:', error);
      throw error;
    }
  }

  /**
   * Submit proposal for discussion
   */
  async submitForDiscussion(proposer, proposalId) {
    try {
      const proposal = this.proposals.get(proposalId);
      if (!proposal) throw new Error('Proposal not found');
      if (proposal.proposer !== proposer) throw new Error('Not your proposal');
      if (proposal.status !== 'draft') throw new Error('Proposal not in draft');

      proposal.status = 'discussion';
      proposal.discussionEnd = new Date(
        Date.now() + proposal.discussionPeriod * 24 * 60 * 60 * 1000
      ).toISOString();
      proposal.updatedAt = new Date().toISOString();

      return {
        success: true,
        proposalId: proposalId,
        status: proposal.status,
        discussionEnd: proposal.discussionEnd
      };
    } catch (error) {
      console.error('Submit for discussion error:', error);
      throw error;
    }
  }

  /**
   * Start voting on proposal
   */
  async startVoting(proposer, proposalId) {
    try {
      const proposal = this.proposals.get(proposalId);
      if (!proposal) throw new Error('Proposal not found');
      if (proposal.proposer !== proposer) throw new Error('Not your proposal');
      if (proposal.status !== 'discussion') throw new Error('Not in discussion phase');

      // Check if discussion period is over
      if (new Date() < new Date(proposal.discussionEnd)) {
        throw new Error('Discussion period not over');
      }

      proposal.status = 'voting';
      proposal.votingStart = new Date().toISOString();
      proposal.updatedAt = new Date().toISOString();

      return {
        success: true,
        proposalId: proposalId,
        status: proposal.status,
        votingType: proposal.typeInfo.votingType
      };
    } catch (error) {
      console.error('Start voting error:', error);
      throw error;
    }
  }

  /**
   * Cancel proposal
   */
  async cancelProposal(proposer, proposalId) {
    try {
      const proposal = this.proposals.get(proposalId);
      if (!proposal) throw new Error('Proposal not found');
      if (proposal.proposer !== proposer) throw new Error('Not your proposal');
      if (proposal.status === 'executed' || proposal.status === 'cancelled') {
        throw new Error('Cannot cancel this proposal');
      }

      proposal.status = 'cancelled';
      proposal.cancelledAt = new Date().toISOString();
      proposal.updatedAt = new Date().toISOString();

      return {
        success: true,
        proposalId: proposalId,
        status: 'cancelled'
      };
    } catch (error) {
      console.error('Cancel proposal error:', error);
      throw error;
    }
  }

  /**
   * Execute approved proposal
   */
  async executeProposal(executor, proposalId) {
    try {
      const proposal = this.proposals.get(proposalId);
      if (!proposal) throw new Error('Proposal not found');
      if (proposal.status !== 'passed') throw new Error('Proposal not passed');
      if (proposal.executed) throw new Error('Already executed');

      // Execute actions
      const results = [];
      for (const action of proposal.actions) {
        const result = await this.executeAction(action);
        results.push(result);
      }

      proposal.executed = true;
      proposal.executedAt = new Date().toISOString();
      proposal.executionResult = results;
      proposal.status = 'executed';
      proposal.updatedAt = new Date().toISOString();

      return {
        success: true,
        proposalId: proposalId,
        status: 'executed',
        results: results
      };
    } catch (error) {
      console.error('Execute proposal error:', error);
      throw error;
    }
  }

  /**
   * Execute individual action
   */
  async executeAction(action) {
    // In production: Execute on-chain or update platform state
    return {
      action: action.type,
      status: 'completed',
      result: `Executed ${action.type} successfully`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Add comment to proposal
   */
  async addComment(user, proposalId, commentData) {
    try {
      const proposal = this.proposals.get(proposalId);
      if (!proposal) throw new Error('Proposal not found');

      const comment = {
        commentId: this.generateId('COMM'),
        proposalId: proposalId,
        author: user,
        content: commentData.content,
        parentId: commentData.parentId || null,
        createdAt: new Date().toISOString(),
        votes: 0
      };

      this.comments.set(comment.commentId, comment);
      proposal.comments.push(comment.commentId);

      return {
        success: true,
        commentId: comment.commentId,
        proposalId: proposalId
      };
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  }

  /**
   * Get proposal details
   */
  async getProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      return { success: false, message: 'Proposal not found' };
    }

    // Get comments
    const comments = proposal.comments
      .map(id => this.comments.get(id))
      .filter(c => c);

    return {
      success: true,
      proposal: {
        ...proposal,
        comments: comments
      }
    };
  }

  /**
   * Get proposals list
   */
  async getProposals(options = {}) {
    const { status, type, proposer, limit = 50, offset = 0 } = options;

    let proposals = Array.from(this.proposals.values());

    if (status) proposals = proposals.filter(p => p.status === status);
    if (type) proposals = proposals.filter(p => p.type === type);
    if (proposer) proposals = proposals.filter(p => p.proposer === proposer);

    proposals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = proposals.length;
    proposals = proposals.slice(offset, offset + limit);

    return {
      success: true,
      proposals: proposals.map(p => ({
        proposalId: p.proposalId,
        type: p.type,
        title: p.title,
        status: p.status,
        proposer: p.proposer,
        createdAt: p.createdAt,
        votesFor: p.votesFor,
        votesAgainst: p.votesAgainst
      })),
      pagination: { total, limit, offset }
    };
  }

  /**
   * Update proposal with vote results
   */
  async updateWithVoteResults(proposalId, results) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');

    proposal.votesFor = results.for || 0;
    proposal.votesAgainst = results.against || 0;
    proposal.votesAbstain = results.abstain || 0;

    if (results.passed) {
      proposal.status = 'passed';
    } else {
      proposal.status = 'rejected';
    }

    proposal.voteResults = results;
    proposal.updatedAt = new Date().toISOString();

    return {
      success: true,
      proposalId: proposalId,
      status: proposal.status
    };
  }

  /**
   * Get proposal types
   */
  async getProposalTypes() {
    const types = {};
    for (const [key, value] of this.proposalTypes) {
      types[key] = value;
    }

    return {
      success: true,
      types: types
    };
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new ProposalService();
