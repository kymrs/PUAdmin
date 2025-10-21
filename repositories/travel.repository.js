const { Model, Op } = require("sequelize"); // Import Op for Sequelize operators
const { Travel } = require("../models");

class TravelRepository {
  async getAllTravels() {
    return await Travel.findAll();
  }

  async getPaginatedTravel({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } }, // Menggunakan 'name' sebagai kolom pencarian
          { description: { [Op.like]: `%${search}%` } },
          { logo_url: { [Op.like]: `%${search}%` } },
          { contact_person: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
          { website: { [Op.like]: `%${search}%` } },
          { created_at: { [Op.like]: `%${search}%` } }
        ]
      }),
      // Tambahkan filter lain jika diperlukan
    };

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["created_at", "DESC"]];

    const offset = start || 0; // Default ke 0 jika start tidak diberikan
    const limit = length || 10; // Default ke 10 jika length tidak diberikan

    const result = await Travel.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async getTravelById(id) {
    return await Travel.findByPk(id);
  }

  async createTravel(travelData) {
    return await Travel.create(travelData);
  }

  async updateTravel(id, userData) {
    return await Travel.update(userData, { where: { id } });
  }

  async deleteTravel(id) {
    return await Travel.destroy({ where: { id } });
  }
}

module.exports = new TravelRepository();
