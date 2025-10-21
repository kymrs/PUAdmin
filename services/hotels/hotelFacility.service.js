const HotelFacilityRepository = require('../../repositories/hotels/hotelFacility.repository');

class HotelFacilityService {
  async getAllHotelFacilities() {
    const facilities = await HotelFacilityRepository.getAllFacilities();
    return facilities || [];
  }

  async getHotelFacilityById(id) {
    try {
      const facility = await HotelFacilityRepository.getFacilityById(id);
      return facility || [];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createHotelFacility(facilityData) {
    try {
      const requiredFields = ["hotel_id", "name"];

      if (!requiredFields.every(field => facilityData[field])) {
        throw new Error("All fields are required");
      }

      return await HotelFacilityRepository.createFacility(facilityData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateHotelFacility(id, facilityData) {
    try {
      const facility = await HotelFacilityRepository.getFacilityById(id);
      if (!facility) {
        throw new Error("Hotel facility not found");
      }
      await HotelFacilityRepository.updateFacility(id, facilityData);
      return { message: "Hotel facility updated successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteHotelFacility(id) {
    try {
      const facility = await HotelFacilityRepository.getFacilityById(id);
      if (!facility) {
        throw new Error("Hotel facility not found");
      }
      await HotelFacilityRepository.deleteFacility(id);
      return { message: "Hotel facility deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new HotelFacilityService();