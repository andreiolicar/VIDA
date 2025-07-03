const transporter = require("../utils/mailer");

const sendHealthPlanCreatedEmail = async (name, email, title, description) => {
  const mailOptions = {
    from: '"Vida Notificações" <vida.app@gmail.com>',
    to: email,
    subject: "🎉 Seu plano de saúde mental foi criado!",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #102a7d;">Olá, ${name}!</h2>
          <p>Seu novo plano de saúde mental e bem-estar foi criado com sucesso.</p>
          <p><strong>Título:</strong> ${title}</p>
          <p><strong>Descrição:</strong> ${description}</p>
          <p>Confira as etapas e recomendações para cuidar da sua saúde emocional e física.</p>
          <p>Conte sempre conosco para apoiar seu autocuidado!</p>
          <p>Abraços,<br><strong>Equipe VIDA</strong></p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendHealthPlanCreatedEmail;
