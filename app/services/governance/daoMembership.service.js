/**
 * DAO Membership Service
 * Decentralized governance membership and roles
 */

class DaoMembershipService {
  constructor() {
    this.members = new Map();
    this.roles = new Map();
    this.delegations = new Map();
    this.reputation = new Map();
    this.initializeRoles();
  }

  initializeRoles() {
    // Define DAO roles
    this.roles.set('founder', {
      name: 'Founder',
      level: 10,
      permissions: ['all'],
      description: 'Platform founders with full governance rights'
    });

    this.roles.set('elder_council', {
      name: 'Elder Council',
      level: 9,
      permissions: ['propose', 'vote', 'veto', 'appoint', 'treasury'],
      description: 'Cultural elders with veto power and appointment authority'
    });

    this.roles.set('steward', {
      name: 'Steward',
      level: 8,
      permissions: ['propose', 'vote', 'treasury', 'moderate'],
      description: 'Active community stewards with treasury access'
    });

    this.roles.set('guardian', {
      name: 'Guardian',
      level: 7,
      permissions: ['propose', 'vote', 'moderate'],
      description: 'Content guardians with moderation rights'
    });

    this.roles.set('creator', {
      name: 'Creator',
      level: 6,
      permissions: ['propose', 'vote', 'create'],
      description: 'Verified artists and creators'
    });

    this.roles.set('contributor', {
      name: 'Contributor',
      level: 5,
      permissions: ['propose', 'vote'],
      description: 'Active platform contributors'
    });

    this.roles.set('member', {
      name: 'Member',
      level: 4,
      permissions: ['vote'],
      description: 'Standard DAO members'
    });

    this.roles.set('observer', {
      name: 'Observer',
      level: 1,
      permissions: ['view'],
      description: 'Non-voting observers'
    });
  }

  /**
   * Join DAO as member
   */
  async joinDAO(user, membershipData) {
    try {
      const { stakeAmount, delegateTo } = membershipData;

      // Check if already member
      if (this.members.has(user)) {
        throw new Error('Already a DAO member');
      }

      // Minimum stake requirement (1000 INDI)
      const minStake = 1000;
      if (stakeAmount < minStake) {
        throw new Error(`Minimum stake required: ${minStake} INDI`);
      }

      const member = {
        address: user,
        role: 'member',
        stake: stakeAmount,
        joinedAt: new Date().toISOString(),
        votingPower: this.calculateVotingPower(stakeAmount),
        reputation: 0,
        proposalsCreated: 0,
        votesCast: 0,
        delegatedTo: delegateTo || null,
        delegatedFrom: [],
        status: 'active',
        lastActivity: new Date().toISOString()
      };

      this.members.set(user, member);

      // Initialize reputation
      this.reputation.set(user, {
        score: 0,
        history: []
      });

      // Handle delegation if specified
      if (delegateTo) {
        await this.delegateVotingPower(user, delegateTo, stakeAmount);
      }

      return {
        success: true,
        member: member,
        message: `Welcome to Indigena DAO! You have ${member.votingPower} voting power.`
      };
    } catch (error) {
      console.error('Join DAO error:', error);
      throw error;
    }
  }

  /**
   * Calculate voting power based on stake
   */
  calculateVotingPower(stake) {
    // Base voting power: 1 per 100 INDI staked
    let power = Math.floor(stake / 100);

    // Cap at 1000 voting power to prevent whale dominance
    return Math.min(power, 1000);
  }

