const PackageFacilityRepository = require("../../repositories/facilities/packageFacility.repository");

class PackageFacilityService {
  async getAllPackageFacilities() {
    const packageFacilities = await PackageFacilityRepository.getAllPackageFacilities();
    return packageFacilities || [];
  }

  async getPackageFacilityById(id) {
    try {
      const packageFacility = await PackageFacilityRepository.getPackageFacilityById(id);
      return packageFacility || [];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createPackageFacility(packageFacilityData) {
    try {
      const requiredFields = ["package_id", "facility", "status"];

      if (!requiredFields.every(field => packageFacilityData[field])) {
        throw new Error("Semua field wajib diisi"); // Validasi input
      }

      return await PackageFacilityRepository.createPackageFacility(packageFacilityData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updatePackageFacility(id, packageFacilityData) {
    try {
      const packageFacility = await PackageFacilityRepository.getPackageFacilityById(id);
      if (!packageFacility) {
        throw new Error("Package Facility not found");
      }
      await PackageFacilityRepository.updatePackageFacility(id, packageFacilityData);
      return { message: "Package Facility updated successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deletePackageFacility(id) {
    try {
      const packageFacility = await PackageFacilityRepository.getPackageFacilityById(id);
      if (!packageFacility) {
        throw new Error("Package Facility not found");
      }
      await PackageFacilityRepository.deletePackageFacility(id);
      return { message: "Package Facility deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
    }
}

module.exports = new PackageFacilityService();