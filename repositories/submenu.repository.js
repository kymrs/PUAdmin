const { Model, Op } = require("sequelize");
const { sequelize, Submenu } = require("../models");
const aksessubmenuRepository = require("./aksessubmenu.repository");

class SubmenuRepository {
  async getAllSubmenu() {
    return await Submenu.findAll();
  }

  async getPaginatedSubmenu({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { id_submenu: { [Op.like]: `%${search}%` } },
          { id_menu: { [Op.like]: `%${search}%` } },
          { nama_submenu: { [Op.like]: `%${search}%` } },
          { link: { [Op.like]: `%${search}%` } },
          { icon: { [Op.like]: `%${search}%` } },
          { urutan: { [Op.like]: `%${search}%` } },
          { is_active: { [Op.like]: `%${search}%` } }
        ]
      })
      // Add any other filters you need here
    };

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["created_at", "DESC"]];

    const offset = start || 0; // Default to 0 if start is not provided
    const limit = length || 10; // Default to 10 if length is not provided

    const result = await Submenu.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async getSubmenuById(id_submenu) {
    return await Submenu.findByPk(id_submenu);
  }

  async getSubmenuById_menu(id_menu) {
    return await Submenu.findOne({
      where: { id_menu },
      attributes: ["id_submenu"]
    });
  }

  async createSubmenu(menuData) {
    return await Submenu.create(menuData);
  }

  async updateSubmenu(id_submenu, menuData) {
    return await Submenu.update(menuData, { where: { id_submenu } });
  }

  async deleteSubmenu(id_submenu) {
    const transaction = await sequelize.transaction();
  
    try {
      // Hapus akses submenu terlebih dahulu
      await aksessubmenuRepository.deleteAksessubmenuById_submenu(id_submenu, transaction);
  
      // Hapus submenu
      await Submenu.destroy({
        where: { id_submenu },
        transaction
      });
  
      await transaction.commit();
      return { success: true, message: 'Submenu dan akses submenu berhasil dihapus' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new SubmenuRepository();
