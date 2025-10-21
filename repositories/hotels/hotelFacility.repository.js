const { Model, Op } = require("sequelize"); // Import Op for Sequelize operators
const { HotelFacility } = require("../../models");

class HotelFacilityRepository {
  async getAllFacilities() {
    return await HotelFacility.findAll();
  }

  async getPaginatedFacilities({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
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

    const result = await HotelFacility.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async getFacilityById(id) {
    return await HotelFacility.findByPk(id);
  }

  async createFacility(facilityData) {
    return await HotelFacility.create(facilityData);
  }

  async updateFacility(id, facilityData) {
    return await HotelFacility.update(facilityData, { where: { id } });
  }

  async deleteFacility(id) {
    return await HotelFacility.destroy({ where: { id } });
  }
}

module.exports = new HotelFacilityRepository();

