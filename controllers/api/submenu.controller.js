const submenuService = require("../../services/submenu.service");
const response = require("../../utils/response");

class SubmenuController {
  async getAllSubmenu(req, res) {
    try {
      const submenu = await submenuService.getAllSubmenu();
      return response.success(res, "All submenu fetched", submenu);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getAllSubmenuDatatables(req, res) {
    try {
      const { akses } = res.locals;

      if (akses.view_level !== 'Y') {
        return res.status(403).json({ error: "Akses ditolak" });
      }

      const result = await submenuService.getAllSubmenuDatatables(req.query);

      result.data = result.data.map(row => ({
        ...row.get({ plain: true }),
        akses: {
          edit: akses.edit_level === 'Y',
          delete: akses.delete_level === 'Y'
        }
      }));

      return response.datatables(res, result);
    } catch (error) {
      console.error("Error getAllSubmenuDatatables:", error);
      return response.error(res, error.message);
    } 
  }

  async getSubmenuById(req, res) {
    try {
      const submenu = await submenuService.getSubmenuById(req.params.id);
      return response.success(res, "Submenu fetched", submenu);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createSubmenu(req, res) {
    try {
      const submenu = await submenuService.createSubmenu(req.body);
      return response.created(res, "Submenu created", submenu);
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async updateSubmenu(req, res) {
    try {
      await submenuService.updateSubmenu(req.params.id, req.body);
      return response.success(res, "Submenu updated successfully");
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async deleteSubmenu(req, res) {
    try {
      await submenuService.deleteSubmenu(req.params.id);
      return response.success(res, "Submenu deleted successfully");
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }
}

module.exports = new SubmenuController();