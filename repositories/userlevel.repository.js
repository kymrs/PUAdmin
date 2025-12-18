const { Op } = require("sequelize");
const { sequelize, Userlevel, Akses } = require("../models");

class UserlevelRepository {

  async getAllUserlevels() {
    return await Userlevel.findAll();
  }


  async getPaginatedUserlevels({ start, length, search, order, columns }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { id_level: { [Op.like]: `%${search}%` } },
          { nama_level: { [Op.like]: `%${search}%` } }
        ]
      })
    };

    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["created_at", "DESC"]];

    const offset = start || 0;
    const limit = length || 10;

    const result = await Userlevel.findAndCountAll({
      where,
      order: sort,
      offset,
      limit
    });

    return result;
  }


  async getUserlevelById(id_level) {
    return await Userlevel.findByPk(id_level);
  }


  async createUserlevel(data) {
    return await Userlevel.create(data);
  }


  async updateUserlevel(id_level, data) {
    return await Userlevel.update(data, { where: { id_level } });
  }


  async deleteUserlevel(id_level) {
    return await Userlevel.destroy({ where: { id_level } });
  }



  /**
   * ================================
   * REFACTOR UPSERT ACCESS (FINAL)
   * ================================
   * Struktur aksesList dari frontend:
   * [
   *   { id: 5, id_menu: 3, view_level: 'Y' },
   *   { id: null, id_menu: 7, edit_level: 'Y' },
   * ]
   */
  async upsertAccess(id_level, aksesList) {
    const transaction = await sequelize.transaction();

    try {
      for (const akses of aksesList) {
        const { id, id_menu, ...permissions } = akses;

        if (!id_menu) {
          throw new Error("id_menu missing in akses entry");
        }

        // Clean object: only include valid permission columns
        const allowedFields = [
          "view_level",
          "add_level",
          "edit_level",
          "delete_level",
          "print_level",
          "upload_level"
        ];

        const perms = {};
        for (const key of allowedFields) {
          if (permissions[key] !== undefined) {
            perms[key] = permissions[key];
          }
        }

        // If id exists → update
        if (id) {
          await Akses.update(
            { ...perms },
            { where: { id }, transaction }
          );
        }

        // If id does NOT exist → create new akses
        else {
          await Akses.create(
            {
              id_level,
              id_menu,
              ...perms
            },
            { transaction }
          );
        }
      }

      await transaction.commit();
      return { message: "Akses berhasil diperbarui" };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

}

module.exports = new UserlevelRepository();
