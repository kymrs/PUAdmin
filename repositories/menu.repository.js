const { Model, Op, where } = require("sequelize");
const { sequelize, Menu } = require("../models");
const aksesmenuRepository = require("./aksesmenu.repository");
const submenuRepository = require("./submenu.repository");
const { raw } = require("body-parser");

class MenuRepository {

  async getAllNestedMenu(){
    return await Menu.findAll({
      where: {parent_id: null},
      include:[
        {
          model: Menu,
          as: 'children',
          include: [
            {
              model: Menu,
              as: 'children',
              include: [
                {
                  model: Menu,
                  as: 'children'
                }
              ]
            }
          ]
        }
      ],
      order: [['urutan', 'ASC']]
    })
  }

  async getAllMenu() {
    return await Menu.findAll({ 
      raw: true,
      attributes: ['id_menu', 'nama_menu','icon','link','urutan','is_active','parent_id'],
      order: [['urutan', 'ASC']] 
    });
  }

  async getParentMenus() {
    return await Menu.findAll({
      where: {parent_id: null},
      order: [['urutan', 'ASC']]
    })
  }



  async getPaginatedMenu({ start, length, search, order, columns }) {
    const where = {
      parent_id: null,
      ...(search && {
        [Op.or]: [
          { nama_menu: { [Op.like]: `%${search}%` } },
          { link: { [Op.like]: `%${search}%` } },
          { icon: { [Op.like]: `%${search}%` } },
          { urutan: { [Op.like]: `%${search}%` } },
          { is_active: { [Op.like]: `%${search}%` } },
          { parent_id: { [Op.like]: `%${search}%` } }
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
    await Menu.update(menuData, { where: { id_menu } });
    return await Menu.findByPk(id_menu);
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

  async getNestedMenu() {
    const allMenu = await Menu.findAll({
      raw: true,
      order: [['urutan', 'ASC']]
    });

    const menuMap = {};
    allMenu.forEach(menu => {
      menu.children = [];
      menuMap[menu.id_menu].children.push(menu);
    })

    const nestedMenu = [];
    allMenu.forEach(menu => {
      if(menu.parent_id){
        if(menuMap.parent_id){   
          menuMap[menu.parent_id].children.push(menu);
        }
      }else{
        nestedMenu.push(menu);
      }
    })
    return nestedMenu;
  }
  
}

module.exports = new MenuRepository();
