const HotelPackageRepository = require("../../repositories/hotels/hotelPackage.repository");

class HotelPackageService {
  async getAllHotelPackages() {
    const hotelPackages = await HotelPackageRepository.getAllHotelPackages();
    return hotelPackages || [];
  }

  async getHotelPackageById(id) {
    try {
      const hotelPackage = await HotelPackageRepository.getHotelPackageById(id);
      return hotelPackage || [];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createHotelPackage(hotelPackageData) {
    try {
      const requiredFields = ["package_id", "hotel_id", "location_type", "number_of_night"];

      if (!requiredFields.every(field => hotelPackageData[field])) {
        throw new Error("Semua field wajib diisi"); // Validasi input
      }

      return await HotelPackageRepository.createHotelPackage(hotelPackageData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateHotelPackage(id, hotelPackageData) {
    try {
      const hotelPackage = await HotelPackageRepository.getHotelPackageById(id);
      if (!hotelPackage) {
        throw new Error("Hotel Package not found");
      }
      await HotelPackageRepository.updateHotelPackage(id, hotelPackageData);
      return { message: "Hotel Package updated successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteHotelPackage(id) {
    try {
      const hotelPackage = await HotelPackageRepository.getHotelPackageById(id);
      if (!hotelPackage) {
        throw new Error("Package Hotel not found");
      }
      await HotelPackageRepository.deleteHotelPackage(id);
      return { message: "Hotel Package deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllHotelPackageDatatables({ draw, start, length, search, order, columns }) {
      const searchValue = search?.value || "";

      const { count, rows } = await HotelPackageRepository.getPaginatedHotelPackages({
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

module.exports = new HotelPackageService();