const chatService = require('../../services/chat.service');

class ChatController {
  async saveMessage(msg) {
    try {
      return await chatService.save({
        username: msg.username || 'Anonymous',
        message: msg.message,
        created_at: new Date(),
      });
    } catch (error) {
      console.error('Error saving chat message:', error);
      return null;
    }
  }

  async getAllMessages() {
    return await chatService.getAll();
  }
}

module.exports = new ChatController();
