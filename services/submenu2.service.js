const SubmenuRepository = require("../repositories/submenu2.repository");

class SubmenuSerivce {
    // submenu start
  async getSubmenu() {
    const submenu = await SubmenuRepository.getSubmenu();
    return submenu || []; // jika null/undefined, tetap kembalikan array kosong
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