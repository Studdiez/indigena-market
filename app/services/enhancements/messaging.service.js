/**
 * Messaging Service
 * Direct communication between users
 */

class MessagingService {
  constructor() {
    this.conversations = new Map();
    this.messages = new Map();
    this.typing = new Map();
    this.blocked = new Map();
  }

  /**
   * Create or get conversation
   */
  async getOrCreateConversation(participants) {
    try {
      // Sort participants for consistent ID
      const sorted = [...participants].sort();
      const conversationId = `conv_${sorted.join('_')}`;

      let conversation = this.conversations.get(conversationId);

      if (!conversation) {
        conversation = {
          conversationId: conversationId,
          participants: sorted,
          createdAt: new Date().toISOString(),
          lastMessage: null,
          lastMessageAt: null,
          unreadCount: {},
          archived: false
        };

        // Initialize unread counts
        for (const participant of sorted) {
          conversation.unreadCount[participant] = 0;
        }

        this.conversations.set(conversationId, conversation);
      }

      return {
        success: true,
        conversation: conversation
      };
    } catch (error) {
      console.error('Get or create conversation error:', error);
      throw error;
    }
  }

  /**
   * Send message
   */
  async sendMessage(sender, conversationId, messageData) {
    try {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) throw new Error('Conversation not found');
      if (!conversation.participants.includes(sender)) {
        throw new Error('Not a participant');
      }

      // Check if blocked
      for (const participant of conversation.participants) {
        if (participant !== sender) {
          const blocked = this.blocked.get(participant) || [];
          if (blocked.includes(sender)) {
            throw new Error('Cannot message this user');
          }
        }
      }

      const message = {
        messageId: this.generateId('MSG'),
        conversationId: conversationId,
        sender: sender,
        type: messageData.type || 'text', // text, image, file, nft_share
        content: messageData.content,
        metadata: messageData.metadata || {},
        status: 'sent',
        createdAt: new Date().toISOString(),
        editedAt: null,
        deletedAt: null
      };

      this.messages.set(message.messageId, message);

      // Update conversation
      conversation.lastMessage = message;
      conversation.lastMessageAt = message.createdAt;
      
      // Increment unread for other participants
      for (const participant of conversation.participants) {
        if (participant !== sender) {
          conversation.unreadCount[participant]++;
        }
      }

      return {
        success: true,
        messageId: message.messageId,
        sentAt: message.createdAt
      };
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * Get conversation messages
   */
  async getMessages(conversationId, user, options = {}) {
    try {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) throw new Error('Conversation not found');
      if (!conversation.participants.includes(user)) {
        throw new Error('Not authorized');
      }

      const { before, limit = 50 } = options;

      let msgs = Array.from(this.messages.values())
        .filter(m => m.conversationId === conversationId && !m.deletedAt);

      if (before) {
        msgs = msgs.filter(m => new Date(m.createdAt) < new Date(before));
      }

      msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      msgs = msgs.slice(0, limit);

      // Reset unread count for this user
      conversation.unreadCount[user] = 0;

      return {
        success: true,
        messages: msgs.reverse(),
        hasMore: msgs.length === limit
      };
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  /**
   * Get user conversations
   */
  async getConversations(user, options = {}) {
    try {
      const { archived = false, limit = 20 } = options;

      let convs = Array.from(this.conversations.values())
        .filter(c => c.participants.includes(user) && c.archived === archived);

      convs.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
      convs = convs.slice(0, limit);

      return {
        success: true,
        conversations: convs.map(c => ({
          conversationId: c.conversationId,
          participants: c.participants.filter(p => p !== user),
          lastMessage: c.lastMessage,
          lastMessageAt: c.lastMessageAt,
          unreadCount: c.unreadCount[user] || 0
        }))
      };
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  }

  /**
   * Edit message
   */
  async editMessage(user, messageId, newContent) {
    try {
      const message = this.messages.get(messageId);
      if (!message) throw new Error('Message not found');
      if (message.sender !== user) throw new Error('Not your message');
      if (message.deletedAt) throw new Error('Cannot edit deleted message');

      // Can only edit within 15 minutes
      const age = Date.now() - new Date(message.createdAt);
      if (age > 15 * 60 * 1000) {
        throw new Error('Edit window expired');
      }

      message.content = newContent;
      message.editedAt = new Date().toISOString();

      // Update conversation last message if needed
      const conversation = this.conversations.get(message.conversationId);
      if (conversation && conversation.lastMessage?.messageId === messageId) {
        conversation.lastMessage = message;
      }

      return {
        success: true,
        messageId: messageId,
        editedAt: message.editedAt
      };
    } catch (error) {
      console.error('Edit message error:', error);
      throw error;
    }
  }

  /**
   * Delete message
   */
  async deleteMessage(user, messageId) {
    try {
      const message = this.messages.get(messageId);
      if (!message) throw new Error('Message not found');
      if (message.sender !== user) throw new Error('Not your message');

      message.deletedAt = new Date().toISOString();
      message.content = '[deleted]';

      return {
        success: true,
        messageId: messageId
      };
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }

  /**
   * Mark conversation as read
   */
  async markAsRead(user, conversationId) {
    try {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) throw new Error('Conversation not found');

      conversation.unreadCount[user] = 0;

      return {
        success: true,
        conversationId: conversationId
      };
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  /**
   * Archive conversation
   */
  async archiveConversation(user, conversationId) {
    try {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) throw new Error('Conversation not found');
      if (!conversation.participants.includes(user)) {
        throw new Error('Not authorized');
      }

      conversation.archived = true;
      conversation.archivedAt = new Date().toISOString();
      conversation.archivedBy = user;

      return {
        success: true,
        conversationId: conversationId
      };
    } catch (error) {
      console.error('Archive conversation error:', error);
      throw error;
    }
  }

  /**
   * Unarchive conversation
   */
  async unarchiveConversation(user, conversationId) {
    try {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) throw new Error('Conversation not found');

      conversation.archived = false;
      conversation.unarchivedAt = new Date().toISOString();

      return {
        success: true,
        conversationId: conversationId
      };
    } catch (error) {
      console.error('Unarchive conversation error:', error);
      throw error;
    }
  }

  /**
   * Set typing indicator
   */
  async setTyping(user, conversationId, isTyping) {
    try {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) throw new Error('Conversation not found');

      const key = `${conversationId}_${user}`;
      
      if (isTyping) {
        this.typing.set(key, {
          user: user,
          conversationId: conversationId,
          startedAt: new Date().toISOString()
        });
      } else {
        this.typing.delete(key);
      }

      return {
        success: true,
        typing: isTyping
      };
    } catch (error) {
      console.error('Set typing error:', error);
      throw error;
    }
  }

  /**
   * Get typing indicators
   */
  async getTyping(conversationId, user) {
    try {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) throw new Error('Conversation not found');

      const typing = [];
      for (const [key, data] of this.typing) {
        if (data.conversationId === conversationId && data.user !== user) {
          // Check if still valid (within 10 seconds)
          const age = Date.now() - new Date(data.startedAt);
          if (age < 10000) {
            typing.push(data.user);
          } else {
            this.typing.delete(key);
          }
        }
      }

      return {
        success: true,
        typing: typing
      };
    } catch (error) {
      console.error('Get typing error:', error);
      throw error;
    }
  }

  /**
   * Block user
   */
  async blockUser(user, blockedUser) {
    try {
      let blocked = this.blocked.get(user) || [];
      if (!blocked.includes(blockedUser)) {
        blocked.push(blockedUser);
        this.blocked.set(user, blocked);
      }

      return {
        success: true,
        blocked: blockedUser
      };
    } catch (error) {
      console.error('Block user error:', error);
      throw error;
    }
  }

  /**
   * Unblock user
   */
  async unblockUser(user, blockedUser) {
    try {
      let blocked = this.blocked.get(user) || [];
      blocked = blocked.filter(u => u !== blockedUser);
      this.blocked.set(user, blocked);

      return {
        success: true,
        unblocked: blockedUser
      };
    } catch (error) {
      console.error('Unblock user error:', error);
      throw error;
    }
  }

  /**
   * Get blocked users
   */
  async getBlockedUsers(user) {
    try {
      const blocked = this.blocked.get(user) || [];

      return {
        success: true,
        blocked: blocked
      };
    } catch (error) {
      console.error('Get blocked users error:', error);
      throw error;
    }
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new MessagingService();
