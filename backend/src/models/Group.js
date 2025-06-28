module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define(
        'Group',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ownerUserId: {
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
        },
        {
            tableName: 'Groups',
            timestamps: false, // Usamos campos explícitos createdAt e updatedAt
        }
    );

    Group.associate = (models) => {
        Group.belongsTo(models.User, { foreignKey: 'ownerUserId', as: 'owner' });
        Group.hasMany(models.GroupMember, { foreignKey: 'groupId', as: 'members' });
        Group.hasMany(models.GroupMessage, { foreignKey: 'groupId', as: 'messages' });
    };

    return Group;
};