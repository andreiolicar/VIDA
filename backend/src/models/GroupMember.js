module.exports = (sequelize, DataTypes) => {
    const GroupMember = sequelize.define(
        'GroupMember',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            groupId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('owner', 'admin', 'member'),
                allowNull: false,
                defaultValue: 'member',
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
            tableName: 'GroupMembers',
            timestamps: false,
        }
    );

    GroupMember.associate = (models) => {
        GroupMember.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
        GroupMember.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return GroupMember;
};
