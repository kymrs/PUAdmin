module.exports = (sequelize, DataTypes) => {
    const packageFlight = sequelize.define('PackageFlight', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        package_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'umrah_packages', // Ensure this matches the actual package model name
                key: 'id'
            }
        },
        flight_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'flights',
                key: 'id'
            }
        },
        flight_type: {
            type: DataTypes.STRING(50),
            allowNull: false, // e.g., "one-way", "round-trip"
        }
    }, {
        tableName: 'package_flights',
        timestamps: true,
        createdAt: true,
        updatedAt: true
    });
    packageFlight.associate = (models) => {
        packageFlight.belongsTo(models.UmrahPackage, { foreignKey: 'package_id' });
        packageFlight.belongsTo(models.Flight, { foreignKey: 'flight_id' });
    };
    return packageFlight;
}