const response = require("../../utils/response");
const travelReviewsService = require("../../services/travelreviews.service");

class TravelReviewsController {
  async getAllTravelReviews(req, res) {
    try {
      const reviews = await travelReviewsService.getAllTravelReviews();
      return response.success(res, "All travel reviews fetched", reviews);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getAllTravelReviewsDatatables(req, res) {
    try {
      const { akses = {} } = res.locals;
      // console.log("akses", akses);

      if (akses.view_level !== 'Y') {
        return res.status(403).json({ error: "Akses ditolak" });
      }

      const result = await travelReviewsService.getAllTravelReviewsDatatables(req.query);
      result.data = result.data.map(row => ({
        ...row.get({ plain: true }),
        akses: {
          edit: akses.edit_level === 'Y',
          delete: akses.delete_level === 'Y',
        },
      }));

      return response.datatables(res, result);
    } catch (error) {
      console.error("Error getAllTravelReviewsDatatables:", error);
      return response.error(res, error.message);
    }
  }

  async getTravelReviewsById(req, res) {
    try {
      const review = await travelReviewsService.getTravelReviewsById(req.params.id);
      return response.success(res, "Travel review fetched", review);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createTravelReviews(req, res) {
    try {
      const newReview = await travelReviewsService.createTravelReviews(req.body);
      return response.success(res, "Travel review created", newReview);
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async updateTravelReviews(req, res) {
    try {
      await travelReviewsService.updateTravelReviews(req.params.id, req.body);
      return response.success(res, "Travel review updated successfully");
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async deleteTravelReviews(req, res) {
    try {
      await travelReviewsService.deleteTravelReviews(req.params.id);
      return response.success(res, "Travel review deleted successfully");
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }
}

module.exports = new TravelReviewsController();
