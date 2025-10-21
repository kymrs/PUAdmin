const aksesmenuService = require("../../services/aksesmenu.service");
const response = require("../../utils/response");

class AksesmenuController {
  async getAllAksesmenu(req, res) {
    try {
      const aksesmenu = await aksesmenuService.getAllAksesmenu();
      return response.success(res, "All aksesmenu fetched", aksesmenu);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getAksesmenuByLevel(req, res) {

    try {
      const aksesmenu = await aksesmenuService.getAksesmenuByLevel(req.session.user.id_level);
      return response.success(res, "Aksesmenu by level fetched", aksesmenu);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getAksesmenuById(req, res) {
    try {
      const aksesmenu = await aksesmenuService.getAksesmenuById(req.params.id);
      return response.success(res, "Aksesmenu fetched", aksesmenu);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createAksesmenu(req, res) {
    try {
      const aksesmenu = await aksesmenuService.createAksesmenu(req.body);
      return response.created(res, "Aksesmenu created", aksesmenu);
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async updateAksesmenu(req, res) {
    try {
      await aksesmenuService.updateAksesmenu(req.params.id, req.body);
      return response.success(res, "Aksesmenu updated successfully");
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async deleteAksesmenu(req, res) {
    try {
      await aksesmenuService.deleteAksesmenu(req.params.id);
      return response.success(res, "Aksesmenu deleted successfully");
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }
}

module.exports = new AksesmenuController();