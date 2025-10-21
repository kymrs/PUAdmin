module.exports = (sequelize, DataTypes) => {
    const TravelReviews = sequelize.define("TravelReviews", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      travel_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      tableName: "travel_reviews",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });
  
    TravelReviews.associate = (models) => {
      TravelReviews.belongsTo(models.Travel, { foreignKey: 'travel_id', as: 'travel' });
   };

    return TravelReviews;
};
