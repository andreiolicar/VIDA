module.exports = (sequelize, DataTypes) => {
  const PasswordReset = sequelize.define('PasswordReset', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'password_resets',
    timestamps: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['code']
      },
      {
        fields: ['expiresAt']
      },
      {
        fields: ['userId']
      }
    ]
  });

  PasswordReset.associate = (models) => {
    PasswordReset.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return PasswordReset;
};