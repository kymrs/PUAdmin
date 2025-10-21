const { where } = require("sequelize");
const { Aksesmenu, Menu } = require("../models");

class AksesmenuRepository {
  async getAllAksesmenu() {
    return await Aksesmenu.findAll();
  }

  async getAksesmenuById(id) {
    return await Aksesmenu.findByPk(id);
  }

  async createAksesmenu(aksesmenuData) {
    return await Aksesmenu.create(aksesmenuData);
  }

  async updateAksesmenu(id, aksesmenuData) {
    return await Aksesmenu.update(aksesmenuData, { where: { id } });
  }

  async deleteAksesmenu(id) {
    return await Aksesmenu.destroy({ where: { id } });
  }

  async deleteAksesmenuById_menu(id_menu, transaction) {
    return await Aksesmenu.destroy({
      where: { id_menu },
      transaction
    });
  }

  async getAksesmenuByLevel(id_level) {
    return await Menu.findAll({
      include: [{ 
        model: Aksesmenu, 
        required: false,
        where: { id_level: id_level },
      }],
    });
  }

  async upsert(data, options) {
    const { id, id_level, id_menu, level, status } = data;

    try {
      // Upsert Aksesmenu, jika ada maka akan diupdate, jika tidak ada maka diinsert
      const [aksesmenu] = await Aksesmenu.upsert(
        {
          id,
          id_level,
          id_menu,
          [level]: status // Menggunakan computed property untuk level,
        },
        {
          returning: true, // Mengembalikan data setelah upsert
          ...options // Memasukkan transaction dari repository yang lebih tinggi
        }
      );

      return aksesmenu; // Mengembalikan data aksesmenu setelah upsert
    } catch (error) {
      throw new Error('Failed to upsert Aksesmenu: ' + error.message);
    }
  }
}

module.exports = new AksesmenuRepository();
