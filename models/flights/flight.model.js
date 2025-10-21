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
        flight_number: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        departure_airport: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        arrival_airport: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        departure_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        arrival_time: {
            type: DataTypes.DATE,
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