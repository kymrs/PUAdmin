const response = require("../../utils/response");
const itineraryService = require("../../services/itinerary.service");

class ItineraryController {
  async getAllItineraries(req, res) {
    try {
      const itineraries = await itineraryService.getAllItineraries();
      return response.success(res, "All itineraries fetched", itineraries);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getItineraryById(req, res) {
    try {
      const itinerary = await itineraryService.getItineraryById(req.params.id);
      return response.success(res, "Itinerary fetched", itinerary);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createItinerary(req, res) {
    try {
      const itinerary = await itineraryService.createItinerary(req.body);
      return response.success(res, "Itinerary created successfully", itinerary);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async updateItinerary(req, res) {
    try {
      const updatedItinerary = await itineraryService.updateItinerary(req.params.id, req.body);
      return response.success(res, "Itinerary updated successfully", updatedItinerary);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async deleteItinerary(req, res) {
    try {
      const result = await itineraryService.deleteItinerary(req.params.id);
      return response.success(res, "Itinerary deleted successfully", result);
    } catch (error) {
      return response.error(res, error.message);
    }
  }
}

module.exports = new ItineraryController();