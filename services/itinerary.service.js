const ItineraryRepository = require("../repositories/itinerary.repository");

class ItineraryService {
  async getAllItineraries() {
    const itineraries = await ItineraryRepository.getAllItineraries();
    return itineraries || [];
  }

  async getPaginatedItineraries({ start, length, search, order, columns }) {
    return await ItineraryRepository.getPaginatedItineraries({ start, length, search, order, columns });
  }

  async getItineraryById(id) {
    const itinerary = await ItineraryRepository.getItineraryById(id);
    if (!itinerary) {
      throw new Error("Itinerary not found");
    }
    return itinerary;
  }

  async createItinerary(itineraryData) {
    const requiredFields = ["package_id", "day_number", "activity", "location", "time"];
    
    if (!requiredFields.every(field => itineraryData[field])) {
      throw new Error("All fields are required");
    }

    return await ItineraryRepository.createItinerary(itineraryData);
  }

  async updateItinerary(id, itineraryData) {
    const itinerary = await ItineraryRepository.getItineraryById(id);
    if (!itinerary) {
      throw new Error("Itinerary not found");
    }
    await ItineraryRepository.updateItinerary(id, itineraryData);
    return { message: "Itinerary updated successfully" };
    }

    async deleteItinerary(id) {
        const itinerary = await ItineraryRepository.getItineraryById(id);
        if (!itinerary) {
            throw new Error("Itinerary not found");
        }
        await ItineraryRepository.deleteItinerary(id);
        return { message: "Itinerary deleted successfully" };
    }
}

module.exports = new ItineraryService();