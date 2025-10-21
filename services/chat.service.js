const chatRepository = require('../repositories/chat.repository');

class ChatService {
  async save(messageData) {
    // Bisa ditambahkan validasi, transformasi, dsb
    return await chatRepository.create(messageData);
  }

  async getAll() {
    return await chatRepository.findAll();
  }
}

module.exports = new ChatService();
