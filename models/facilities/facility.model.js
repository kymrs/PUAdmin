module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define('Facility', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    tableName: 'facilities',
    timestamps: false
  });

  Facility.associate = (models) => {
    Facility.hasMany(models.PackageFacility, { foreignKey: 'facility_id' });
  };

  return Facility;
}