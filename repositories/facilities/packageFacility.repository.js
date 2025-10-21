const { Model, Op } = require("sequelize"); // Import Op for Sequelize operators
const { PackageFacility } = require("../../models");

class PackageFacilityRepository {
  async getAllPackageFacilities() {
    return await PackageFacility.findAll();
  }

  async getPaginatedPackageFacilities({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { facility: { [Op.like]: `%${search}%` } },
          { status: { [Op.like]: `%${search}%` } },
          { created_at: { [Op.like]: `%${search}%` } }
        ]
      }),
    };

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["created_at", "DESC"]];

    const offset = start || 0; // Default to 0 if start is not provided
    const limit = length || 10; // Default to 10 if length is not provided

    const result = await PackageFacility.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async getPackageFacilityById(id) {
    return await PackageFacility.findByPk(id);
  }

  async createPackageFacility(packageFacilityData) {
    return await PackageFacility.create(packageFacilityData);
  }

  async updatePackageFacility(id, packageFacilityData) {
    return await PackageFacility.update(packageFacilityData, { where: { id } });
  }

  async deletePackageFacility(id) {
    return await PackageFacility.destroy({ where: { id } });
  }
}

module.exports = new PackageFacilityRepository();