const SubmenuRepository = require("../repositories/submenu.repository");

class SubmenuSerivce {
    // submenu start
  async getSubmenu() {
    const submenu = await SubmenuRepository.getSubmenu();
    return submenu || []; // jika null/undefined, tetap kembalikan array kosong
  }

  async getSubmenuPaginated({ draw, start, length, search, order, columns }) {
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

  async getSubmenuById(id_menu) {
    const submenu = await SubmenuRepository.getSubmenuById_menu();
    return submenu || [];
  }

  async createSubmenu(menuData){
      const requiredFields = ['nama_menu', 'link', 'icon', 'urutan', 'is_active', 'parent_id'];
      for(const field of requiredFields){
        if(menuData[field] === undefined){
          throw new Error (`${field} wajib diisi`);
        }
      }
      return await SubmenuRepository.createSubmenu(menuData);
    }

  async updateMenu(id_menu, menuData) {
    const submenu = await SubmenuRepository.updateSubmenu(id_menu);
    if(!submenu){
      throw new Error ("Submenu Not Found");
    }
    return await SubmenuRepository.updateMenu(id_menu, menuData);                           
  }

  async deleteSubmenu(id_menu) {
    const submenu = await SubmenuRepository.deleteSubmenu(id_menu);
    if(!submenu){
      throw new Error ("Submenu Not Found");
    }
    return await SubmenuRepository.deleteSubmenu(id_menu);
  }
  // submenu end

}

  module.exports = new SubmenuSerivce();