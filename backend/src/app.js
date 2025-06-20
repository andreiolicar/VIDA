const express = require('express');
const cors = require('cors');
const path = require('path'); 
const eventsRoutes = require('./routes/events.routes');
const swaggerConfig = require("./swagger");
const chatSessionRoutes = require('./routes/chatSession.routes');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
swaggerConfig(app); 

// Rotas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/study-routes', require('./routes/studyRoutes'));
app.use('/api/events', eventsRoutes);

app.use('/api/tasks', require('./routes/tasks.routes'));
app.use('/api/subtasks', require('./routes/subtasks.routes'));
app.use('/api/task-reminders', require('./routes/taskReminders.routes'));
app.use('/api/task-lists', require('./routes/taskLists.routes'));
app.use('/api/task-collaborators', require('./routes/taskCollaborators.routes'));
app.use('/api/task-attachments', require('./routes/taskAttachments.routes'));
app.use('/api/ia', require('./routes/ia.routes'));

app.use('/api/finance', require('./routes/finance.routes'));

app.use('/api/chat-sessions', chatSessionRoutes);

module.exports = app;
