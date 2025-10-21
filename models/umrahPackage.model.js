const { created } = require("../utils/response");

module.exports = (sequelize, DataTypes) => {
    const UmrahPackage = sequelize.define('UmrahPackage', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        travel_agency_id: { // FIX typo: travel_agnecy_id ➜ travel_agency_id
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        package_type: {
            type: DataTypes.ENUM('double', 'triple', 'quad'), // FIX: ENUM instead of DECIMAL
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        duration_days: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'umrah_packages',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    // Relasi bisa didefinisikan di associate (jika menggunakan setup ini)
    UmrahPackage.associate = models => {
        UmrahPackage.belongsTo(models.Travel, {
            foreignKey: 'travel_agency_id',
            as: 'agency',
        });
        UmrahPackage.hasMany(models.PackageFlight, {
            foreignKey: 'package_id',
            as: 'flights',
        });
        UmrahPackage.hasMany(models.PackageFacility, {
            foreignKey: 'package_id',
            as: 'facilities',
        });
        UmrahPackage.hasMany(models.DepartureDetail, {
            foreignKey: 'package_id',
            as: 'departureDetails',
        });
    };

    return UmrahPackage;
};
