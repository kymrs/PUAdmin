const { Aksessubmenu, Submenu } = require("../models");

class AksessubmenuRepository {
  async getAllAksessubmenu() {
    return await Aksessubmenu.findAll();
  }

  async getAksessubmenuById(id) {
    return await Aksessubmenu.findByPk(id);
  }

  async getAksessubmenuWithSubmenuByLevel(id_level) {
    return await Submenu.findAll({
      include: [{
        model: Aksessubmenu,
        required: false,
        where: { id_level: id_level },
      }],
    });
  }

  async createAksessubmenu(aksesmenuData) {
    return await Aksessubmenu.create(aksesmenuData);
  }

  async updateAksessubmenu(id, aksesmenuData) {
    return await Aksessubmenu.update(aksesmenuData, { where: { id } });
  }

  async deleteAksessubmenu(id) {
    return await Aksessubmenu.destroy({ where: { id } });
  }

  async deleteAksessubmenuById_submenu(id_submenu, transaction) {
    return await Aksessubmenu.destroy({
      where: { id_submenu },
      transaction
    });
  }
  

  async upsert(data, options) {
    const { id, id_level, id_submenu, level, status } = data;
    // console.log(data)
    try {
      // Siapkan payload hanya dengan field yang valid
      const payload = {
        id_level,
        id_submenu,
        [level]: status,
        ...(id !== undefined && id !== 'undefined' && id !== null ? { id: Number(id) } : {})
      };
  
      const [aksessubmenu] = await Aksessubmenu.upsert(payload, {
        returning: true,
        ...options
      });
  
      return aksessubmenu;
    } catch (error) {
      throw new Error('Failed to upsert Aksessubmenu: ' + error.message);
    }
  }
  
}

module.exports = new AksessubmenuRepository();
