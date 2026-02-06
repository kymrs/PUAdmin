const response = require("../../../utils/response");
const hotelService = require("../../../services/hotels/hotel.service");
// const { link } = require("../../../routes/api/products/products.routes");
// const { upload } = require("../../../utils/uploadFileHandler");

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
      let image = null;
      if (req.file) {
        image = req.file.filename;
      }

      const payload = {
      ...req.body,
      image,
    };

      const hotel = await hotelService.createHotel(payload);
      return response.success(res, "Hotel created", hotel);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  }

  async updateHotel(req, res) {
    try {
      const payload = {
      ...req.body,
      };

      if (req.file) {
        payload.image = req.file.filename;
      }
      
      const updatedHotel = await hotelService.updateHotel(req.params.id, payload);
      return response.success(res, "Hotel updated", updatedHotel);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  }

  async deleteHotel(req, res) {
    try {
      await hotelService.deleteHotel(req.params.id);
      return response.success(res, "Hotel deleted");
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  }

  async uploadImage(req, res) {
    const file = req.file;
    if (!file) {
      return response.error(res, "No file uploaded");
    }

    const imageFileName = file.filename;
    const pathImage = `/assets/img/uploads/${imageFileName}`;

    return response.success(res, "Image uploaded successfully", {
      pathImage
    });
  }

}


module.exports = new HotelController();