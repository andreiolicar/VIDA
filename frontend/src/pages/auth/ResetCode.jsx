// pages/auth/ResetCode.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Undo2, Shield, Sparkles, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

function ResetCode() {
    const navigate = useNavigate();
    const location = useLocation();

    // Estados locais (não usar hook que perde estado entre páginas)
    const [code, setCode] = useState('');
    const [email] = useState(location.state?.email || '');
    const [focusedField, setFocusedField] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Timer local para expiração
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos
    const [canResend, setCanResend] = useState(true);

    // Redirecionar se não tiver email
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    // Timer de expiração
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setError('Código expirado. Solicite um novo código.');
        }
    }, [timeLeft]);

    // Formatar tempo restante
    const formatTimeLeft = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Validar código
    const validateCode = (codeInput) => {
        return /^\d{6}$/.test(codeInput);
    };

    // Limpar mensagens
    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setCode(value);
        if (error) clearMessages();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('[DEBUG] Email:', email);
        console.log('[DEBUG] Code:', code);

        if (!validateCode(code)) {
            setError('Código deve conter 6 dígitos');
            return;
        }

        setLoading(true);
        clearMessages();

        try {
            const response = await fetch('http://localhost:5000/api/password-reset/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    code: code
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Código inválido ou expirado');
            }

            console.log('[RESET CODE] Sucesso:', data);
            setSuccess('Código verificado com sucesso!');

            // Navegar para nova senha após 1 segundo
            setTimeout(() => {
                navigate('/new-password', {
                    state: {
                        email,
                        resetToken: data.resetToken,
                        user: data.user
                    }
                });
            }, 1000);

        } catch (err) {
            console.error('[RESET CODE] Erro:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        setLoading(true);
        setCanResend(false);
        clearMessages();

        try {
            const response = await fetch('http://localhost:5000/api/password-reset/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Novo código enviado para seu email');
                setTimeLeft(15 * 60); // Reset timer para 15 minutos

                // Aguardar 60 segundos para reenviar novamente
                setTimeout(() => setCanResend(true), 60000);
            } else {
                throw new Error(data.error || 'Erro ao reenviar código');
            }
        } catch (err) {
            console.error('[RESEND] Erro:', err.message);
            setError(err.message);
            setCanResend(true); // Permitir tentar novamente
        } finally {
            setLoading(false);
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
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                            Digite o código
                        </h1>
                        <p className="text-gray-400">
                            Enviamos um código de 6 dígitos para
                        </p>
                        <p className="text-blue-400 font-medium">
                            {email}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Code Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 block">
                                Código de verificação
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="code"
                                    value={code}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('code')}
                                    onBlur={() => setFocusedField('')}
                                    placeholder="000000"
                                    maxLength="6"
                                    className={`w-full px-4 py-4 bg-gray-800 border-2 rounded-xl transition-all duration-200 text-white placeholder-gray-500 text-center text-2xl font-mono tracking-widest ${focusedField === 'code'
                                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                        } focus:outline-none`}
                                    required
                                />
                            </div>

                            {/* Timer */}
                            {timeLeft > 0 && (
                                <div className="text-center">
                                    <p className="text-sm text-gray-400">
                                        Código expira em: <span className="text-blue-400 font-mono">{formatTimeLeft()}</span>
                                    </p>
                                </div>
                            )}
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
                            disabled={loading || code.length !== 6}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    Verificar código
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Resend Code */}
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-2">
                                Não recebeu o código?
                            </p>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={!canResend || loading}
                                className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${canResend && !loading
                                        ? 'text-blue-400 hover:text-blue-300'
                                        : 'text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <RefreshCw className="w-4 h-4" />
                                {canResend ? 'Reenviar código' : 'Aguarde para reenviar'}
                            </button>
                        </div>

                        {/* Back Link */}
                        <div className="text-center pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-gray-400 hover:text-gray-300 text-sm hover:underline transition-colors"
                            >
                                Voltar para inserir email
                            </button>
                        </div>
                    </form>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/forgot-password')}
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
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-4xl font-bold mb-4">
                                Verificação
                                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                                    de segurança
                                </span>
                            </h2>
                            <p className="text-xl text-blue-100 leading-relaxed">
                                Digite o código de 6 dígitos que enviamos para seu email. Este código expira em 15 minutos por segurança.
                            </p>
                        </div>

                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                <span className="text-blue-100">Código único e temporário</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                <span className="text-blue-100">Válido por 15 minutos</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                <span className="text-blue-100">Pode reenviar se necessário</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetCode;