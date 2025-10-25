import { Client } from '@xmtp/browser-sdk';

interface XMTPServiceConfig {
  env?: 'dev' | 'production';
}

class XMTPService {
  private client: Client | null = null;
  private config: XMTPServiceConfig;

  constructor(config: XMTPServiceConfig = {}) {
    this.config = {
      env: config.env || 'dev',
    };
  }

  async initialize(wallet: any) {
    try {
      this.client = await Client.create(wallet, {
        env: this.config.env,
      });
      return this.client;
    } catch (error) {
      console.error('Failed to initialize XMTP client:', error);
      throw error;
    }
  }

  async sendMessage(conversationId: string, content: string) {
    if (!this.client) {
      throw new Error('XMTP client not initialized');
    }

    // Get conversation by ID
    const conversations = await this.client.conversations.list();
    const conversation = conversations.find(conv => conv.topic === conversationId);
    
    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }

    await conversation.send(content);
    return { success: true, message: 'Message sent successfully' };
  }

  async createGroup(members: string[], groupName?: string) {
    if (!this.client) {
      throw new Error('XMTP client not initialized');
    }

    // Create a group chat with the specified members
    // Implementation will depend on XMTP groups capabilities
    return { success: true, groupId: `group-${Date.now()}`, name: groupName || 'New Group' };
  }

  getClient() {
    return this.client;
  }

  isConnected() {
    return this.client !== null;
  }

  async disconnect() {
    this.client = null;
  }
}

export default new XMTPService();
export { XMTPService };