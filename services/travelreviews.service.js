const TravelReviewsRepository = require("../repositories/travelreviews.repository");

class TravelReviewsService {
  async getAllTravelReviews() {
      const reviews = await TravelReviewsRepository.getAllTravelReviews();
      return reviews || [];
}

  async getTravelReviewsById(id) {
    try {
      const reviews = await TravelReviewsRepository.getTravelReviewsById(id);
      if (!reviews) throw new Error("Travel reviews not found");
      return reviews;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createTravelReviews(reviewData) {
    try {
      const requiredFields = ["travel_id", "user_id", "rating", "comment"];
      if (!requiredFields.every(field => reviewData[field])) throw new Error("All fields are required");
      return await TravelReviewsRepository.createTravelReviews(reviewData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateTravelReviews(id, reviewData) {
    try {
      const review = await TravelReviewsRepository.getTravelReviewsById(id);
      if (!review) throw new Error("Travel reviews not found");
      await TravelReviewsRepository.updateTravelReviews(id, reviewData);
      return { message: "Travel reviews updated successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteTravelReviews(id) {
    try {
      const review = await TravelReviewsRepository.getTravelReviewsById(id);
      if (!review) throw new Error("Travel reviews not found");
      await TravelReviewsRepository.deleteTravelReviews(id);
      return { message: "Travel reviews deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllTravelReviewsDatatables({ draw, start, length, search, order, columns }) {
    const searchValue = search?.value || "";
    const { count, rows } = await TravelReviewsRepository.getPaginatedTravelReviews({
      start: parseInt(start, 10) || 0,
      length: parseInt(length, 10) || 10,
      search: searchValue,
      order,
      columns
    });
    return {
      draw: parseInt(draw, 10),
      recordsTotal: count,
      recordsFiltered: count,
      data: rows
    };
  }
}

module.exports = new TravelReviewsService();
