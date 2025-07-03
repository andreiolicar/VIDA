const transporter = require("../utils/mailer");

const sendPasswordResetEmail = async (name, email, code) => {
  const mailOptions = {
    from: '"Vida Notificações" <api.vida.app@gmail.com>',
    to: email,
    subject: "🔐 Recuperação de Senha - V.I.D.A.",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: rgba(10, 37, 136, 0.86); margin-bottom: 10px;">🔐 Recuperação de Senha</h1>
          <p style="color: #666; font-size: 16px;">V.I.D.A. - Seu assistente inteligente</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Olá, ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Recebemos uma solicitação para redefinir a senha da sua conta no <strong>V.I.D.A.</strong>
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; display: inline-block;">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Seu código de verificação:</p>
              <h1 style="margin: 10px 0 0 0; font-size: 32px; letter-spacing: 8px; font-weight: bold;">${code}</h1>
            </div>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              ⏰ <strong>Este código expira em 15 minutos</strong> por segurança.
            </p>
          </div>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px;">
          <h3 style="color: #333; margin-bottom: 15px;">Como usar o código:</h3>
          <ol style="color: #666; line-height: 1.8;">
            <li>Volte para a página de recuperação de senha</li>
            <li>Digite o código acima no campo solicitado</li>
            <li>Defina sua nova senha</li>
          </ol>
        </div>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #721c24; font-size: 14px;">
            🛡️ <strong>Não compartilhe este código</strong> com ninguém. Se você não solicitou esta alteração, ignore este email e sua senha permanecerá inalterada.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Qualquer dúvida, estamos à disposição.<br>
            <strong>Equipe V.I.D.A.</strong>
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendPasswordResetEmail;