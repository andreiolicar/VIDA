const http = require('http');
const app = require('./app');
const { sequelize } = require('./models');
const socket = require('./socket');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao MySQL com Sequelize');

    await sequelize.sync();

    // Criar servidor HTTP com o express app
    const server = http.createServer(app);

    // Inicializar Socket.IO com o servidor HTTP via módulo socket.js
    const io = socket.init(server);

    // Iniciar o servidor HTTP (com Socket.IO integrado)
    server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error.message);
    console.error(error.stack);
  }
}

start();