module.exports = (sequelize, DataTypes) => {
    const DepartureDetail = sequelize.define('DepartureDetail', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        package_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'umrah_packages',
                key: 'id',
            },
        },
        departure_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        departure_location: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        group_quota: {
            type: DataTypes.INTEGER,
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
        tableName: 'departure_details',
        timestamps: true,
        createdAt: true,
        updatedAt: true,
    });

    DepartureDetail.associate = (models) => {
        DepartureDetail.belongsTo(models.UmrahPackage, { foreignKey: 'package_id' });
    };

    return DepartureDetail;
}