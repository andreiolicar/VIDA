const transporter = require("../utils/mailer");

const sendNewStudyRouteEmail = async ({ name, email, title, area, description, topics }) => {
  const mailOptions = {
    from: '"Vida Notificações" <vida.app@gmail.com>',
    to: email,
    subject: "🎉 Sua nova Rota de Estudo foi criada!",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color:rgba(1, 40, 184, 0.86);">Olá, ${name}!</h2>
        <p>Você acabou de criar uma nova <strong>Rota de Estudo</strong>!</p>
        <p><strong>Título:</strong> ${title}</p>
        <p><strong>Área:</strong> ${area}</p>
        <p><strong>Descrição:</strong> ${description}</p>
        <p><strong>Etapas:</strong></p>
        <ul>
          ${topics.map((topic) => `<li>${topic}</li>`).join("")}
        </ul>
        <p>Explore e estude cada tópico para concluir sua jornada!</p>
        <p>Qualquer dúvida, estamos à disposição.</p>
        <p>Abraços,<br><strong>Equipe VIDA</strong></p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendNewStudyRouteEmail;
