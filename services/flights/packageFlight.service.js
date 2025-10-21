const PackageFlightRepository = require("../../repositories/flights/packageFlight.repository");

class PackageFlightService {
  async getAllPackageFlights() {
    const packageFlights = await PackageFlightRepository.getAllPackageFlights();
    return packageFlights || [];
  }

  async getPackageFlightById(id) {
    try {
      const packageFlight = await PackageFlightRepository.getPackageFlightById(id);
      return packageFlight || [];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createPackageFlight(packageFlightData) {
    try {
      const requiredFields = ["package_id", "flight_id"];

      if (!requiredFields.every(field => packageFlightData[field])) {
        throw new Error("Semua field wajib diisi"); // Validasi input
      }

      return await PackageFlightRepository.createPackageFlight(packageFlightData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updatePackageFlight(id, packageFlightData) {
    try {
      const packageFlight = await PackageFlightRepository.getPackageFlightById(id);
      if (!packageFlight) {
        throw new Error("Package Flight not found");
      }
      await PackageFlightRepository.updatePackageFlight(id, packageFlightData);
      return { message: "Package Flight updated successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deletePackageFlight(id) {
    try {
      const packageFlight = await PackageFlightRepository.getPackageFlightById(id);
      if (!packageFlight) {
        throw new Error("Package Flight not found");
      }
      await PackageFlightRepository.deletePackageFlight(id);
      return { message: "Package Flight deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new PackageFlightService();