module.exports = (sequelize, DataTypes) => {
    const GalleryCategory = sequelize.define('GalleryCategory', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
    }, {
      tableName: 'gallery_categories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });

    GalleryCategory.associate = (models) => {
      GalleryCategory.hasMany(models.Gallery, { foreignKey: 'category_id', as: 'galleries' });
    };
  
    return GalleryCategory;
  };
  