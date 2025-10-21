const response = require("../../utils/response");
const departureDetailService = require("../../services/departureDetail.service");

class DepartureDetailController {
  async getAllDepartureDetails(req, res) {
    try {
      const departureDetails = await departureDetailService.getAllDepartureDetails();
      return response.success(res, "All departure details fetched", departureDetails);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getDepartureDetailById(req, res) {
    try {
      const departureDetail = await departureDetailService.getDepartureDetailById(req.params.id);
      return response.success(res, "Departure detail fetched", departureDetail);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createDepartureDetail(req, res) {
    try {
      const departureDetail = await departureDetailService.createDepartureDetail(req.body);
      return response.success(res, "Departure detail created successfully", departureDetail);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async updateDepartureDetail(req, res) {
    try {
      const updatedDepartureDetail = await departureDetailService.updateDepartureDetail(req.params.id, req.body);
      return response.success(res, "Departure detail updated successfully", updatedDepartureDetail);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async deleteDepartureDetail(req, res) {
    try {
      const result = await departureDetailService.deleteDepartureDetail(req.params.id);
      return response.success(res, "Departure detail deleted successfully", result);
    } catch (error) {
      return response.error(res, error.message);
    }
  }
}

module.exports = new DepartureDetailController();