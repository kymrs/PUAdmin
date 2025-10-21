const { Model, Op } = require("sequelize"); // Import Op for Sequelize operators
const { PackageFlight } = require("../../models");

class PackageFlightRepository {
  async getAllPackageFlights() {
    return await PackageFlight.findAll();
  }

  async getPaginatedPackageFlights({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { flight_type: { [Op.like]: `%${search}%` } },
          { createdAt: { [Op.like]: `%${search}%` } },
          { updatedAt: { [Op.like]: `%${search}%` } }
        ]
      }),
    };

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["createdAt", "DESC"]];

    const offset = start || 0; // Default to 0 if start is not provided
    const limit = length || 10; // Default to 10 if length is not provided

    const result = await PackageFlight.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async getPackageFlightById(id) {
    return await PackageFlight.findByPk(id);
  }

  async createPackageFlight(packageFlightData) {
    return await PackageFlight.create(packageFlightData);
  }

  async updatePackageFlight(id, packageFlightData) {
    return await PackageFlight.update(packageFlightData, { where: { id } });
  }

  async deletePackageFlight(id) {
    return await PackageFlight.destroy({ where: { id } });
  }
}

module.exports = new PackageFlightRepository();