const AksesmenuRepository = require("../repositories/aksesmenu.repository");

class AksesmenuService {
  async getAllAksesmenu() {
    const aksesmenu = await AksesmenuRepository.getAllAksesmenu();
    if (aksesmenu.length === 0) {
      throw new Error("No aksesmenu found");
    }
    return aksesmenu;
  }

  async getAllUserlevelDatatables(req, res) {
  try {
    const { akses } = res.locals;

    if (akses.view_level !== "Y") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const result = await userlevelService.getAllUserlevelDatatables(req.query);

    result.data = result.data.map(row => ({
      ...row.get({ plain: true }),
      akses: {
        edit: akses.edit_level === "Y",
        delete: akses.delete_level === "Y"
      },
    }));

    return response.datatables(res, result);
  } catch (error) {
    console.error("Error getAllUserlevelDatatables:", error);
    return response.error(res, error.message);
  }
}


  async getAksesmenuByLevel(id_level) {
    const aksesmenu = await AksesmenuRepository.getAksesmenuByLevel(id_level);
    if (!aksesmenu || aksesmenu.length === 0) {
      throw new Error("No aksesmenu found for the given level");
    }
    return aksesmenu;
  }

  async getAksesmenuById(id) {
    const aksesmenu = await AksesmenuRepository.getAksesmenuById(id);
    if (!aksesmenu) {
      throw new Error("Aksesmenu not found");
    }
    return aksesmenu;
  }

  async createAksesmenu(aksesmenuData) {
    const requiredFields = ["id_level", "id_menu", "view_level"];
    if (!requiredFields.every(field => aksesmenuData[field])) {
      throw new Error("Semua field wajib diisi");
    }
    return await AksesmenuRepository.createAksesmenu(aksesmenuData);
  }

  async updateAksesmenu(id, aksesmenuData) {
    const aksesmenu = await AksesmenuRepository.getAksesmenuById(id);
    if (!aksesmenu) {
      throw new Error("Aksesmenu not found");
    }
    return await AksesmenuRepository.updateAksesmenu(id, aksesmenuData);
  }

  async deleteAksesmenu(id) {
    const aksesmenu = await AksesmenuRepository.getAksesmenuById(id);
    if (!aksesmenu) {
      throw new Error("Aksesmenu not found");
    }
    return await AksesmenuRepository.deleteAksesmenu(id);
  }
}

module.exports = new AksesmenuService();