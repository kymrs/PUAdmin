module.exports = ( sequelize, DataTypes) => {
    const Akses = sequelize.define("Akses", {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_level:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        id_menu:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        view_level:{
            type: DataTypes.ENUM('Y', 'N'),
            allowNull: true,
            defaultValue: "N"
        },
        add_level:{
            type: DataTypes.ENUM('Y', 'N'),
            allowNull: true,
            defaultValue: "N"
        },
        edit_level:{
            type: DataTypes.ENUM('Y', 'N'),
            allowNull: true,
            defaultValue: "N"
        },
        delete_level:{
            type: DataTypes.ENUM('Y', 'N'),
            allowNull: true,
            defaultValue: "N"
        },
        print_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
        defaultValue: "N"
      },
      upload_level: {
        type: DataTypes.ENUM('Y', 'N'),
        allowNull: true,
        defaultValue: "N"
      }
    },
    {
        tableName: "tbl_akses", // 👈 Tambahkan ini agar Sequelize pakai nama tabel yang benar
        timestamps: false // Hapus jika pakai createdAt & updatedAt
    });

    Akses.associate = (models) => {
        Akses.belongsTo(models.Menu, {
            foreignKey: 'id_menu',
            targetKey: 'id_menu'
        });
        // Akses.belongsTo(models.userlevel, {
        //     foreignKey: 'id_level'
        // })
    };

    return Akses;
}