
const menuRepository = require("../../repositories/menu.repository");
const menuService = require("../../services/menu.service");
const response = require("../../utils/response");


class MenuController {
  async getAllMenu(req, res) {
    try {
      const menu = await menuService.getAllMenu();
      return res.status(200).json({
        success: true,
        message: "Menus fetched successfully",
        data: menu,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching menus",
        error: error.message,
      })
    }
  }

     async getPaginatedMenu(req, res){
      try{
        const {start, length, search, order, columns} = req.body;
        const result = await menuRepository.getPaginatedMenu({
          start,
          length,
          search,
          order,
          columns
        });

        return res.status(200).json({
          success: true,
          message: "Paginated menus fetched successfully",
          recordTotal: result.count,
          recordFiltered: result.count,
          data: result,
        })
      }catch (error){
        return res.status(500).json({
          success: false,
          message: "Error fetching paginated menus",
          error: error.message,
        });
      }
     }

    async getParentsController(req, res){
      try {
        const parentMenu = await menuService.getParentsMenus();

        res.json({
          success: true,
          data: parentMenu
        });

      } catch (e){
        console.error(e);
        return res.status(500).json({
          success: true,
          message: "failed to load parentMenus"
        })
      }
    }

     async getMenuById(req, res){
      try{
        const {id} = req.params.id;
        const menu = await menuRepository.getMenuById(id);

        return res.status(200).json({
          success: true,
          message: "Menu fetched successfully",
          data: menu,
        });

      } catch (error){
        return res.status(500).json({
          success: false,
          message: "Error fetching menu",
          error: error.message,
        });
      }
     }
  async getAllMenuDatatables(req, res) {
    try {
      const { akses } = res.locals;

      // console.log("akses", akses);
        
        if (akses.view_level !== 'Y') {
          return res.status(403).json({ error: "Akses ditolak" });
        }
  
        const result = await menuService.getAllMenuDatatables(req.query);
  
        result.data = result.data.map(row => ({
          ...row.get({ plain: true }),
          akses: {
            edit: akses.edit_level === 'Y',
            delete: akses.delete_level === 'Y'
          }
        }));
  
        return response.datatables(res, result);
      } catch (error) {
        console.error("Error getAllMenuDatatables:", error);
        return response.error(res, error.message);
    }
  }

  // async getMenuById(req, res) {
  //   try {
  //     const menu = await menuService.getMenuById(req.params.id);
  //     return response.success(res, "Menu fetched", menu);
  //   } catch (error) {
  //     return response.notFound(res, error.message);
  //   }
  // }

  async createMenu(req, res) {
    try {
      const menu = await menuService.createMenu(req.body);
      return res.status(200).json({
        success: true,
        message: "Menu created successfully",
        data: menu,
      });
    } catch (error) {
      console.error("Error in createMenu:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.message,
      });
      
    }
  }

  async updateMenu(req, res) {
    try {
      const {id} = req.params;
      const menu = await menuRepository.getMenuById(id);
      if (!menu) {
        return res.status(404).json({
          status: "error",
          message: "Menu tidak ditemukan",
        });
      }

      await menuRepository.updateMenu(id, req.body)

      return res.status(200).json({
        success: true,
        message: "Menu updated successfully",
      })

    } catch (error) {
      console.error("Error in updateMenu:", error);
      return res.status(404).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  }

  async deleteMenu(req, res) {
    try {

      const {id} = req.params;
   
      await menuRepository.deleteMenu(id);

      return res.status(200).json({
        success: true,
        message: "Menu deleted successfully",
      });

    } catch (error) {
      console.error("Error in deleteMenu:", error);
      return response.notFound(res, error.message);
    }
  }

  async getNestedMenu(req, res){
    try{
      const menu = await menuRepository.getAllMenu();

       // Buat map untuk lookup cepat
      const menuMap = {};
      menu.forEach(menu=> {
        menuMap[menu.id_menu] = {...menu, children:[]};
      });

      const nestedMenu = [];

      menu.forEach(menu => {
        if(menu.parent_id === null){
          nestedMenu.push(menuMap[menu.id_menu]);
        }else if(menuMap[menu.parent_id]){
          menuMap[menu.parent_id].children.push(menuMap[menu.id_menu]);
        }
      })

      return res.status(200).json({
        success: true,
        message: "menu fetched successfully",
        data: nestedMenu,
      })
    }catch (error){ 
      console.error("Error in getNestedMenu:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching nested menu",
        error: error.message,
      });
    }
  }

  async createNestedMenu(req, res){
    try{
      const newMenu = await menuService.createNestedMenu(req.body);
      return res.status(201).json({
        success: true,
        message: "Nested menu created successfully",
        data: newMenu,
      })
    }catch (error){
      console.error("Error in createNestedMenu:", error);
      return res.status(400).json({
        success: false,
        message: "Error creating nested menu",
        error: error.message,
      });
    }
  }

  
}

module.exports = new MenuController();