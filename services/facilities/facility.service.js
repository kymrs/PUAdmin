const FacilityRepository = require("../../repositories/facilities/facility.repository");

class FacilityService {
  async getAllFacilities() {
    const facilities = await FacilityRepository.getAllFacilities();
    return facilities || [];
  }

  async getFacilityById(id) {
    try {
      const facility = await FacilityRepository.getFacilityById(id);
      return facility || [];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createFacility(facilityData) {
    try {
      const requiredFields = ["name"];

      if (!requiredFields.every(field => facilityData[field])) {
        throw new Error("Semua field wajib diisi"); // Validasi input
      }

      return await FacilityRepository.createFacility(facilityData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateFacility(id, facilityData) {
    try {
      const facility = await FacilityRepository.getFacilityById(id);
      if (!facility) {
        throw new Error("Facility not found");
      }
      await FacilityRepository.updateFacility(id, facilityData);
      return { message: "Facility updated successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteFacility(id) {
    try {
      const facility = await FacilityRepository.getFacilityById(id);
      if (!facility) {
        throw new Error("Facility not found");
      }
      await FacilityRepository.deleteFacility(id);
      return { message: "Facility deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
    }
}

module.exports = new FacilityService();