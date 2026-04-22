/**
 * Collaborative Workspaces Service
 * Multi-artist projects and workspaces
 */

class CollaborationService {
  constructor() {
    this.workspaces = new Map();
    this.projects = new Map();
    this.invitations = new Map();
    this.assets = new Map();
  }

  async createWorkspace(creatorAddress, workspaceData) {
    const workspace = {
      workspaceId: this.generateId('WRK'),
      creator: creatorAddress,
      name: workspaceData.name,
      description: workspaceData.description,
      type: workspaceData.type, // 'collection', 'exhibition', 'project'
      visibility: workspaceData.visibility || 'private', // 'private', 'public', 'invite_only'
      members: [{
        address: creatorAddress,
        role: 'admin',
        joinedAt: new Date().toISOString()
      }],
      assets: [],
      discussions: [],
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    this.workspaces.set(workspace.workspaceId, workspace);

    return { success: true, workspaceId: workspace.workspaceId, workspace };
  }

  async inviteMember(workspaceId, inviterAddress, inviteData) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    // Check if inviter is admin
    const inviter = workspace.members.find(m => m.address === inviterAddress);
    if (!inviter || inviter.role !== 'admin') {
      throw new Error('Only admins can invite members');
    }

    const invitation = {
      invitationId: this.generateId('INV'),
      workspaceId,
      invitedBy: inviterAddress,
      inviteeAddress: inviteData.address,
      role: inviteData.role || 'member', // 'admin', 'member', 'viewer'
      message: inviteData.message || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    this.invitations.set(invitation.invitationId, invitation);

    return { success: true, invitationId: invitation.invitationId };
  }

  async acceptInvitation(invitationId, userAddress) {
    const invitation = this.invitations.get(invitationId);
    if (!invitation) throw new Error('Invitation not found');
    if (invitation.inviteeAddress !== userAddress) throw new Error('Not your invitation');
    if (invitation.status !== 'pending') throw new Error('Invitation already processed');
    if (new Date(invitation.expiresAt) < new Date()) throw new Error('Invitation expired');

    const workspace = this.workspaces.get(invitation.workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    // Add member
    workspace.members.push({
      address: userAddress,
      role: invitation.role,
      joinedAt: new Date().toISOString()
    });

    invitation.status = 'accepted';
    invitation.acceptedAt = new Date().toISOString();

    return { success: true, workspaceId: workspace.workspaceId };
  }

  async addAsset(workspaceId, userAddress, assetData) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    // Check if user is member
    const member = workspace.members.find(m => m.address === userAddress);
    if (!member) throw new Error('Not a workspace member');

    const asset = {
      assetId: this.generateId('AST'),
      workspaceId,
      addedBy: userAddress,
      type: assetData.type, // 'nft', 'image', 'document', 'link'
      title: assetData.title,
      description: assetData.description,
      content: assetData.content,
      nftId: assetData.nftId || null,
      tags: assetData.tags || [],
      visibility: assetData.visibility || 'workspace', // 'workspace', 'members'
      createdAt: new Date().toISOString(),
      comments: []
    };

    workspace.assets.push(asset.assetId);
    this.assets.set(asset.assetId, asset);

    return { success: true, assetId: asset.assetId, asset };
  }

  async createTask(workspaceId, creatorAddress, taskData) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    const task = {
      taskId: this.generateId('TSK'),
      workspaceId,
      creator: creatorAddress,
      title: taskData.title,
      description: taskData.description,
      assignedTo: taskData.assignedTo || null,
      status: 'todo', // 'todo', 'in_progress', 'review', 'done'
      priority: taskData.priority || 'medium', // 'low', 'medium', 'high', 'urgent'
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null
    };

    workspace.tasks.push(task);

    return { success: true, taskId: task.taskId, task };
  }

  async getWorkspace(workspaceId, userAddress) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    // Check access
    const isMember = workspace.members.some(m => m.address === userAddress);
    if (workspace.visibility === 'private' && !isMember) {
      throw new Error('Access denied');
    }

    const assets = workspace.assets
      .map(id => this.assets.get(id))
      .filter(a => a);

    return {
      ...workspace,
      assets,
      isMember,
      userRole: isMember ? workspace.members.find(m => m.address === userAddress).role : null
    };
  }

  async getUserWorkspaces(userAddress) {
    const workspaces = Array.from(this.workspaces.values())
      .filter(w => w.members.some(m => m.address === userAddress));

    return workspaces.map(w => ({
      workspaceId: w.workspaceId,
      name: w.name,
      type: w.type,
      role: w.members.find(m => m.address === userAddress).role,
      memberCount: w.members.length,
      updatedAt: w.updatedAt
    }));
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new CollaborationService();
