const { Model, Op } = require("sequelize"); // Import Op for Sequelize operators
const { HotelPackage } = require("../../models");

class HotelPackageRepository {
  async getAllHotelPackages() {
    return await HotelPackage.findAll();
  }

  async getPaginatedHotelPackages({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { package_id: { [Op.like]: `%${search}%` } },
          { hotel_id: { [Op.like]: `%${search}%` } },
          { location: { [Op.like]: `%${search}%` } },
          { number_of_night: { [Op.like]: `%${search}%` } },
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

    const result = await HotelPackage.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async getHotelPackageById(id) {
    return await HotelPackage.findByPk(id);
  }

  async createHotelPackage(hotelPackageData) {
    return await HotelPackage.create(hotelPackageData);
  }

  async updateHotelPackage(id, hotelPackageData) {
    return await HotelPackage.update(hotelPackageData, { where: { id } });
  }

  async deleteHotelPackage(id) {
    return await HotelPackage.destroy({ where: { id } });
  }
}

module.exports = new HotelPackageRepository();