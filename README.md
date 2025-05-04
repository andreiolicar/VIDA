# V.I.D.A. - Vetor Inteligente de Decisão Assistida

> V.I.D.A. é um sistema inteligente de auto-organização assistida, com IA para otimizar decisões rotineiras em áreas como finanças, saúde, estudos e tarefas diárias.

<p align="center">
  <img width="200"  src ="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg" alt="VIDA Logo">
</p>

<p align="center">
  <a href="https://github.com/andreiolicar/VIDA/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/andreiolicar/VIDA?color=0FC2C0&logo=github&style=flat-square" alt="GitHub Contributors">
  </a>
  <a href="https://github.com/andreiolicar/VIDA/stargazers">
    <img src="https://img.shields.io/github/stars/andreiolicar/VIDA?color=0FC2C0&logo=github&style=flat-square" alt="GitHub Stars">
  </a>
  <a href="https://github.com/andreiolicar/VIDA/network/members">
    <img src="https://img.shields.io/github/forks/andreiolicar/VIDA?color=0FC2C0&logo=github&style=flat-square" alt="GitHub Forks">
  </a>
</p>

## Visão Geral do Projeto

Este repositório contém o código-fonte e a documentação técnica do projeto **V.I.D.A. (Vetor Inteligente de Decisão Assistida)**, desenvolvido em parceria com a empresa Venturus. O V.I.D.A. é um sistema de auto-organização assistida que ajuda usuários a gerenciar diferentes áreas da vida por meio de inteligência artificial, automatizando decisões rotineiras e fornecendo sugestões personalizadas.

Você encontrará aqui:

- Backend desenvolvido com Node.js, Express e MySQL  
- Frontend construído com React e Tailwind CSS  
- Lógica de IA aplicada para automação de tarefas e microdecisões personalizadas  
- Estrutura modular abrangendo gestão financeira, estudos, saúde física e mental, e organização de tarefas diárias


---

## Funcionalidades Principais

-  **Gestão Financeira:** Cadastro e análise de receitas/despesas, com sugestões automáticas de economia.
-  **Planejamento de Estudos:** Criação de rotinas e metas personalizadas para os estudos.
-  **Acompanhamento de Saúde:** Sugestões de bem-estar físico e mental com base nas preferências e metas do usuário.
-  **Organização de Tarefas:** Listas de tarefas com sugestões automatizadas baseadas no comportamento.
-  **IA de Decisão Assistida:** Algoritmo inteligente para apoiar microdecisões rotineiras.

---

##  Estrutura do Projeto

```
📦 vida/
 ┣ 📂 backend/         → API REST (Node.js, Express, MySQL)
 ┣ 📂 frontend/        → Interface (React, Tailwind CSS)
 ┣ 📂 database/        → Scripts SQL (criação e inserção de dados)
 ┣ 📂 docs/            → Documentação técnica e de arquitetura
 ┗ 📄 README.md        → Documentação principal do projeto
```

---

## Como Executar o Projeto

### Backend

