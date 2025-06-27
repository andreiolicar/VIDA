<div align="center">
<img src="frontend/src/assets/azul-vida.png" alt="VIDA logo" width="250px">
</div>

# VIDA - Vetor Inteligente de Decisão Assistida

> VIDA é um sistema inteligente de auto-organização assistida, com IA para otimizar decisões rotineiras em áreas como finanças, saúde, estudos e tarefas diárias.


## Visão Geral do Projeto

Este repositório contém o código-fonte e a documentação técnica do projeto **V.I.D.A. (Vetor Inteligente de Decisão Assistida)**, desenvolvido em parceria com a empresa Venturus. O V.I.D.A. é um sistema de auto-organização assistida que ajuda usuários a gerenciar diferentes áreas da vida por meio de inteligência artificial, automatizando decisões rotineiras e fornecendo sugestões personalizadas.

---

## Funcionalidades Principais

-  **Gestão Financeira:** Cadastro e análise de receitas/despesas, com sugestões automáticas de economia.
-  **Planejamento de Estudos:** Criação de rotinas e metas personalizadas para os estudos.
-  **Organização de Tarefas:** Listas de tarefas com sugestões automatizadas baseadas no comportamento.
-  **IA de Decisão Assistida:** Algoritmo inteligente para apoiar microdecisões rotineiras.

---

##  Estrutura do Projeto

```
📦 vida/
 ┣ 📂 backend/         → API REST (Node.js, Express, MySQL, Documentação via Swagger)
 ┣ 📂 frontend/        → Interface (React, Tailwind CSS)
 ┣ 📂 docs/            → Documentação (Requisições para o Insomnia/Postman)
 ┗ 📄 README.md        → Documentação principal do projeto

```

---

## ▶️ Como Executar o Projeto

> Antes de começar, verifique se você tem instalado: **Node.js**, **MySQL** e **npm**.

### 1. Clone o repositório

```bash
git clone https://github.com/andreiolicar/VIDA.git
cd VIDA
```

### 2. Configure o Banco de Dados

- Crie um banco no MySQL Shell com o nome `vida_db`

```env
CREATE DATABASE vida_db;
CREATE USER 'vida_user'@'localhost' IDENTIFIED BY 'Vida2025@api';
GRANT ALL PRIVILEGES ON vida_db.* TO 'vida_user'@'localhost';
FLUSH PRIVILEGES;

```

- Configure o `.env` no backend com suas credenciais:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=vida_user
DB_PASSWORD=Vida2025@api
DB_NAME=vida_db

JWT_SECRET=4671ba8aedd063483b3f8a2ee15b75d2939f7852a4fe23dd07919e9e8a2c4df473d162e4c541032fa3b83d520991963b5b1b02b5025f5d3e93858880dd230d77

SMTP_USER=api.vida.app@gmail.com
SMTP_PASS=cjgr ozmc qrhn lcaq

GEMINI_API_KEY=AIzaSyBFLvf5vUfDFj7IN8531Xq3Ikf2tbY_40I

```
- Configure o `.env` no frontend com suas credenciais:

```env
VITE_API_URL=http://localhost:5000/api

```


### 3. Instale as dependências

#### Raiz
```bash
npm run install-all
```

### 4. Rode as Migrations e Seeders

```bash
npm run setup
```

### 5. Rode o Swagger UI (Documentação)

```bash
cd ..
cd backend
npm install swagger-ui-express swagger-jsdoc
```

### 6. Inicie os servidores

#### Raiz
```bash
cd ..
npm run dev
```

> Acesse a aplicação em: `http://localhost:5173`

#### Documentação Swagger
```bash
cd ..
cd backend
node src/server.js
```


> Acesse a aplicação em: `http://localhost:5000/api-docs`


---


## 🚀 Stack de Tecnologias

### 🛠️ Backend

<br>


![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) – Escolhido pela sua simplicidade e flexibilidade na criação de APIs RESTful com Node.js.

![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white) – Utilizado por sua robustez, ampla adoção e fácil modelagem de dados relacionais.

![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white) – Adotado para facilitar o mapeamento objeto-relacional, evitando SQL manual e acelerando o desenvolvimento.

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) – Implementado como uma solução moderna e stateless para autenticação segura entre frontend e backend.

![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) – Integrado ao projeto para garantir documentação automática e facilitar testes e integração de rotas.

![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white) – Usado por sua confiabilidade e cobertura robusta de testes em aplicações Node.js.

![Supertest](https://img.shields.io/badge/Supertest-333?style=for-the-badge) – Incluído para testar rotas HTTP de forma prática, garantindo que o backend responde como esperado.

<br>

### 🎨 Frontend

<br>

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) – Base da web moderna, essencial para criar interfaces dinâmicas e interativas.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) – Escolhido por sua abordagem declarativa e foco em componentes reutilizáveis, facilitando a escalabilidade da UI.

![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) – Optamos por ele devido à agilidade que oferece na estilização com classes utilitárias e design responsivo.

![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) – Adicionado para gerenciar a navegação SPA com rotas dinâmicas e comportamento fluido.

![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black) – Utilizado no build final para otimizar recursos e melhorar a performance em produção.

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) – Escolhido por oferecer uma experiência de desenvolvimento extremamente rápida e moderna.

![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) – Preferido por seu suporte a interceptadores e facilidade de lidar com requisições assíncronas.

![Fetch API](https://img.shields.io/badge/Fetch-API-ffca28?style=for-the-badge) – Mantido como opção nativa leve para chamadas HTTP simples e diretas.

<br>

### 🧰 Utilitários

<br>

![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) – Utilizado como gerenciador de pacotes padrão do Node.js para instalar e manter as dependências do projeto.

![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black) – Escolhido para manter variáveis sensíveis fora do código, facilitando a configuração de ambientes.

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) – Integrado ao projeto para reforçar boas práticas de código e evitar bugs comuns.

![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)  – Adotado para manter a base de código limpa e padronizada automaticamente.

---

## Contribuidores

<div align="center">

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/andreiolicar">
        <img src="https://avatars.githubusercontent.com/u/166918480?v=4" width="100px;" alt="Andrei"/><br />
        <b>Andrei</b><br />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/joaoxaviersilva">
        <img src="https://avatars.githubusercontent.com/u/166918086?v=4" width="100px;" alt="João"/><br />
        <b>João</b><br />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/nsmillena">
        <img src="https://avatars.githubusercontent.com/u/166918300?v=4" width="100px;" alt="Millena"/><br />
        <b>Millena</b><br />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/sofismoura">
        <img src="https://avatars.githubusercontent.com/u/166918518?s=400&u=76c54fc8d9ef41bfda8dcfada372d9fba0ee8954&v=4" width="100px;" alt="Sofia"/><br />
        <b>Sofia</b><br />
      </a>
    </td>
  </tr>
</table>
</div>

---

## Apoie o Projeto

Este README fornece uma visão geral do projeto VIDA e sua estrutura. Para detalhes específicos sobre cada módulo e funcionalidade, consulte a documentação dentro das pastas correspondentes. Se você curtiu, deixe uma ⭐ estrela no repositório para mostrar seu apoio!

---

<div align="center">
<img src="frontend/src/assets/mini-azul-vida.png" alt="VIDA logo icone" width="75px">
</div>