  /**
   * Delegate voting power
   */
  async delegateVotingPower(from, to, amount) {
    try {
      const fromMember = this.members.get(from);
      const toMember = this.members.get(to);

      if (!fromMember) throw new Error('Delegator not a member');
      if (!toMember) throw new Error('Delegatee not a member');

      // Remove previous delegation if exists
      if (fromMember.delegatedTo) {
        const previousDelegate = this.members.get(fromMember.delegatedTo);
        if (previousDelegate) {
          previousDelegate.delegatedFrom = previousDelegate.delegatedFrom.filter(a => a !== from);
        }
      }

      // Create new delegation
      fromMember.delegatedTo = to;
      toMember.delegatedFrom.push(from);

      const delegation = {
        delegationId: this.generateId('DEL'),
        from: from,
        to: to,
        amount: amount,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      this.delegations.set(delegation.delegationId, delegation);

      return {
        success: true,
        delegationId: delegation.delegationId,
        message: `Successfully delegated ${amount} INDI voting power to ${to}`
      };
    } catch (error) {
      console.error('Delegate voting power error:', error);
      throw error;
    }
  }

  /**
   * Revoke delegation
   */
  async revokeDelegation(from) {
    try {
      const fromMember = this.members.get(from);
      if (!fromMember || !fromMember.delegatedTo) {
        throw new Error('No active delegation found');
      }

      const to = fromMember.delegatedTo;
      const toMember = this.members.get(to);

      if (toMember) {
        toMember.delegatedFrom = toMember.delegatedFrom.filter(a => a !== from);
      }

      fromMember.delegatedTo = null;

      // Update delegation status
      for (const [id, del] of this.delegations) {
        if (del.from === from && del.status === 'active') {
          del.status = 'revoked';
          del.revokedAt = new Date().toISOString();
        }
      }

      return {
        success: true,
        message: 'Delegation successfully revoked'
      };
    } catch (error) {
      console.error('Revoke delegation error:', error);
      throw error;
    }
  }

  /**
   * Assign role to member
   */
  async assignRole(user, targetAddress, roleName, reason) {
    try {
      const member = this.members.get(targetAddress);
      if (!member) throw new Error('Member not found');

      const role = this.roles.get(roleName);
      if (!role) throw new Error('Invalid role');

      // Check if assigner has permission
      const assigner = this.members.get(user);
      if (!assigner) throw new Error('Assigner not a member');

      const assignerRole = this.roles.get(assigner.role);
      if (assignerRole.level <= role.level && assigner.role !== 'founder') {
        throw new Error('Insufficient permissions to assign this role');
      }

      const previousRole = member.role;
      member.role = roleName;

      return {
        success: true,
        member: targetAddress,
        previousRole: previousRole,
        newRole: roleName,
        assignedBy: user,
        reason: reason,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Assign role error:', error);
      throw error;
    }
  }

  /**
   * Get member info
   */
  async getMember(address) {
    const member = this.members.get(address);
    if (!member) {
      return {
        success: false,
        message: 'Not a DAO member'
      };
    }

    const role = this.roles.get(member.role);
    const reputation = this.reputation.get(address);

    return {
      success: true,
      member: {
        ...member,
        roleInfo: role,
        reputation: reputation,
        effectiveVotingPower: this.calculateEffectiveVotingPower(address)
      }
    };
  }

  /**
   * Calculate effective voting power (including delegations)
   */
  calculateEffectiveVotingPower(address) {
    const member = this.members.get(address);
    if (!member) return 0;

    let power = member.votingPower;

    // Add delegated power
    for (const delegatorAddress of member.delegatedFrom) {
      const delegator = this.members.get(delegatorAddress);
      if (delegator && delegator.status === 'active') {
        power += delegator.votingPower;
      }
    }

    return power;
  }

  /**
   * Get all members
   */
  async getAllMembers(options = {}) {
    const { role, status, limit = 100, offset = 0 } = options;

    let members = Array.from(this.members.values());

    if (role) members = members.filter(m => m.role === role);
    if (status) members = members.filter(m => m.status === status);

    const total = members.length;
    members = members.slice(offset, offset + limit);

    return {
      success: true,
      members: members.map(m => ({
        address: m.address,
        role: m.role,
        stake: m.stake,
        votingPower: m.votingPower,
        effectiveVotingPower: this.calculateEffectiveVotingPower(m.address),
        joinedAt: m.joinedAt,
        status: m.status
      })),
      pagination: { total, limit, offset }
    };
  }

  /**
   * Update reputation score
   */
  async updateReputation(address, change, reason) {
    const rep = this.reputation.get(address);
    if (!rep) return;

    rep.score += change;
    rep.history.push({
      change: change,
      reason: reason,
      timestamp: new Date().toISOString()
    });

    // Update member's reputation
    const member = this.members.get(address);
    if (member) {
      member.reputation = rep.score;
    }

    return {
      success: true,
      address: address,
      newScore: rep.score,
      change: change
    };
  }

  /**
   * Leave DAO
   */
  async leaveDAO(address) {
    try {
      const member = this.members.get(address);
      if (!member) throw new Error('Not a member');

      // Revoke any delegations first
      if (member.delegatedTo) {
        await this.revokeDelegation(address);
      }

      // Return delegations to others
      for (const delegatorAddress of member.delegatedFrom) {
        const delegator = this.members.get(delegatorAddress);
        if (delegator) {
          delegator.delegatedTo = null;
        }
      }

      member.status = 'inactive';
      member.leftAt = new Date().toISOString();

      return {
        success: true,
        message: 'Successfully left DAO',
        stakeReturned: member.stake
      };
    } catch (error) {
      console.error('Leave DAO error:', error);
      throw error;
    }
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new DaoMembershipService();
