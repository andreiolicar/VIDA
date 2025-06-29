module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'users',
        timestamps: true,
    });

    User.associate = (models) => {
        User.hasMany(models.StudyRoute, { foreignKey: 'userId', as: 'routes' });

        // Associações para Groups
        User.hasMany(models.Group, { foreignKey: 'ownerUserId', as: 'ownedGroups' });
        User.hasMany(models.GroupMember, { foreignKey: 'userId', as: 'groupMemberships' });
        User.hasMany(models.GroupMessage, { foreignKey: 'senderUserId', as: 'sentMessages' });
    };

    return User;
};
