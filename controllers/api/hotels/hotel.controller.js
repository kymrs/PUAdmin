const response = require("../../../utils/response");
const hotelService = require("../../../services/hotels/hotel.service");

class HotelController {
  async getAllHotels(req, res) {
    try {
      const hotels = await hotelService.getAllHotels();
      return response.success(res, "All hotels fetched", hotels);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getAllHotelDatatables(req, res) {
    try {
      const { akses } = res.locals;
      // console.log("akses", akses);
      if (akses.view_level !== "Y") {
        return res.status(403).json({ error: "Akses ditolak" });
      }
      const result = await hotelService.getAllHotelsDatatables(req.query);
      result.data = result.data.map(row => ({
        ...row.get({ plain: true }),
        akses: {
          edit: akses.edit_level === "Y",
          delete: akses.delete_level === "Y"
        }
      }));
      return response.datatables(res, result);
    } catch (error) {
      console.error("Error getAllHotelsDatatables:", error);
      return response.error(res, error.message);
    }
  }

  async getHotelById(req, res) {
    try {
      const hotel = await hotelService.getHotelById(req.params.id);
      return response.success(res, "Hotel fetched", hotel);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createHotel(req, res) {
    try {
      const hotel = await hotelService.createHotel(req.body);
      return response.success(res, "Hotel created", hotel);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async updateHotel(req, res) {
    try {
      const updatedHotel = await hotelService.updateHotel(req.params.id, req.body);
      return response.success(res, "Hotel updated", updatedHotel);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async deleteHotel(req, res) {
    try {
      await hotelService.deleteHotel(req.params.id);
      return response.success(res, "Hotel deleted");
    } catch (error) {
      return response.error(res, error.message);
    }
  }
}

module.exports = new HotelController();