const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API Express',
      version: '1.0.0',
      description: 'Documentação gerada automaticamente com Swagger',
    },
    servers: [
      {
        url: 'http://localhost:5000', // certifique-se da porta correta
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
  },
  apis: ['./src/routes/*.js'], // <- ESSA LINHA É CRUCIAL!
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = function (app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
