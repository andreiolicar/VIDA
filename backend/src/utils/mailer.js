const nodemailer = require("nodemailer"); // Importa a bibilioteca para envio de e-mails via SMTP
require("dotenv").config(); // Importa dotenv para as variáveis de SMTP

// Cria o transporter 
const transporter = nodemailer.createTransport({
  service: "gmail", // Provedor de SMTP
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Exporta o transporter
module.exports = transporter;