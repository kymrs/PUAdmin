const response = require("../../../utils/response");
const facilityService = require("../../../services/facilities/facility.service");

class FacilityController {
  async getAllFacilities(req, res) {
    try {
      const facilities = await facilityService.getAllFacilities();
      return response.success(res, "All facilities fetched", facilities);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getFacilityById(req, res) {
    try {
      const facility = await facilityService.getFacilityById(req.params.id);
      return response.success(res, "Facility fetched", facility);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createFacility(req, res) {
    try {
      const facility = await facilityService.createFacility(req.body);
      return response.success(res, "Facility created successfully", facility);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async updateFacility(req, res) {
    try {
      const updatedFacility = await facilityService.updateFacility(req.params.id, req.body);
      return response.success(res, "Facility updated successfully", updatedFacility);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async deleteFacility(req, res) {
    try {
      const result = await facilityService.deleteFacility(req.params.id);
      return response.success(res, "Facility deleted successfully", result);
    } catch (error) {
      return response.error(res, error.message);
    }
  }
}

module.exports = new FacilityController();