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
  async getAllFacilityDatatables({ draw, start, length, search, order, columns }) {
      const searchValue = search?.value || "";
      const { count, rows } = await FacilityRepository.getPaginatedFacilities({
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

  async createFacility(facilityData) {
    try {
      const requiredFields = ["name", 'icon'];

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