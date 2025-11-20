const { Model, Op, where } = require("sequelize");
const { sequelize, Menu } = require("../models");

class SubmenuRepository {
  async getSubmenu(id_menu) {
    return await Menu.findAll({
      where:{
        parent_id: {[Op.ne]: null}
      },
      order: [['urutan', 'ASC']]
    })
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

  async deleteSubmenu(id_menu) {
    await Menu.destroy({where: {id_menu}});
  }
}

module.exports = new SubmenuRepository();