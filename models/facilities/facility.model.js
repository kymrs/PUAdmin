module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define('Facility', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    include: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    exclude: {
      type: DataTypes.STRING(45),
      allowNullL: false
    }
  }, {
    tableName: 'facilities',
    timestamps: false
  });

  Facility.associate = (models) => {
    Facility.hasMany(models.PackageFacility, { foreignKey: 'facility_id' });
  };

  return Facility;
}