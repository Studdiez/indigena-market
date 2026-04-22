/**
 * Voting System Service
 * Decentralized voting with multiple mechanisms
 */

class VotingSystemService {
  constructor() {
    this.votes = new Map();
    this.votingConfigs = new Map();
    this.initializeVotingConfigs();
  }

  initializeVotingConfigs() {
    // Standard voting configurations
    this.votingConfigs.set('standard', {
      quorum: 0.2, // 20% of total voting power required
      threshold: 0.51, // 51% to pass
      duration: 7 * 24 * 60 * 60 * 1000, // 7 days
      type: 'single_choice'
    });

    this.votingConfigs.set('treasury', {
      quorum: 0.3, // 30% for treasury
      threshold: 0.66, // 66% for treasury
      duration: 14 * 24 * 60 * 60 * 1000, // 14 days
      type: 'single_choice'
    });

    this.votingConfigs.set('constitutional', {
      quorum: 0.4, // 40% for constitutional
      threshold: 0.75, // 75% for constitutional
      duration: 30 * 24 * 60 * 60 * 1000, // 30 days
      type: 'single_choice'
    });

    this.votingConfigs.set('council_election', {
      quorum: 0.25,
      threshold: 0.5,
      duration: 10 * 24 * 60 * 60 * 1000,
      type: 'ranked_choice'
    });

    this.votingConfigs.set('emergency', {
      quorum: 0.15,
      threshold: 0.6,
      duration: 2 * 24 * 60 * 60 * 1000, // 2 days
      type: 'single_choice'
    });
  }

