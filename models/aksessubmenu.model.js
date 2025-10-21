module.exports = (sequelize, DataTypes) => {
    const Aksessubmenu = sequelize.define("Aksessubmenu", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_level: {
        type: DataTypes.INTEGER
      },
      id_submenu: {
        type: DataTypes.INTEGER
      },
      view_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
      },
      add_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
      },
      edit_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
      },
      delete_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
      },
      print_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
      },
      upload_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
      }
    },
    {
      tableName: "tbl_akses_submenu", // 👈 Tambahkan ini agar Sequelize pakai nama tabel yang benar
      timestamps: false // Hapus jika pakai createdAt & updatedAt
    });

    Aksessubmenu.associate = (models) => {
      Aksessubmenu.belongsTo(models.Userlevel, { foreignKey: 'id_level' });
      Aksessubmenu.belongsTo(models.Submenu, { foreignKey: 'id_submenu' });
    };
    
  
    return Aksessubmenu;
  };
  