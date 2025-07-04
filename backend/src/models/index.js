// backend/src/models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};


db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.StudyRoute = require('./StudyRoute')(sequelize, Sequelize.DataTypes);
db.StudyTopic = require('./StudyTopics')(sequelize, Sequelize.DataTypes);
db.Event = require('./Event')(sequelize, Sequelize.DataTypes);

db.Task = require('./task')(sequelize, Sequelize.DataTypes);
db.Subtask = require('./subtask')(sequelize, Sequelize.DataTypes);
db.TaskList = require('./TaskList')(sequelize, Sequelize.DataTypes);
db.TaskAttachment = require('./TaskAttachment')(sequelize, Sequelize.DataTypes);
db.TaskReminder = require('./TaskReminder')(sequelize, Sequelize.DataTypes);
db.TaskCollaborator = require('./TaskCollaborator')(sequelize, Sequelize.DataTypes);

db.ChatSession = require('./chatSession')(sequelize, Sequelize.DataTypes);

db.Transaction = require('./transaction')(sequelize, Sequelize.DataTypes);
db.TransactionAttachment = require('./transactionAttachment')(sequelize, Sequelize.DataTypes);
db.TransactionHistory = require('./transactionHistory')(sequelize, Sequelize.DataTypes);

db.FinancialGoal = require('./financialGoal')(sequelize, Sequelize.DataTypes);
db.FinancialGoalHistory = require('./FinancialGoalHistory')(sequelize, Sequelize.DataTypes);

db.VidaScore = require('./vidaScore')(sequelize, Sequelize.DataTypes);
db.Alert = require('./alert')(sequelize, Sequelize.DataTypes);
db.VidaScoreHistory = require('./vidaScoreHistory')(sequelize, Sequelize.DataTypes);

db.Friend = require('./friend')(sequelize, Sequelize.DataTypes);
db.FriendRequest = require('./friendRequest')(sequelize, Sequelize.DataTypes);

db.PrivateMessage = require('./privateMessage')(sequelize, Sequelize.DataTypes);

db.Group = require('./Group')(sequelize, Sequelize.DataTypes);
db.GroupMember = require('./GroupMember')(sequelize, Sequelize.DataTypes);
db.GroupMessage = require('./GroupMessage')(sequelize, Sequelize.DataTypes);

db.PasswordReset = require('./PasswordReset')(sequelize, Sequelize.DataTypes);


db.Appointment = require('./appointment')(sequelize, Sequelize.DataTypes);
db.Health = require('./Health')(sequelize, Sequelize.DataTypes);
db.MoodCheckin = require('./moodcheckin')(sequelize, Sequelize.DataTypes);
db.WellnessHabit = require('./wellnesshabit')(sequelize, Sequelize.DataTypes);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ASSOCIAÇÕES
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
if (db.FinancialGoalHistory.associate) db.FinancialGoalHistory.associate(db);

if (db.VidaScore.associate) db.VidaScore.associate(db);
if (db.Alert.associate) db.Alert.associate(db);
if (db.VidaScoreHistory.associate) db.VidaScoreHistory.associate(db);

if (db.Friend.associate) db.Friend.associate(db);
if (db.FriendRequest.associate) db.FriendRequest.associate(db);

if (db.PrivateMessage.associate) db.PrivateMessage.associate(db);

if (db.Group.associate) db.Group.associate(db);
if (db.GroupMember.associate) db.GroupMember.associate(db);
if (db.GroupMessage.associate) db.GroupMessage.associate(db);

if (db.PasswordReset.associate) db.PasswordReset.associate(db);


if (db.Appointment.associate) db.Appointment.associate(db);
if (db.MoodCheckin.associate) db.MoodCheckin.associate(db);
if (db.WellnessHabit.associate) db.WellnessHabit.associate(db);

module.exports = db;
