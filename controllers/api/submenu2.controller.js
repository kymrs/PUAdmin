const SubmenuService = require('../../services/submenu2.service');
const SubmenuRepository = require('../../repositories/submenu2.repository');
const response = require('../../utils/response');

class SubmenuController {
    // submenu start
    async getAllSubmenu(req, res){
      try{
        const submenu = await SubmenuService.getSubmenu();
        return res.status(200).json({
          success: true,
          message: "Submenu fetched successfully",
          data: submenu,
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error fetching submenu",
          error: error.message,
        })
      }
    }


   async createSubmenu(req, res) {
    try {
      const submenu = await SubmenuService.createSubmenu(req.body);
      return res.status(200).json({
        success: true,
        message: "Submenu created successfully",
        data: submenu,
      });
    } catch (error) {
      console.error("Error in createSubmenu:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  }

   async updateSubmenu(req, res) {
    try {
      const {id} = req.params;
      const submenu = await SubmenuRepository.getSubmenuById_menu(id);
      if (!submenu) {
        return res.status(404).json({
          status: "error",
          message: "Submenu tidak ditemukan",
        });
      }

      await menuRepository.updateSubmenu(id, req.body)

      return res.status(200).json({
        success: true,
        message: "Submenu updated successfully",
      })

    } catch (error) {
      console.error("Error in updateMenu:", error);
      return res.status(404).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  }

  async deleteSubmenu(req, res) {
    try {

      const {id} = req.params;
   
      await SubmenuRepository.deleteSubmenu(id);

      return res.status(200).json({
        success: true,
        message: "Submenu deleted successfully",
      });

    } catch (error) {
      console.error("Error in deleteMenu:", error);
      return response.notFound(res, error.message);
    }
  }
  //submenu end
}
module.exports = new SubmenuController();