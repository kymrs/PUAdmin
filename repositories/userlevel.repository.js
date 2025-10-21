const { Model, Op } = require("sequelize");
const { sequelize, Userlevel } = require("../models");
const aksesmenuRepository = require("./aksesmenu.repository");
const aksessubmenuRepository = require("./aksessubmenu.repository");

class UserlevelRepository {
  async getAllUserlevels() {
    return await Userlevel.findAll();
  }

  async getPaginatedUserlevels({ start, length, search, order, columns, id_level }) {
    const where = {
      ...(search && {
        [Op.or]: [
          { id_level: { [Op.like]: `%${search}%` } },
          { nama_level: { [Op.like]: `%${search}%` } }
        ]
      }),
      // ...(id_level && { id_level }) // Menambahkan filter berdasarkan id_level user yang login
    };
  
    const sort =
      order && order.length > 0
        ? [[columns[order[0].column].data, order[0].dir]]
        : [["created_at", "DESC"]];
  
    const offset = start || 0; // Default to 0 if start is not provided
    const limit = length || 10; // Default to 10 if length is not provided
  
    // Query dengan filter id_level dan kondisi lainnya
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

  async createUserlevel(userlevelData) {
    return await Userlevel.create(userlevelData);
  }

  async updateUserlevel(id_level, userlevelData) {
    return await Userlevel.update(userlevelData, { where: { id_level } });
  }

  async deleteUserlevel(id_level) {
    return await Userlevel.destroy({ where: { id_level } });
  }

  async upsertAccess(id_level, aksesList) {
    const transaction = await sequelize.transaction();
    const insertedIds = {}; // key: `${type}_${id_detail}_${id_level}` -> value: id

    try {
      // Loop aksesList untuk update/upsert Aksesmenu / Aksessubmenu
      for (const akses of aksesList) {
        const { id, type, id_detail, level, status } = akses;

        const key = `${type}_${id_detail}_${id_level}`;
        
        // Menentukan id_menu atau id_submenu berdasarkan tipe
        let aksesData = {
          id_level,
          level,
          status
        };

        // Ambil ID dari penyimpanan sementara kalau ada
        if (insertedIds[key]) {
          aksesData.id = insertedIds[key];
        } else if (id !== undefined && id !== 'undefined') {
          aksesData.id = id;
        }
        
  
        if (type === 'menu' && id_detail) {
          aksesData.id_menu = id_detail;
        } else if (type === 'submenu' && id_detail) {
          aksesData.id_submenu = id_detail;
        } else {
          throw new Error(`Invalid type or id_detail: ${type}, ${id_detail}`);
        }
        
  
        // Proses upsert untuk menu atau submenu
        if (type === 'menu') {
          const menu = await aksesmenuRepository.upsert(aksesData, { transaction });
          if (!insertedIds[key]) {
            insertedIds[key] = menu.id;
          }
        } else if (type === 'submenu') {
          const submenu = await aksessubmenuRepository.upsert(aksesData, { transaction });
          if (!insertedIds[key]) {
            insertedIds[key] = submenu.id;
          }
        }
      }
  
      // Commit transaksi
      await transaction.commit();
      return { message: 'Access updated successfully' };
    } catch (error) {
      // Rollback transaksi jika ada error
      await transaction.rollback();
      throw error;
    }
  }
  
  
}

module.exports = new UserlevelRepository();
