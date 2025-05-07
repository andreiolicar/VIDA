const express = require('express');
const cors = require('cors');
const eventsRoutes = require('./routes/events.routes');
const swaggerConfig = require("./swagger");

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(swaggerConfig);

// Rotas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/study-routes', require('./routes/studyRoutes'));
app.use('/api/events', eventsRoutes);
app.use('/api/ia', require('./routes/ia.routes'));

module.exports = app;
