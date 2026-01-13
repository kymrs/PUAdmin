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
    icon: {
      type: DataTypes.STRING(45),
      allowNull: true
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