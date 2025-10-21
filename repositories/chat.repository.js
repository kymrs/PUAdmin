const { Chat } = require('../models');

class ChatRepository {
  async create(data) {
    return await Chat.create(data);
  }

  async findAll() {
    return await Chat.findAll({
      order: [['created_at', 'ASC']],
    });
  }
}

module.exports = new ChatRepository();
