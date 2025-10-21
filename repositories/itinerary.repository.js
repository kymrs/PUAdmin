const { Model, Op } = require("sequelize");
const { Itinerary } = require("../models");

class ItineraryRepository {
  async getAllItineraries() {
    return await Itinerary.findAll();
  }

  async getPaginatedItineraries({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { date: { [Op.like]: `%${search}%` } }
        ]
      }),
    };

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["date", "ASC"]];

    const offset = start || 0; // Default to 0 if start is not provided
    const limit = length || 10; // Default to 10 if length is not provided

    const result = await Itinerary.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async getItineraryById(id) {
    return await Itinerary.findByPk(id);
  }

  async createItinerary(itineraryData) {
    return await Itinerary.create(itineraryData);
  }

  async updateItinerary(id, itineraryData) {
    return await Itinerary.update(itineraryData, { where: { id } });
  }

  async deleteItinerary(id) {
    return await Itinerary.destroy({ where: { id } });
  }
}

module.exports = new ItineraryRepository();