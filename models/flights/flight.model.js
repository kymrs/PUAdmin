module.exports = (sequelize, DataTypes) => {
    const flight = sequelize.define('Flight', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        airline: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'flights',
        timestamps: true,
        createdAt: true,
        updatedAt: true,
    });
    flight.associate = (models) => {
        flight.hasMany(models.PackageFlight, { foreignKey: 'flight_id' });
    };
    return flight;
}