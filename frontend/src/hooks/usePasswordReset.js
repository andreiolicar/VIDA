// hooks/usePasswordReset.js
import { useState } from 'react';
import api from '@/services/axios';

export function usePasswordReset() {
    // Estados do fluxo
    const [currentStep, setCurrentStep] = useState('email'); // 'email' | 'code' | 'password'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dados do fluxo
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [user, setUser] = useState(null);

    // Timer para expiração do código
    const [timeLeft, setTimeLeft] = useState(0);
    const [canResend, setCanResend] = useState(true);

    // Limpar mensagens de erro/sucesso
    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    // Iniciar timer de expiração (15 minutos)
    const startExpirationTimer = () => {
        setTimeLeft(15 * 60); // 15 minutos em segundos

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setError('Código expirado. Solicite um novo código.');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return timer;
    };

    // Iniciar timer para reenvio (1 minuto)
    const startResendTimer = () => {
        setCanResend(false);
        let resendTime = 60;

        const timer = setInterval(() => {
            resendTime -= 1;
            if (resendTime <= 0) {
                setCanResend(true);
                clearInterval(timer);
            }
        }, 1000);

        return timer;
    };

    // Formatar tempo restante
    const formatTimeLeft = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // PASSO 1: Solicitar reset de senha
    const requestPasswordReset = async (emailInput) => {
        setLoading(true);
        clearMessages();

        try {
            const response = await api.post('/password-reset/request', {
                email: emailInput.toLowerCase().trim()
            });

            setEmail(emailInput.toLowerCase().trim());
            setSuccess(response.data.message);
            setCurrentStep('code');

            // Iniciar timers
            startExpirationTimer();
            startResendTimer();

            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Erro ao solicitar recuperação de senha';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // PASSO 2: Verificar código
    const verifyResetCode = async (codeInput) => {
        setLoading(true);
        clearMessages();

        try {
            const response = await api.post('/password-reset/verify', {
                email,
                code: codeInput
            });

            setCode(codeInput);
            setResetToken(response.data.resetToken);
            setUser(response.data.user);
            setSuccess(response.data.message);
            setCurrentStep('password');

            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Código inválido ou expirado';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // PASSO 3: Redefinir senha
    const resetPassword = async (newPassword) => {
        setLoading(true);
        clearMessages();

        try {
            const response = await api.post('/password-reset/reset', {
                resetToken,
                newPassword
            });

            setSuccess(response.data.message);

            // Reset completo após 2 segundos
            setTimeout(() => {
                resetFlow();
            }, 2000);

            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Erro ao redefinir senha';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Reenviar código
    const resendCode = async () => {
        if (!canResend) return { success: false, error: 'Aguarde antes de reenviar' };

        setLoading(true);
        clearMessages();

        try {
            const response = await api.post('/password-reset/resend', {
                email
            });

            setSuccess('Novo código enviado para seu email');

            // Reiniciar timers
            startExpirationTimer();
            startResendTimer();

            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Erro ao reenviar código';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Resetar todo o fluxo
    const resetFlow = () => {
        setCurrentStep('email');
        setLoading(false);
        setError('');
        setSuccess('');
        setEmail('');
        setCode('');
        setResetToken('');
        setUser(null);
        setTimeLeft(0);
        setCanResend(true);
    };

    // Voltar para passo anterior
    const goBack = () => {
        clearMessages();

        if (currentStep === 'code') {
            setCurrentStep('email');
        } else if (currentStep === 'password') {
            setCurrentStep('code');
        }
    };

    // Validações
    const validateEmail = (emailInput) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailInput);
    };

    const validateCode = (codeInput) => {
        return /^\d{6}$/.test(codeInput);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    return {
        // Estados
        currentStep,
        loading,
        error,
        success,
        email,
        code,
        user,
        timeLeft,
        canResend,

        // Funções principais
        requestPasswordReset,
        verifyResetCode,
        resetPassword,
        resendCode,

        // Utilitários
        resetFlow,
        goBack,
        clearMessages,
        formatTimeLeft,

        // Validações
        validateEmail,
        validateCode,
        validatePassword,

        // Setters (para inputs controlados)
        setEmail,
        setCode,
        setError,
        setSuccess
    };
}