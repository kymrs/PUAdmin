module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      tableName: 'chats',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });
  
    return Chat;
  };
  