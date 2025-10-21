const aksesmenuService = require("../../services/aksesmenu.service");
const aksessubmenuService = require("../../services/aksessubmenu.service");
const userlevelService = require("../../services/userlevel.service");
const response = require("../../utils/response");

class UserlevelController {
  async getAllUserlevel(req, res) {
    try {
      const userlevel = await userlevelService.getAllUserlevel();
      return response.success(res, "All userlevel fetched", userlevel);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getAllUserlevelDatatables(req, res) {
    try {
      const { akses } = res.locals;
  
      if (akses.view_level !== 'Y') {
        return res.status(403).json({ error: "Akses ditolak" });
      }
  
      const result = await userlevelService.getAllUserlevelDatatables(req.query);
  
      result.data = result.data.map(row => ({
        ...row.get({ plain: true }),
        akses: {
          edit: akses.edit_level === 'Y',
          delete: akses.delete_level === 'Y'
        }
      }));
  
      return response.datatables(res, result);
    } catch (error) {
      console.error("Error getAllUserlevelDatatables:", error);
      return response.error(res, error.message);
    }
  }
  
  async getUserAksesByLevel(req, res) {
      try {
        const aksesmenu = await aksesmenuService.getAksesmenuByLevel(req.session.user.id_level);
        const aksesSubmenu = await aksessubmenuService.getAksessubmenuByLevel(req.session.user.id_level);

        return response.success(res, "User akses fetched", {
          aksesmenu: aksesmenu.map(menu => menu.dataValues),  // Mengambil dataValues untuk aksesmenu
          aksesSubmenu: aksesSubmenu.map(submenu => submenu.dataValues)  // Mengambil dataValues untuk aksessubmenu
        });        
      } catch (error) {
        return response.error(res, error.message);
      }
  }
  

  async getUserlevelById(req, res) {
    try {
      const userlevel = await userlevelService.getUserlevelById(req.params.id);
      return response.success(res, "Userlevel fetched", userlevel);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createUserlevel(req, res) {
    try {
      const userlevel = await userlevelService.createUserlevel(req.body);
      return response.created(res, "Userlevel created", userlevel);
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async updateUserlevel(req, res) {
    try {
      await userlevelService.updateUserlevel(req.params.id, req.body);
      return response.success(res, "Userlevel updated successfully");
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }

  async deleteUserlevel(req, res) {
    try {
      await userlevelService.deleteUserlevel(req.params.id);
      return response.success(res, "Userlevel deleted successfully");
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async upsertAccess(req, res) {
    try {
      const id_level = req.session.user.id_level;
      const aksesData = req.body.akses;

      // console.log("ID Level:", id_level);
      // console.log("Akses Data:", aksesData);

      const result = await userlevelService.upsertAccess({ id_level, akses: aksesData });
      return response.success(res, "Access updated successfully", result);
    } catch (error) {
      return response.error(res, error.message, 400);
    }
  }
  

}

module.exports = new UserlevelController();