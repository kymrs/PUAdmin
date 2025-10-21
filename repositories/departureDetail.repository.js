const { Model, Op } = require("sequelize");
const { DepartureDetail } = require("../models");

class DepartureDetailRepository {
  async getAllDepartureDetails() {
    return await DepartureDetail.findAll();
  }

  async getPaginatedDepartureDetails({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { flightNumber: { [Op.like]: `%${search}%` } },
          { origin: { [Op.like]: `%${search}%` } },
          { destination: { [Op.like]: `%${search}%` } },
          { departureTime: { [Op.like]: `%${search}%` } },
          { arrivalTime: { [Op.like]: `%${search}%` } }
        ]
      }),
    };

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["departureTime", "ASC"]];

    const offset = start || 0; // Default to 0 if start is not provided
    const limit = length || 10; // Default to 10 if length is not provided

    const result = await DepartureDetail.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async getDepartureDetailById(id) {
    return await DepartureDetail.findByPk(id);
  }

  async createDepartureDetail(departureDetailData) {
    return await DepartureDetail.create(departureDetailData);
  }

  async updateDepartureDetail(id, departureDetailData) {
    return await DepartureDetail.update(departureDetailData, { where: { id } });
  }

  async deleteDepartureDetail(id) {
    return await DepartureDetail.destroy({ where: { id } });
  }
}

module.exports = new DepartureDetailRepository();