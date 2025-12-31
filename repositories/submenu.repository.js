const { Model, Op, where } = require("sequelize");
const { sequelize, Menu, Akses } = require("../models");
const aksesRepository = require('./akses.repository');

class SubmenuRepository {
  async getSubmenu() {
    return await Menu.findAll({
      where:{
        parent_id: {[Op.ne]: null}
      },
      include: [{
        model: Akses,
        as: 'akses',
        required: false
      }],
      order: [['urutan', 'ASC']]
    })
  }

  async getPaginatedSubmenu({ start, length, search, order, columns, filter={} }) {
    const where = {};

    if( filter.parent_id === null){
      where.parent_id = null;
    }

    if(filter.parent_not_null){
      where.parent_id = {[Op.ne]: null};
    }

    if(search){
      where[Op.or] = [
          { id_menu: { [Op.like]: `%${search}%` } },
          { parent_id: { [Op.like]: `%${search}%` } },
          { nama_menu: { [Op.like]: `%${search}%` } },
          { link: { [Op.like]: `%${search}%` } },
          { icon: { [Op.like]: `%${search}%` } },
          { urutan: { [Op.like]: `%${search}%` } },
          { is_active: { [Op.like]: `%${search}%` } }
        ]
    }

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["urutan", "ASC"]];

    const offset = start || 0; // Default to 0 if start is not provided
    const limit = length || 10; // Default to 10 if length is not provided

    const result = await Menu.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }

  async getSubmenuById(id_menu){
    return await Menu.findByPk(id_menu);
  }

  async getSubmenuById_menu(id_menu) {
    return await Menu.findByPk(id_menu);
  }

  async createSubmenu(menuData){
    return await Menu.create(menuData);
  }

  async updateSubmenu(id_menu, menuData) {
    await Menu.update(menuData, {where: {id_menu}})
  }

  async deleteSubmenu(id_menu, transaction) {
    try {
        await aksesRepository.deleteAksesById_menu(id_menu, transaction);

        await Menu.destroy({ 
          where: { id_menu }, 
          transaction 
        });

        await transaction.commit();
        return {
           success: true,
           message: "Submenu dan akses submenu berhasil dihapus"
          }
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
  }
}

module.exports = new SubmenuRepository();