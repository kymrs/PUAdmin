const AksessubmenuRepository = require("../repositories/aksessubmenu.repository");

class AksessubmenuService {
  async getAllAksessubmenu() {
    const aksessubmenu = await AksessubmenuRepository.getAllAksessubmenu();
    if (aksessubmenu.length === 0) {
      throw new Error("No aksessubmenu found");
    }
    return aksessubmenu;
  }

  async getAksessubmenuById(id) {
    const aksessubmenu = await AksessubmenuRepository.getAksessubmenuById(id);
    if (!aksessubmenu) {
      throw new Error("Aksessubmenu not found");
    }
    return aksessubmenu;
  }

  async getAksessubmenuByLevel(id_level) {
    const aksessubmenu = await AksessubmenuRepository.getAksessubmenuWithSubmenuByLevel(id_level);
    if (!aksessubmenu || aksessubmenu.length === 0) {
      throw new Error("No aksessubmenu found for the given level");
    }
    return aksessubmenu;
  }

  async createAksessubmenu(aksessubmenuData) {
    const requiredFields = ["id_level", "id_submenu", "view_level", "add_level", "edit_level", "delete_level", "print_level", "upload_level"];
    if (!requiredFields.every(field => aksessubmenuData[field])) {
      throw new Error("Semua field wajib diisi");
    }
    return await AksessubmenuRepository.createAksessubmenu(aksessubmenuData);
  }

  async updateAksessubmenu(id, aksessubmenuData) {
    const aksessubmenu = await AksessubmenuRepository.getAksessubmenuById(id);
    if (!aksessubmenu) {
      throw new Error("Aksessubmenu not found");
    }
    return await AksessubmenuRepository.updateAksessubmenu(id, aksessubmenuData);
  }

  async deleteAksessubmenu(id) {
    const aksessubmenu = await AksessubmenuRepository.getAksessubmenuById(id);
    if (!aksessubmenu) {
      throw new Error("Aksessubmenu not found");
    }
    return await AksessubmenuRepository.deleteAksessubmenu(id);
  }
}

module.exports = new AksessubmenuService();