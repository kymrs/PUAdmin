module.exports = (sequelize, DataTypes) => {
    const Aksessubmenu = sequelize.define("Aksessubmenu", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
      },
      id_level: {
        type: DataTypes.INTEGER,
        field:'id_level'
      },
      id_menu: {
        type: DataTypes.INTEGER,
        field: 'id_menu'
      },
      view_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
        field: "view_level"
      },
      add_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
        field: "add_level"
      },
      edit_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
        field: "edit_level"
      },
      delete_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
        field: "delete_level"
      },
      print_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
        field: "print_level"
      },
      upload_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
        field: "upload_level"
      }
    },
    {
      tableName: "tbl_akses_submenu", // 👈 Tambahkan ini agar Sequelize pakai nama tabel yang benar
      timestamps: false // Hapus jika pakai createdAt & updatedAt
    });

    Aksessubmenu.associate = (models) => {
      Aksessubmenu.belongsTo(models.Userlevel, { foreignKey: 'id_level' });
      Aksessubmenu.belongsTo(models.Submenu, { foreignKey: 'id_menu' });
    };
    
  
    return Aksessubmenu;
  };
  