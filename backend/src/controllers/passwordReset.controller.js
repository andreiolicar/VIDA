const passwordResetService = require('../services/passwordReset.service');

class PasswordResetController {

    // POST /api/password-reset/request
    async requestReset(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    error: 'Email é obrigatório'
                });
            }

            // Validar formato do email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: 'Formato de email inválido'
                });
            }

            const result = await passwordResetService.requestPasswordReset(email);

            res.status(200).json(result);
        } catch (error) {
            console.error('[PASSWORD RESET] Erro ao solicitar reset:', error);
            res.status(error.status || 500).json({
                error: error.message || 'Erro interno do servidor'
            });
        }
    }

    // POST /api/password-reset/verify
    async verifyCode(req, res) {
        try {
            const { email, code } = req.body;

            if (!email || !code) {
                return res.status(400).json({
                    error: 'Email e código são obrigatórios'
                });
            }

            // Validar formato do código (6 dígitos)
            if (!/^\d{6}$/.test(code)) {
                return res.status(400).json({
                    error: 'Código deve conter 6 dígitos'
                });
            }

            const result = await passwordResetService.verifyCode(email, code);

            res.status(200).json(result);
        } catch (error) {
            console.error('[PASSWORD RESET] Erro ao verificar código:', error);
            res.status(error.status || 500).json({
                error: error.message || 'Erro interno do servidor'
            });
        }
    }

    // POST /api/password-reset/reset
    async resetPassword(req, res) {
        try {
            const { resetToken, newPassword } = req.body;

            if (!resetToken || !newPassword) {
                return res.status(400).json({
                    error: 'Token e nova senha são obrigatórios'
                });
            }

            // Validar força da senha
            if (newPassword.length < 6) {
                return res.status(400).json({
                    error: 'Nova senha deve ter pelo menos 6 caracteres'
                });
            }

            const result = await passwordResetService.resetPassword(resetToken, newPassword);

            res.status(200).json(result);
        } catch (error) {
            console.error('[PASSWORD RESET] Erro ao redefinir senha:', error);
            res.status(error.status || 500).json({
                error: error.message || 'Erro interno do servidor'
            });
        }
    }

    // POST /api/password-reset/resend (Bonus: reenviar código)
    async resendCode(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    error: 'Email é obrigatório'
                });
            }

            // Reutilizar a lógica de request
            const result = await passwordResetService.requestPasswordReset(email);

            res.status(200).json({
                ...result,
                message: 'Novo código enviado para seu email'
            });
        } catch (error) {
            console.error('[PASSWORD RESET] Erro ao reenviar código:', error);
            res.status(error.status || 500).json({
                error: error.message || 'Erro interno do servidor'
            });
        }
    }
}

module.exports = new PasswordResetController();