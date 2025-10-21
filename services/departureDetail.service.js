const DepartureDetailRepository = require("../repositories/departureDetail.repository");

class DepartureDetailService {
  async getAllDepartureDetails() {
    const departureDetails = await DepartureDetailRepository.getAllDepartureDetails();
    return departureDetails || [];
  }

  async getPaginatedDepartureDetails({ start, length, search, order, columns }) {
    return await DepartureDetailRepository.getPaginatedDepartureDetails({ start, length, search, order, columns });
  }

  async getDepartureDetailById(id) {
    const departureDetail = await DepartureDetailRepository.getDepartureDetailById(id);
    if (!departureDetail) {
      throw new Error("Departure detail not found");
    }
    return departureDetail;
  }

    async createDepartureDetail(departureDetailData) {
        const requiredFields = ["package_id", "departure_date", "departure_location", "group_quota"];
        
        if (!requiredFields.every(field => departureDetailData[field])) {
        throw new Error("All fields are required");
        }
    
        return await DepartureDetailRepository.createDepartureDetail(departureDetailData);
    }

    async updateDepartureDetail(id, departureDetailData) {
        const departureDetail = await DepartureDetailRepository.getDepartureDetailById(id);
        if (!departureDetail) {
            throw new Error("Departure detail not found");
        }
        await DepartureDetailRepository.updateDepartureDetail(id, departureDetailData);
        return { message: "Departure detail updated successfully" };
    }

    async deleteDepartureDetail(id) {
        const departureDetail = await DepartureDetailRepository.getDepartureDetailById(id);
        if (!departureDetail) {
            throw new Error("Departure detail not found");
        }
        await DepartureDetailRepository.deleteDepartureDetail(id);
        return { message: "Departure detail deleted successfully" };
    }
}

module.exports = new DepartureDetailService();