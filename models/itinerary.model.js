module.exports = (sequelize, DataTypes) => {
    const Itinerary = sequelize.define('Itinerary', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        package_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        day_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        activity: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        time: {
            type: DataTypes.DATE,
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
        tableName: 'itineraries',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    Itinerary.associate = (models) => {
        Itinerary.belongsTo(models.UmrahPackage, { foreignKey: 'package_id' });
    };
    return Itinerary;
}