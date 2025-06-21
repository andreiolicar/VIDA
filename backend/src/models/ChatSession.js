module.exports = (sequelize, DataTypes) => {
    const ChatSession = sequelize.define('ChatSession', {
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        area: DataTypes.STRING,
        topics: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('topics');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('topics', JSON.stringify(value));
            },
        },
        messages: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('messages');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('messages', JSON.stringify(value));
            },
        },
        userId: DataTypes.INTEGER,
    });

    ChatSession.associate = (models) => {
        ChatSession.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return ChatSession;
};