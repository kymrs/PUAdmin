const SubmenuRepository = require("../repositories/submenu.repository");

class SubmenuService {
  async getAllSubmenu() {
    const submenu = await SubmenuRepository.getAllSubmenu();
    return submenu || []; // jika null/undefined, tetap kembalikan array kosong
  }

  async getAllSubmenuDatatables({ draw, start, length, search, order, columns }) {
    const searchValue = search?.value || "";
    
    const { count, rows } = await SubmenuRepository.getPaginatedSubmenu({
      start: parseInt(start, 10) || 0,
      length: parseInt(length, 10) || 10,
      search: searchValue,
      order,
      columns
    });

    return {
      draw: parseInt(draw, 10),
      recordsTotal: count,
      recordsFiltered: count,
      data: rows
    };
  }

  async getSubmenuById(id_submenu) {
    const submenu = await SubmenuRepository.getSubmenuById(id_submenu);
    return submenu || []; // jika null/undefined, tetap kembalikan array kosong
  }

  async createSubmenu(subMenuData) {
    const requiredFields = ["id_menu", "nama_submenu", "link", "icon", "urutan", "is_active"];
    if (!requiredFields.every(field => subMenuData[field])) {
      throw new Error("Semua field wajib diisi");
    }
    return await SubmenuRepository.createSubmenu(subMenuData);
  }

  async updateSubmenu(id_submenu, subMenuData) {
    const submenu = await SubmenuRepository.getSubmenuById(id_submenu);
    if (!submenu) {
      throw new Error("Submenu not found");
    }
    return await SubmenuRepository.updateSubmenu(id_submenu, subMenuData);
  }

  async deleteSubmenu(id_submenu) {
    const submenu = await SubmenuRepository.getSubmenuById(id_submenu);
    if (!submenu) {
      throw new Error("Submenu not found");
    }
    return await SubmenuRepository.deleteSubmenu(id_submenu);
  }
}

module.exports = new SubmenuService();