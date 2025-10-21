const { Model, Op } = require("sequelize");
const { sequelize, Menu } = require("../models");
const aksesmenuRepository = require("./aksesmenu.repository");
const submenuRepository = require("./submenu.repository");

class MenuRepository {
  async getAllMenu() {
    return await Menu.findAll();
  }

  async getPaginatedMenu({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { nama_menu: { [Op.like]: `%${search}%` } },
          { link: { [Op.like]: `%${search}%` } },
          { icon: { [Op.like]: `%${search}%` } },
          { urutan: { [Op.like]: `%${search}%` } },
          { is_active: { [Op.like]: `%${search}%` } }
        ]
      }),
      // Add any other filters you need here
    };

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["created_at", "DESC"]];

    const offset = start || 0; // Default to 0 if start is not provided
    const limit = length || 10; // Default to 10 if length is not provided

    const result = await Menu.findAndCountAll({
      where,
      order: sort,
      offset,
      limit,
    });

    return result;
  }

  async getMenuById(id_menu) {
    return await Menu.findByPk(id_menu);
  }

  async createMenu(menuData) {
    return await Menu.create(menuData);
  }

  async updateMenu(id_menu, menuData) {
    return await Menu.update(menuData, { where: { id_menu } });
  }

  async deleteMenu(id_menu) {
    const transaction = await sequelize.transaction();

    try {
      // Hapus akses menu terlebih dahulu
      await aksesmenuRepository.deleteAksesmenuById_menu(id_menu, transaction);
      const id_submenu = await submenuRepository.getSubmenuById_menu(id_menu);

      if (id_submenu) {
        // Hapus submenu terkait
        await submenuRepository.deleteSubmenu(id_submenu.id_submenu, transaction);
      }

      // Hapus menu
      await Menu.destroy({ where: { id_menu }, transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new MenuRepository();
