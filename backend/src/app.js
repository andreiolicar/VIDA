const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerConfig = require("./swagger");

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
swaggerConfig(app);


app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/study-routes', require('./routes/studyRoutes'));
app.use('/api/events', require('./routes/events.routes'));
app.use('/api/tasks', require('./routes/tasks.routes'));
app.use('/api/subtasks', require('./routes/subtasks.routes'));
app.use('/api/task-reminders', require('./routes/taskReminders.routes'));
app.use('/api/task-lists', require('./routes/taskLists.routes'));
app.use('/api/task-collaborators', require('./routes/taskCollaborators.routes'));
app.use('/api/task-attachments', require('./routes/taskAttachments.routes'));
app.use('/api/ia', require('./routes/ia.routes'));
app.use('/api/finance', require('./routes/finance.routes'));
app.use('/api/chat-sessions', require('./routes/chatSession.routes'));
app.use('/api/friends', require('./routes/friends.routes'));
app.use('/api/messages', require('./routes/messages.routes'));
app.use('/api/groups', require('./routes/groups.routes'));
app.use('/api/health', require('./routes/health'));

module.exports = app;
