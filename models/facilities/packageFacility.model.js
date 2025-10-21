module.exports = (sequelize, DataTypes) => {
    const PackageFacility = sequelize.define('PackageFacility', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        package_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        facility: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('termasuk', 'tidak_termasuk'),
            allowNull: false,
        },
    }, {
        tableName: 'package_facilities',
        timestamps: false
    });

    PackageFacility.associate = (models) => {
        PackageFacility.belongsTo(models.UmrahPackage, { foreignKey: 'package_id' });
    }

    return PackageFacility;
}