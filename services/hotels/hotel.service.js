const { parse } = require('dotenv');
const HotelRepository = require('../../repositories/hotels/hotel.repository');

class HotelService {
  async getAllHotels() {
    const hotels = await HotelRepository.getAllHotels();
    return hotels || [];
  }

  async getAllHotelsDatatables({ draw, start, length, search, order, columns }) {
    const searchValue = search?.value || "";

    const { count, rows } = await HotelRepository.getPaginatedHotels({
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

  async getHotelById(id) {
    try {
      const hotel = await HotelRepository.getHotelById(id);
      return hotel || [];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createHotel(hotelData) {
    try {
      const requiredFields = ["name", "location", "rating", "description"];

      if (!requiredFields.every(field => hotelData[field])) {
        throw new Error("Semua field wajib diisi"); // Validasi input
      }

      return await HotelRepository.createHotel(hotelData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateHotel(id, hotelData) {
    try {
      const hotel = await HotelRepository.getHotelById(id);
      if (!hotel) {
        throw new Error("Hotel not found");
      }
      await HotelRepository.updateHotel(id, hotelData);
      return { message: "Hotel updated successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteHotel(id) {
    try {
      const hotel = await HotelRepository.getHotelById(id);
      if (!hotel) {
        throw new Error("Hotel not found");
      }
      await HotelRepository.deleteHotel(id);
      return { message: "Hotel deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new HotelService();