const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.StudyRoute = require('./StudyRoute')(sequelize, Sequelize.DataTypes);
db.StudyTopic = require('./StudyTopics')(sequelize, Sequelize.DataTypes);
db.Event = require('./Event')(sequelize, Sequelize.DataTypes);

db.Task = require('./Task')(sequelize, Sequelize.DataTypes);
db.TaskList = require('./TaskList')(sequelize, Sequelize.DataTypes);
db.TaskAttachment = require('./TaskAttachment')(sequelize, Sequelize.DataTypes);
db.TaskReminder = require('./TaskReminder')(sequelize, Sequelize.DataTypes);
db.TaskCollaborator = require('./TaskCollaborator')(sequelize, Sequelize.DataTypes);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

if (db.User.associate) db.User.associate(db);
if (db.StudyRoute.associate) db.StudyRoute.associate(db);
if (db.StudyTopic.associate) db.StudyTopic.associate(db);
if (db.Event.associate) db.Event.associate(db);

if (db.Task.associate) db.Task.associate(db);
if (db.TaskList.associate) db.TaskList.associate(db);
if (db.TaskAttachment.associate) db.TaskAttachment.associate(db);
if (db.TaskReminder.associate) db.TaskReminder.associate(db);
if (db.TaskCollaborator.associate) db.TaskCollaborator.associate(db);

module.exports = db;