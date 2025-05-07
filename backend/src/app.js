const express = require('express');
const cors = require('cors');
const eventsRoutes = require('./routes/events.routes');
const swaggerConfig = require("./swagger");

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


swaggerConfig(app);  // Chama a função que adiciona a rota /api-docs

// Rotas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/study-routes', require('./routes/studyRoutes'));
app.use('/api/events', eventsRoutes);

module.exports = app;
