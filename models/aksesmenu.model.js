module.exports = (sequelize, DataTypes) => {
    const Aksesmenu = sequelize.define("Aksesmenu", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_level: {
        type: DataTypes.INTEGER
      },
      id_menu: {
        type: DataTypes.INTEGER
      },
      view_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
      }
    },
    {
      tableName: "tbl_akses_menu", // 👈 Tambahkan ini agar Sequelize pakai nama tabel yang benar
      timestamps: false // Hapus jika pakai createdAt & updatedAt
    });

    Aksesmenu.associate = (models) => {
      Aksesmenu.belongsTo(models.Userlevel, { foreignKey: 'id_level' });
      Aksesmenu.belongsTo(models.Menu, { foreignKey: 'id_menu' });
    };
    
  
    return Aksesmenu;
  };
  