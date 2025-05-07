const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentação Swagger da API do V.I.D.A.",
      version: "1.0.0",
      description:
        "Esta é a documentação Swagger da API do projeto V.I.D.A. (Vetor Inteligente de Decisão Assistida). Aqui você encontrará todas as rotas disponíveis, seus parâmetros, respostas e exemplos de uso.",
    },
  },
  apis: [path.join(__dirname, "/routes/*.js")],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
