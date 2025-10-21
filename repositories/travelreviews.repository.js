const { Model, Op } = require("sequelize"); // Import Op for Sequelize operators
const { TravelReviews } = require("../models");

class TravelReviewsRepository {
  async getAllTravelReviews() {
    return await TravelReviews.findAll();
  }

  async getTravelReviewsById(id) {
    return await TravelReviews.findByPk(id);
  }

  async getPaginatedTravelReviews({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { travel_id: { [Op.like]: `%${search}%` } },
          { user_id: { [Op.like]: `%${search}%` } },
          { rating: { [Op.like]: `%${search}%` } },
          { comment: { [Op.like]: `%${search}%` } }
        ]
      }),
    };

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["created_at", "DESC"]];

    const offset = start || 0; // Default ke 0 jika start tidak diberikan
    const limit = length || 10; // Default ke 10 jika length tidak diberikan

    const result = await TravelReviews.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async createTravelReviews(reviewData) {
    return await TravelReviews.create(reviewData);
  }

  async updateTravelReviews(id, reviewData) {
    return await TravelReviews.update(reviewData, { where: { id } });
  }

  async deleteTravelReviews(id) {
    return await TravelReviews.destroy({ where: { id } });
  }
}

module.exports = new TravelReviewsRepository();