```bash
# Configure o arquivo .env DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET e OPENAI_API_KEY
cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

### Frontend

```bash
# Configure o arquivo .env com: VITE_API_URL=http://localhost:5000/api
cd frontend
npm install
npm run dev
```

---

## Stack de Tecnologias

### Backend

[![Node.js](https://img.shields.io/badge/Node.js-0FC2C0?style=for-the-badge&logo=node.js&logoColor=0D1117)](https://nodejs.org/)
&nbsp;
[![Express.js](https://img.shields.io/badge/Express.js-0FC2C0?style=for-the-badge&logo=express&logoColor=0D1117)](https://expressjs.com/)
&nbsp;
[![MySQL](https://img.shields.io/badge/MySQL-0FC2C0?style=for-the-badge&logo=mysql&logoColor=0D1117)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-0FC2C0?style=for-the-badge&logo=jsonwebtokens&logoColor=0D1117)](https://jwt.io/)
&nbsp;
[![Swagger](https://img.shields.io/badge/Swagger-0FC2C0?style=for-the-badge&logo=swagger&logoColor=0D1117)](https://swagger.io/)
&nbsp;
[![Jest](https://img.shields.io/badge/Jest-0FC2C0?style=for-the-badge&logo=jest&logoColor=0D1117)](https://jestjs.io/)
&nbsp;
[![Supertest](https://img.shields.io/badge/Supertest-0FC2C0?style=for-the-badge&logoColor=white&color=0FC2C0)](https://github.com/visionmedia/supertest)
&nbsp;


### Frontend

[![JavaScript](https://img.shields.io/badge/JavaScript-0FC2C0?style=for-the-badge&logo=javascript&logoColor=0D1117)](https://www.javascript.com/)
&nbsp;
[![React](https://img.shields.io/badge/React-0FC2C0?style=for-the-badge&logo=react&logoColor=0D1117)](https://reactjs.org/)
&nbsp;
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0FC2C0?style=for-the-badge&logo=tailwindcss&logoColor=0D1117)](https://tailwindcss.com/)
&nbsp;
[![React Router Dom](https://img.shields.io/badge/React_Router_Dom-0FC2C0?style=for-the-badge&logo=reactrouter&logoColor=0D1117)](https://reactrouter.com/)
&nbsp;
[![Webpack](https://img.shields.io/badge/Webpack-0FC2C0?style=for-the-badge&logo=webpack&logoColor=0D1117)](https://webpack.js.org/)
&nbsp;
[![Vite](https://img.shields.io/badge/Vite-0FC2C0?style=for-the-badge&logo=vite&logoColor=0D1117)](https://vitejs.dev/)
&nbsp;
[![Jest](https://img.shields.io/badge/Jest-0FC2C0?style=for-the-badge&logo=jest&logoColor=0D1117)](https://jestjs.io/)
&nbsp;
[![React Testing Library](https://img.shields.io/badge/React_Testing_Library-0FC2C0?style=for-the-badge&logoColor=white&color=0FC2C0)](https://testing-library.com/docs/react-testing-library/intro/)
&nbsp;
[![Axios](https://img.shields.io/badge/Axios-0FC2C0?style=for-the-badge&logo=axios&logoColor=0D1117)](https://axios-http.com/)
&nbsp;
[![Fetch API](https://img.shields.io/badge/Fetch_API-0FC2C0?style=for-the-badge&logoColor=white&color=0FC2C0)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
&nbsp;

### Utilitários

[![npm](https://img.shields.io/badge/npm-0FC2C0?style=for-the-badge&logo=npm&logoColor=0D1117)](https://www.npmjs.com/)
&nbsp;
[![Yarn](https://img.shields.io/badge/Yarn-0FC2C0?style=for-the-badge&logo=yarn&logoColor=0D1117)](https://yarnpkg.com/)
&nbsp;
[![dotenv](https://img.shields.io/badge/dotenv-0FC2C0?style=for-the-badge&logo=dotenv&logoColor=0D1117)](https://github.com/motdotla/dotenv)
&nbsp;
[![ESLint](https://img.shields.io/badge/ESLint-0FC2C0?style=for-the-badge&logo=eslint&logoColor=0D1117)](https://eslint.org/)
&nbsp;
[![Prettier](https://img.shields.io/badge/Prettier-0FC2C0?style=for-the-badge&logo=prettier&logoColor=0D1117)](https://prettier.io/)
&nbsp;

---

## Documentação Técnica

A pasta [`/docs`](./docs) contém:

- Especificação completa da API (via Swagger)
- Diagrama DER do banco MySQL
- Estrutura de arquivos do sistema
- Fluxograma de funcionamento
- Protótipos das telas

---

## Contribuidores

<div align="center">

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/andreiolicar">
        <img src="https://avatars.githubusercontent.com/u/166918480?v=4" width="100px;" alt="Andrei"/><br />
        <b>Andrei</b><br />
        <sub>Backend, Infra</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/joaoxaviersilva">
        <img src="https://avatars.githubusercontent.com/u/96438479?v=4" width="100px;" alt="João"/><br />
        <b>João</b><br />
        <sub>Frontend, Testes</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/nsmillena">
        <img src="https://avatars.githubusercontent.com/u/120488775?v=4" width="100px;" alt="Millena"/><br />
        <b>Millena</b><br />
        <sub>Design, Documentação</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/sofismoura">
        <img src="https://avatars.githubusercontent.com/u/146744026?v=4" width="100px;" alt="Sofia"/><br />
        <b>Sofia</b><br />
        <sub>Fullstack, IA</sub>
      </a>
    </td>
  </tr>
</table>
</div>

---

## Apoie o Projeto

Este README fornece uma visão geral do projeto V.I.D.A. e sua estrutura. Para detalhes específicos sobre cada módulo e funcionalidade, consulte a documentação dentro das pastas correspondentes. Se você curtiu, deixe uma ⭐ estrela no repositório para mostrar seu apoio!

---

