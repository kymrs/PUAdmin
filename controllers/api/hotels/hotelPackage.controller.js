const response = require("../../../utils/response");
const hotelPackageService = require("../../../services/hotels/hotelPackage.service");

class HotelPackageController {
  async getAllHotelPackages(req, res) {
    try {
      const hotelPackages = await hotelPackageService.getAllHotelPackages();
      return response.success(res, "All package hotels fetched", hotelPackages);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getAllHotelPackageDatatables(req, res) {
    try {
      const { akses } = res.locals;
      console.log("akses", akses);
  
      if (akses.view_level !== "Y") {
        return res.status(403).json({ error: "Akses ditolak" });
      }
  
      const result = await hotelPackageService.getAllHotelPackageDatatables(req.query);
      result.data = result.data.map(row => ({
        ...row.get({ plain: true }),
        akses: {
          edit: akses.edit_level === "Y",
          delete: akses.delete_level === "Y"
        }
      }));
  
      return response.datatables(res, result);
    } catch (error) {
      console.error("Error getAllTravelsDatatables:", error);
      return response.error(res, error.message);
    }
  }

  async getHotelPackageById(req, res) {
    try {
      const hotelPackage = await hotelPackageService.getHotelPackageById(req.params.id);
      return response.success(res, "Hotel Package fetched", hotelPackage);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createHotelPackage(req, res) {
    try {
      const hotelPackage = await hotelPackageService.createHotelPackage(req.body);
      return response.success(res, "Hotel Package created successfully", hotelPackage);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async updateHotelPackage(req, res) {
    try {
      const updatedHotelPackage = await hotelPackageService.updateHotelPackage(req.params.id, req.body);
      return response.success(res, "Hotel Package updated successfully", updatedHotelPackage);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async deleteHotelPackage(req, res) {
    try {
      const result = await hotelPackageService.deleteHotelPackage(req.params.id);
      return response.success(res, "Hotel Package deleted successfully", result);
    } catch (error) {
      return response.error(res, error.message);
    }
  }
}

module.exports = new HotelPackageController();