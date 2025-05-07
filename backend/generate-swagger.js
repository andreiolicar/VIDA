// generate-swagger.js
const fs = require('fs');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentação da API - Trilha de Estudos',
      version: '1.0.0',
      description: 'API para criação e gerenciamento de trilhas de estudos com autenticação JWT.',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // <-- Caminho para suas rotas com Swagger anotado
};

const swaggerSpec = swaggerJSDoc(options);

// Salva no arquivo swagger.json
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log('✅ Arquivo swagger.json gerado com sucesso!');
