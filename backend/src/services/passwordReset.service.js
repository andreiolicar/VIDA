const { PasswordReset, User } = require('../models');
const sendPasswordResetEmail = require('../emails/passwordResetEmail');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

class PasswordResetService {

  // Gerar código de 6 dígitos
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Solicitar reset de senha
  async requestPasswordReset(email) {
    // Verificar se o usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw { status: 404, message: 'Usuário não encontrado com este email' };
    }

    // Invalidar códigos anteriores não utilizados
    await PasswordReset.update(
      { used: true },
      { 
        where: { 
          userId: user.id, 
          used: false,
          expiresAt: { [Op.gt]: new Date() }
        } 
      }
    );

    // Gerar novo código
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Salvar no banco
    const passwordReset = await PasswordReset.create({
      userId: user.id,
      email: user.email,
      code,
      expiresAt,
      used: false
    });

    // Enviar email
    try {
      await sendPasswordResetEmail(user.name, user.email, code);
      console.log(`[PASSWORD RESET] Código enviado para ${email}: ${code}`);
    } catch (emailError) {
      console.error('[PASSWORD RESET] Erro ao enviar email:', emailError);
      // Não falhar a operação se o email não for enviado
      // Em produção, você pode querer implementar uma fila de retry
    }

    return {
      message: 'Código de recuperação enviado para seu email',
      expiresIn: '15 minutos'
    };
  }

  // Verificar código
  async verifyCode(email, code) {
    // Buscar código válido
    const passwordReset = await PasswordReset.findOne({
      where: {
        email,
        code,
        used: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!passwordReset) {
      throw { status: 400, message: 'Código inválido ou expirado' };
    }

    // Gerar token temporário para reset (válido por 30 minutos)
    const jwt = require('jsonwebtoken');
    const resetToken = jwt.sign(
      { 
        userId: passwordReset.userId, 
        resetId: passwordReset.id,
        email: passwordReset.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    return {
      message: 'Código verificado com sucesso',
      resetToken,
      user: passwordReset.user
    };
  }

  // Redefinir senha
  async resetPassword(resetToken, newPassword) {
    // Verificar token
    const jwt = require('jsonwebtoken');
    let decoded;
    
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      throw { status: 400, message: 'Token inválido ou expirado' };
    }

    // Verificar se o código ainda é válido
    const passwordReset = await PasswordReset.findOne({
      where: {
        id: decoded.resetId,
        userId: decoded.userId,
        used: false,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!passwordReset) {
      throw { status: 400, message: 'Sessão de reset expirada' };
    }

    // Buscar usuário
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw { status: 404, message: 'Usuário não encontrado' };
    }

    // Criptografar nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha do usuário
    await user.update({ password: hashedPassword });

    // Marcar código como usado
    await passwordReset.update({ used: true });

    // Invalidar todos os outros códigos do usuário
    await PasswordReset.update(
      { used: true },
      { 
        where: { 
          userId: user.id, 
          used: false 
        } 
      }
    );

    console.log(`[PASSWORD RESET] Senha redefinida para usuário ${user.email}`);

    return {
      message: 'Senha redefinida com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  // Limpar códigos expirados (método utilitário)
  async cleanExpiredCodes() {
    const result = await PasswordReset.destroy({
      where: {
        expiresAt: { [Op.lt]: new Date() }
      }
    });

    console.log(`[PASSWORD RESET] ${result} códigos expirados removidos`);
    return result;
  }
}

module.exports = new PasswordResetService();