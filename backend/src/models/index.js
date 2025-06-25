const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.StudyRoute = require('./StudyRoute')(sequelize, Sequelize.DataTypes);
db.StudyTopic = require('./StudyTopics')(sequelize, Sequelize.DataTypes);
db.Event = require('./Event')(sequelize, Sequelize.DataTypes);

db.Task = require('./Task')(sequelize, Sequelize.DataTypes);
db.Subtask = require('./Subtask')(sequelize, Sequelize.DataTypes);
db.TaskList = require('./TaskList')(sequelize, Sequelize.DataTypes);
db.TaskAttachment = require('./TaskAttachment')(sequelize, Sequelize.DataTypes);
db.TaskReminder = require('./TaskReminder')(sequelize, Sequelize.DataTypes);
db.TaskCollaborator = require('./TaskCollaborator')(sequelize, Sequelize.DataTypes);

db.ChatSession = require('./ChatSession')(sequelize, Sequelize.DataTypes);

db.Transaction = require('./Transaction')(sequelize, Sequelize.DataTypes);
db.TransactionAttachment = require('./TransactionAttachment')(sequelize, Sequelize.DataTypes); 
db.TransactionHistory = require('./TransactionHistory')(sequelize, Sequelize.DataTypes);        

db.FinancialGoal = require('./FinancialGoal')(sequelize, Sequelize.DataTypes);
db.VidaScore = require('./VidaScore')(sequelize, Sequelize.DataTypes);
db.Alert = require('./Alert')(sequelize, Sequelize.DataTypes);
db.VidaScoreHistory = require('./VidaScoreHistory')(sequelize, Sequelize.DataTypes);

db.Friend = require('./Friend')(sequelize, Sequelize.DataTypes);
db.FriendRequest = require('./FriendRequest')(sequelize, Sequelize.DataTypes);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

if (db.User.associate) db.User.associate(db);
if (db.StudyRoute.associate) db.StudyRoute.associate(db);
if (db.StudyTopic.associate) db.StudyTopic.associate(db);
if (db.Event.associate) db.Event.associate(db);

if (db.Task.associate) db.Task.associate(db);
if (db.Subtask.associate) db.Subtask.associate(db);
if (db.TaskList.associate) db.TaskList.associate(db);
if (db.TaskAttachment.associate) db.TaskAttachment.associate(db);
if (db.TaskReminder.associate) db.TaskReminder.associate(db);
if (db.TaskCollaborator.associate) db.TaskCollaborator.associate(db);

if (db.ChatSession.associate) db.ChatSession.associate(db);

if (db.Transaction.associate) db.Transaction.associate(db);
if (db.TransactionAttachment.associate) db.TransactionAttachment.associate(db);
if (db.TransactionHistory.associate) db.TransactionHistory.associate(db);

if (db.FinancialGoal.associate) db.FinancialGoal.associate(db);
if (db.VidaScore.associate) db.VidaScore.associate(db);
if (db.Alert.associate) db.Alert.associate(db);
if (db.VidaScoreHistory.associate) db.VidaScoreHistory.associate(db);

if (db.Friend.associate) db.Friend.associate(db);
if (db.FriendRequest.associate) db.FriendRequest.associate(db);

module.exports = db;