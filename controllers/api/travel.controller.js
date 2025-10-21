const response = require("../../utils/response");
const travelService = require("../../services/travel.service");

class TravelController {
  async getAllTravels(req, res) {
    try {
      const travels = await travelService.getAllTravels();
      return response.success(res, "All travels fetched", travels);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getTravelsByCategory(req, res) {
    try {
      const category = req.query.category;
      const travels = await travelService.getTravelsByCategory(category);
      return response.success(res, "Travels by category fetched", travels);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getAllTravelsDatatables(req, res) {
    try {
      const { akses } = res.locals;
      // console.log("akses", akses);

      if (akses.view_level !== "Y") {
        return res.status(403).json({ error: "Akses ditolak" });
      }

      const result = await travelService.getAllTravelsDatatables(req.query);
      result.data = result.data.map(row => ({
        ...row.get({ plain: true }),
        akses: {
          edit: akses.edit_level === "Y",
          delete: akses.delete_level === "Y"
        }
      }));

      return response.datatables(res, result);
    } catch (error) {
      console.error("Error getAllTravelsDatatables:", error);
      return response.error(res, error.message);
    }
  }

  async getTravelById(req, res) {
    try {
      const travel = await travelService.getTravelById(req.params.id);
      return response.success(res, "Travel fetched", travel);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createTravel(req, res) {
    try {
      const travel = await travelService.createTravel(req.body);
      return response.created(res, "Travel created", travel);
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async updateTravel(req, res) {
    try {
      await travelService.updateTravel(req.params.id, req.body);
      return response.success(res, "Travel updated successfully");
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async deleteTravel(req, res) {
    try {
      await travelService.deleteTravel(req.params.id);
      return response.success(res, "Travel deleted successfully");
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }
}

module.exports = new TravelController();
