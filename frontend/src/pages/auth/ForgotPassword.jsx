// pages/auth/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import { Undo2, Mail, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

function ForgotPassword() {
    const navigate = useNavigate();
    const {
        loading,
        error,
        success,
        requestPasswordReset,
        validateEmail,
        clearMessages
    } = usePasswordReset();

    const [email, setEmail] = useState('');
    const [focusedField, setFocusedField] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) clearMessages();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            return;
        }

        if (!validateEmail(email)) {
            return;
        }

        const result = await requestPasswordReset(email);

        if (result.success) {
            // Redirecionar para página de código após 1 segundo
            setTimeout(() => {
                navigate('/reset-code', {
                    state: { email: email.toLowerCase().trim() }
                });
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl mb-6 shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                            Esqueceu sua senha?
                        </h1>
                        <p className="text-gray-400">
                            Digite seu email para receber um código de recuperação
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 block">
                                E-mail
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-blue-400' : 'text-gray-400'
                                        }`} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField('')}
                                    placeholder="seu@email.com"
                                    className={`w-full pl-12 pr-4 py-4 bg-gray-800 border-2 rounded-xl transition-all duration-200 text-white placeholder-gray-500 ${focusedField === 'email'
                                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                        } focus:outline-none`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-xl">
                                <p className="text-green-600 dark:text-green-300 text-sm font-medium">{success}</p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-xl">
                                <p className="text-red-600 dark:text-red-300 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Enviando código...
                                </>
                            ) : (
                                <>
                                    Enviar código
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Back to Login */}
                        <div className="text-center pt-6">
                            <p className="text-gray-400">
                                Lembrou da senha?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors"
                                >
                                    Voltar ao login
                                </button>
                            </p>
                        </div>
                    </form>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/login')}
                        className="absolute top-0 left-0 p-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Undo2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Right Panel - Hero com Glass Effect */}
            <div className="hidden lg:flex flex-1 bg-gray-900 relative overflow-hidden items-center justify-center">
                {/* Glass Container */}
                <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md mx-8 shadow-2xl">
                    <div className="text-center text-white">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-6 backdrop-blur-sm">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-4xl font-bold mb-4">
                                Recupere o acesso
                                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                                    à sua conta
                                </span>
                            </h2>
                            <p className="text-xl text-blue-100 leading-relaxed">
                                Não se preocupe! Enviaremos um código de verificação para seu email para que você possa redefinir sua senha com segurança.
                            </p>
                        </div>

                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                <span className="text-blue-100">Processo rápido e seguro</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                <span className="text-blue-100">Código válido por 15 minutos</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                <span className="text-blue-100">Seus dados estão protegidos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;