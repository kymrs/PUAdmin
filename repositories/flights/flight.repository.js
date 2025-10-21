const { Model, Op } = require("sequelize"); // Import Op for Sequelize operators
const { Flight } = require("../../models");

class FlightRepository {
  async getAllFlights() {
    return await Flight.findAll();
  }

  async getPaginatedFlights({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { airline: { [Op.like]: `%${search}%` } },
          { flight_number: { [Op.like]: `%${search}%` } },
          { departure_airport: { [Op.like]: `%${search}%` } },
          { arrival_airport: { [Op.like]: `%${search}%` } },
          { departure_time: { [Op.like]: `%${search}%` } },
          { arrival_time: { [Op.like]: `%${search}%` } }
        ]
      }),
    };

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["departureTime", "ASC"]];

    const offset = start || 0; // Default to 0 if start is not provided
    const limit = length || 10; // Default to 10 if length is not provided

    const result = await Flight.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async getFlightById(id) {
    return await Flight.findByPk(id);
  }

  async createFlight(flightData) {
    return await Flight.create(flightData);
  }

  async updateFlight(id, flightData) {
    return await Flight.update(flightData, { where: { id } });
  }

  async deleteFlight(id) {
    return await Flight.destroy({ where: { id } });
  }
}

module.exports = new FlightRepository();