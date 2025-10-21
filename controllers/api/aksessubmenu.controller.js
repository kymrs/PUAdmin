const aksessubmenuService = require("../../services/aksessubmenu.service");
const response = require("../../utils/response");

class AksessubmenuController {
  async getAllAksessubmenu(req, res) {
    try {
      const aksessubmenu = await aksessubmenuService.getAllAksessubmenu();
      return response.success(res, "All aksessubmenu fetched", aksessubmenu);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getAksessubmenuByLevel(req, res) {
    try {
      const aksessubmenu = await aksessubmenuService.getAksessubmenuByLevel(req.session.user.id_level);
      return response.success(res, "Aksessubmenu by level fetched", aksessubmenu);
    } catch (error) {
      return response.error(res, error.message);
    }
  }


  async getAksessubmenuById(req, res) {
    try {
      const aksessubmenu = await aksessubmenuService.getAksessubmenuById(req.params.id);
      return response.success(res, "Aksessubmenu fetched", aksessubmenu);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createAksessubmenu(req, res) {
    try {
      const aksessubmenu = await aksessubmenuService.createAksessubmenu(req.body);
      return response.created(res, "Aksessubmenu created", aksessubmenu);
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async updateAksessubmenu(req, res) {
    try {
      await aksessubmenuService.updateAksessubmenu(req.params.id, req.body);
      return response.success(res, "Aksessubmenu updated successfully");
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async deleteAksessubmenu(req, res) {
    try {
      await aksessubmenuService.deleteAksessubmenu(req.params.id);
      return response.success(res, "Aksessubmenu deleted successfully");
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }
}

module.exports = new AksessubmenuController();