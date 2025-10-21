const menuService = require("../../services/menu.service");
const response = require("../../utils/response");

class MenuController {
  async getAllMenu(req, res) {
    try {
      const menu = await menuService.getAllMenu();
      return response.success(res, "All menu fetched", menu);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getAllMenuDatatables(req, res) {
    try {
      const { akses } = res.locals;

      // console.log("akses", akses);
        
        if (akses.view_level !== 'Y') {
          return res.status(403).json({ error: "Akses ditolak" });
        }
  
        const result = await menuService.getAllMenuDatatables(req.query);
  
        result.data = result.data.map(row => ({
          ...row.get({ plain: true }),
          akses: {
            edit: akses.edit_level === 'Y',
            delete: akses.delete_level === 'Y'
          }
        }));
  
        return response.datatables(res, result);
      } catch (error) {
        console.error("Error getAllMenuDatatables:", error);
        return response.error(res, error.message);
    }
  }

  async getMenuById(req, res) {
    try {
      const menu = await menuService.getMenuById(req.params.id);
      return response.success(res, "Menu fetched", menu);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createMenu(req, res) {
    try {
      const menu = await menuService.createMenu(req.body);
      return response.created(res, "Menu created", menu);
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async updateMenu(req, res) {
    try {
      await menuService.updateMenu(req.params.id, req.body);
      return response.success(res, "Menu updated successfully");
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async deleteMenu(req, res) {
    try {
      await menuService.deleteMenu(req.params.id);
      return response.success(res, "Menu deleted successfully");
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }
}

module.exports = new MenuController();