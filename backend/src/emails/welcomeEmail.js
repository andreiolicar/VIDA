// Importa o objeto transporter que foi configurado com nodemailer 
const transporter = require("../utils/mailer");

// Define uma função assíncrona que recebe name e e-mail
const sendWelcomeEmail = async (name, email) => {
  // Configura os campos básicos do e-mail
  const mailOptions = {
    from: '"Vida Notificações" <vida.app@gmail.com>',
    to: email,
    subject: "🎉 Bem-vindo à nossa plataforma!",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color:rgba(10, 37, 136, 0.86);">Olá, ${name}!</h2>
          <p>Obrigado por se cadastrar no <strong>VIDA</strong>! Estamos muito felizes em ter você conosco.</p>
          <p>Explore nossa plataforma e aproveite todos os recursos que preparamos especialmente para você.</p>
          <p style="margin-top: 20px;">Qualquer dúvida, estamos à disposição.</p>
          <p>Abraços,<br><strong>Equipe VIDA</strong></p>
      </div>
    `,
  };

  // Chama a função do nodemailer para enviar 
  return transporter.sendMail(mailOptions);
};

// Exporta a função
module.exports = sendWelcomeEmail;