  /**
   * Create a new vote
   */
  async createVote(proposalId, votingType, options) {
    try {
      const config = this.votingConfigs.get(votingType);
      if (!config) throw new Error('Invalid voting type');

      const vote = {
        voteId: this.generateId('VOTE'),
        proposalId: proposalId,
        type: votingType,
        config: config,
        options: options.map((opt, idx) => ({
          id: idx,
          label: opt,
          votes: 0,
          voters: []
        })),
        status: 'active',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + config.duration).toISOString(),
        totalVotingPower: 0,
        totalVotes: 0,
        castVotes: new Map(), // voter -> vote details
        results: null
      };

      this.votes.set(vote.voteId, vote);

      return {
        success: true,
        voteId: vote.voteId,
        proposalId: proposalId,
        endTime: vote.endTime,
        options: options
      };
    } catch (error) {
      console.error('Create vote error:', error);
      throw error;
    }
  }

  /**
   * Cast a vote
   */
  async castVote(voter, voteId, choice, votingPower) {
    try {
      const vote = this.votes.get(voteId);
      if (!vote) throw new Error('Vote not found');
      if (vote.status !== 'active') throw new Error('Vote not active');

      // Check if already voted
      if (vote.castVotes.has(voter)) {
        throw new Error('Already voted');
      }

      // Check if vote has ended
      if (new Date() > new Date(vote.endTime)) {
        throw new Error('Voting period has ended');
      }

      // Validate choice
      const selectedOption = vote.options.find(o => o.id === choice);
      if (!selectedOption) throw new Error('Invalid choice');

      // Record vote
      const voteRecord = {
        voter: voter,
        choice: choice,
        power: votingPower,
        timestamp: new Date().toISOString()
      };

      vote.castVotes.set(voter, voteRecord);
      selectedOption.votes += votingPower;
      selectedOption.voters.push(voter);
      vote.totalVotingPower += votingPower;
      vote.totalVotes++;

      return {
        success: true,
        voteId: voteId,
        choice: choice,
        power: votingPower,
        message: `Vote cast for "${selectedOption.label}" with ${votingPower} voting power`
      };
    } catch (error) {
      console.error('Cast vote error:', error);
      throw error;
    }
  }

  /**
   * Cast ranked choice vote
   */
  async castRankedVote(voter, voteId, rankings, votingPower) {
    try {
      const vote = this.votes.get(voteId);
      if (!vote) throw new Error('Vote not found');
      if (vote.config.type !== 'ranked_choice') {
        throw new Error('Not a ranked choice vote');
      }

      // Validate rankings
      if (rankings.length !== vote.options.length) {
        throw new Error('Must rank all options');
      }

      const voteRecord = {
        voter: voter,
        rankings: rankings,
        power: votingPower,
        timestamp: new Date().toISOString()
      };

      vote.castVotes.set(voter, voteRecord);
      vote.totalVotingPower += votingPower;
      vote.totalVotes++;

      return {
        success: true,
        voteId: voteId,
        rankings: rankings,
        power: votingPower
      };
    } catch (error) {
      console.error('Cast ranked vote error:', error);
      throw error;
    }
  }

  /**
   * Get vote results
   */
  async getResults(voteId) {
    try {
      const vote = this.votes.get(voteId);
      if (!vote) throw new Error('Vote not found');

      // Check if vote has ended or is finalized
      const now = new Date();
      const endTime = new Date(vote.endTime);
      const isEnded = now > endTime || vote.status === 'finalized';

      if (!isEnded) {
        return {
          success: true,
          status: 'active',
          partial: true,
          options: vote.options.map(o => ({
            id: o.id,
            label: o.label,
            votes: o.votes,
            percentage: vote.totalVotingPower > 0 ? (o.votes / vote.totalVotingPower * 100).toFixed(2) : 0
          })),
          totalVotingPower: vote.totalVotingPower,
          totalVotes: vote.totalVotes,
          endTime: vote.endTime
        };
      }

      // Calculate final results
      let results;
      if (vote.config.type === 'ranked_choice') {
        results = this.calculateRankedResults(vote);
      } else {
        results = this.calculateStandardResults(vote);
      }

      return {
        success: true,
        status: 'completed',
        voteId: voteId,
        proposalId: vote.proposalId,
        results: results,
        totalVotingPower: vote.totalVotingPower,
        totalVotes: vote.totalVotes,
        participation: results.participation,
        quorumMet: results.quorumMet,
        passed: results.passed
      };
    } catch (error) {
      console.error('Get results error:', error);
      throw error;
    }
  }

  /**
   * Calculate standard voting results
   */
  calculateStandardResults(vote) {
    const sortedOptions = [...vote.options].sort((a, b) => b.votes - a.votes);
    const winningOption = sortedOptions[0];
    const totalPower = vote.totalVotingPower;

    // Assume 10,000 total voting power for quorum calculation
    const totalPossiblePower = 10000;
    const participation = totalPower / totalPossiblePower;
    const quorumMet = participation >= vote.config.quorum;

    const winningPercentage = totalPower > 0 ? winningOption.votes / totalPower : 0;
    const passed = quorumMet && winningPercentage >= vote.config.threshold;

    return {
      winner: winningOption,
      options: sortedOptions.map(o => ({
        ...o,
        percentage: totalPower > 0 ? (o.votes / totalPower * 100).toFixed(2) : 0
      })),
      participation: (participation * 100).toFixed(2) + '%',
      quorumMet: quorumMet,
      threshold: (vote.config.threshold * 100) + '%',
      passed: passed
    };
  }

  /**
   * Calculate ranked choice results
   */
  calculateRankedResults(vote) {
    const rounds = [];
    let eliminated = new Set();
    let winner = null;

    while (!winner) {
      const roundVotes = new Map();

      // Count first preferences
      for (const [voter, record] of vote.castVotes) {
        for (const choice of record.rankings) {
          if (!eliminated.has(choice)) {
            roundVotes.set(choice, (roundVotes.get(choice) || 0) + record.power);
            break;
          }
        }
      }

      const totalRoundVotes = Array.from(roundVotes.values()).reduce((a, b) => a + b, 0);
      const roundResults = Array.from(roundVotes.entries()).map(([id, votes]) => ({
        id,
        votes,
        percentage: totalRoundVotes > 0 ? (votes / totalRoundVotes * 100).toFixed(2) : 0
      })).sort((a, b) => b.votes - a.votes);

      rounds.push(roundResults);

      // Check for winner
      const topChoice = roundResults[0];
      if (topChoice && topChoice.votes / totalRoundVotes > 0.5) {
        winner = topChoice;
      } else {
        // Eliminate lowest
        const lowest = roundResults[roundResults.length - 1];
        eliminated.add(lowest.id);

        if (roundResults.length <= 2) {
          winner = topChoice;
        }
      }
    }

    return {
      winner: winner,
      rounds: rounds,
      eliminated: Array.from(eliminated)
    };
  }

  /**
   * Finalize vote
   */
  async finalizeVote(voteId) {
    try {
      const vote = this.votes.get(voteId);
      if (!vote) throw new Error('Vote not found');

      if (vote.status === 'finalized') {
        throw new Error('Vote already finalized');
      }

      vote.status = 'finalized';
      vote.finalizedAt = new Date().toISOString();

      const results = await this.getResults(voteId);

      return {
        success: true,
        voteId: voteId,
        status: 'finalized',
        results: results.results
      };
    } catch (error) {
      console.error('Finalize vote error:', error);
      throw error;
    }
  }

  /**
   * Get active votes
   */
  async getActiveVotes() {
    const active = Array.from(this.votes.values())
      .filter(v => v.status === 'active')
      .map(v => ({
        voteId: v.voteId,
        proposalId: v.proposalId,
        type: v.type,
        options: v.options.map(o => ({ id: o.id, label: o.label })),
        endTime: v.endTime,
        totalVotes: v.totalVotes,
        totalVotingPower: v.totalVotingPower
      }));

    return {
      success: true,
      votes: active
    };
  }

  /**
   * Get voter's vote
   */
  async getVoterVote(voter, voteId) {
    const vote = this.votes.get(voteId);
    if (!vote) throw new Error('Vote not found');

    const voterRecord = vote.castVotes.get(voter);
    if (!voterRecord) {
      return {
        success: true,
        hasVoted: false
      };
    }

    return {
      success: true,
      hasVoted: true,
      vote: voterRecord
    };
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new VotingSystemService();
