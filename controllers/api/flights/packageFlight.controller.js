const response = require("../../../utils/response");
const packageFlightService = require("../../../services/flights/packageFlight.service");

class PackageFlightController {
  async getAllPackageFlights(req, res) {
    try {
      const packageFlights = await packageFlightService.getAllP;
      return response.success(res, "All package flights fetched", packageFlights);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getPackageFlightById(req, res) {
    try {
      const packageFlight = await packageFlightService.getPackageFlightById(req.params.id);
      return response.success(res, "Package flight fetched", packageFlight);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createPackageFlight(req, res) {
    try {
      const packageFlight = await packageFlightService.createPackageFlight(req.body);
      return response.success(res, "Package flight created successfully", packageFlight);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async updatePackageFlight(req, res) {
    try {
      const updatedPackageFlight = await packageFlightService.updatePackageFlight(req.params.id, req.body);
      return response.success(res, "Package flight updated successfully", updatedPackageFlight);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async deletePackageFlight(req, res) {
    try {
      const result = await packageFlightService.deletePackageFlight(req.params.id);
      return response.success(res, "Package flight deleted successfully", result);
    } catch (error) {
      return response.error(res, error.message);
    }
  }
}

module.exports = new PackageFlightController();