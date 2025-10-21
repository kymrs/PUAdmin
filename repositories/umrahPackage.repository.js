const { Model, Op } = require("sequelize"); // Import Op for Sequelize operators
const { UmrahPackage, Travel } = require("../models");

class UmrahPackageRepository {
  async getAllPackages() {
    return await UmrahPackage.findAll();
  }

  async getPaginatedUmrahPackage({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { price: { [Op.like]: `%${search}%` } },
          { duration_days: { [Op.like]: `%${search}%` } },
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

    const result = await UmrahPackage.findAndCountAll({
      where,
      order: sort,
      offset,
      limit,
       include: [
        {
          model: Travel,
          as: 'agency'
        }
      ]
    });

    return result;
  }

  async getPackageById(id) {
    return await UmrahPackage.findByPk(id);
  }

  async createPackage(packageData) {
    return await UmrahPackage.create(packageData);
  }

  async updatePackage(id, packageData) {
    return await UmrahPackage.update(packageData, { where: { id } });
  }

  async deletePackage(id) {
    return await UmrahPackage.destroy({ where: { id } });
  }
}

module.exports = new UmrahPackageRepository();