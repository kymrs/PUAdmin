const { Model, Op } = require("sequelize"); // Import Op for Sequelize operators
const { Hotel } = require("../../models");

class HotelRepository {
  async getAllHotels() {
    return await Hotel.findAll();
  }

  async getPaginatedHotels({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { location: { [Op.like]: `%${search}%` } },
          { rating: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { createdAt: { [Op.like]: `%${search}%` } }
        ]
      }),
    };

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["createdAt", "DESC"]];
    const offset = start || 0; // Default to 0 if start is not provided
    const limit = length || 10; // Default to 10 if length is not provided

    const result = await Hotel.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async getHotelById(id) {
    return await Hotel.findByPk(id);
  }

  async createHotel(hotelData) {
    return await Hotel.create(hotelData);
  }

  async updateHotel(id, hotelData) {
    return await Hotel.update(hotelData, { where: { id } });
  }

  async deleteHotel(id) {
    return await Hotel.destroy({ where: { id } });
  }
}

module.exports = new HotelRepository();