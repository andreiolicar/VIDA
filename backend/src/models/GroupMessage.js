module.exports = (sequelize, DataTypes) => {
    const GroupMessage = sequelize.define(
        'GroupMessage',
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
            senderUserId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            timestamp: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            read: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: 'GroupMessages',
            timestamps: false,
        }
    );

    GroupMessage.associate = (models) => {
        GroupMessage.belongsTo(models.Group, { foreignKey: 'groupId' });
        GroupMessage.belongsTo(models.User, { foreignKey: 'senderUserId', as: 'sender' });
    };

    return GroupMessage;
};