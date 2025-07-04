// pages/auth/NewPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Undo2, Lock, Sparkles, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

function NewPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    // Estados locais (não usar hook que perde estado entre páginas)
    const [form, setForm] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dados vindos da página anterior
    const [email] = useState(location.state?.email || '');
    const [resetToken] = useState(location.state?.resetToken || '');
    const [user] = useState(location.state?.user || null);

    // Redirecionar se não tiver dados necessários
    useEffect(() => {
        console.log('[DEBUG] Email:', email);
        console.log('[DEBUG] Reset Token:', resetToken);
        console.log('[DEBUG] User:', user);
        console.log('[DEBUG] Location state:', location.state);

        if (!email || !resetToken) {
            console.log('[DEBUG] Redirecionando - faltam dados');
            navigate('/forgot-password');
        }
    }, [email, resetToken, navigate, location.state]);

    // Validar senha
    const validatePassword = (password) => {
        return password.length >= 6;
    };

    // Limpar mensagens
    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (error) clearMessages();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('[DEBUG] Form:', form);
        console.log('[DEBUG] Reset Token para envio:', resetToken);

        if (!validatePassword(form.password)) {
            setError('Nova senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        setLoading(true);
        clearMessages();

        try {
            const response = await fetch('http://localhost:5000/api/password-reset/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resetToken: resetToken,
                    newPassword: form.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao redefinir senha');
            }

            console.log('[NEW PASSWORD] Sucesso:', data);
            setSuccess('Senha redefinida com sucesso!');

            // Redirecionar para login após 3 segundos
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Senha redefinida com sucesso! Faça login com sua nova senha.',
                        email: email
                    }
                });
            }, 3000);

        } catch (err) {
            console.error('[NEW PASSWORD] Erro:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (password.length === 0) return { strength: 0, label: '', color: '' };
        if (password.length < 6) return { strength: 25, label: 'Fraca', color: 'bg-red-500' };
        if (password.length < 8) return { strength: 50, label: 'Média', color: 'bg-yellow-500' };
        if (password.length < 12) return { strength: 75, label: 'Forte', color: 'bg-blue-500' };
        return { strength: 100, label: 'Muito Forte', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(form.password);

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl mb-6 shadow-lg">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                            Nova senha
                        </h1>
                        <p className="text-gray-400">
                            {user ? `Olá, ${user.name}!` : 'Olá!'} Defina sua nova senha
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 block">
                                Nova senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-blue-400' : 'text-gray-400'
                                        }`} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField('')}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-4 bg-gray-800 border-2 rounded-xl transition-all duration-200 text-white placeholder-gray-500 ${focusedField === 'password'
                                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                        } focus:outline-none`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {form.password && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Força da senha:</span>
                                        <span className={`font-medium ${passwordStrength.strength >= 75 ? 'text-green-400' :
                                                passwordStrength.strength >= 50 ? 'text-blue-400' :
                                                    passwordStrength.strength >= 25 ? 'text-yellow-400' : 'text-red-400'
                                            }`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                            style={{ width: `${passwordStrength.strength}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 block">
                                Confirmar nova senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={`w-5 h-5 transition-colors ${focusedField === 'confirmPassword' ? 'text-blue-400' : 'text-gray-400'
                                        }`} />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('confirmPassword')}
                                    onBlur={() => setFocusedField('')}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-4 bg-gray-800 border-2 rounded-xl transition-all duration-200 text-white placeholder-gray-500 ${focusedField === 'confirmPassword'
                                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                            : form.confirmPassword && form.password !== form.confirmPassword
                                                ? 'border-red-300'
                                                : form.confirmPassword && form.password === form.confirmPassword
                                                    ? 'border-green-300'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                        } focus:outline-none`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Match Indicator */}
                            {form.confirmPassword && (
                                <div className="flex items-center gap-2 text-sm">
                                    {form.password === form.confirmPassword ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            <span className="text-green-400">Senhas coincidem</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-4 h-4 rounded-full border-2 border-red-300"></div>
                                            <span className="text-red-400">Senhas não coincidem</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-xl">
                                <p className="text-green-600 dark:text-green-300 text-sm font-medium">{success}</p>
                                <p className="text-green-600 dark:text-green-300 text-xs mt-1">
                                    Redirecionando para o login...
                                </p>
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
                            disabled={loading || !form.password || !form.confirmPassword || form.password !== form.confirmPassword}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Redefinindo senha...
                                </>
                            ) : (
                                <>
                                    Redefinir senha
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Password Requirements */}
                        <div className="bg-gray-800 p-4 rounded-xl">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Requisitos da senha:</h4>
                            <ul className="text-xs text-gray-400 space-y-1">
                                <li className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${form.password.length >= 6 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                                    Mínimo de 6 caracteres
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${form.password.length >= 8 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                                    Recomendado: 8 ou mais caracteres
                                </li>
                            </ul>
                        </div>

                        {/* Back Link */}
                        <div className="text-center pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/reset-code', { state: { email } })}
                                className="text-gray-400 hover:text-gray-300 text-sm hover:underline transition-colors"
                            >
                                Voltar para código de verificação
                            </button>
                        </div>
                    </form>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/reset-code', { state: { email } })}
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
                                <Lock className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-4xl font-bold mb-4">
                                Quase pronto!
                                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                                    Nova senha
                                </span>
                            </h2>
                            <p className="text-xl text-blue-100 leading-relaxed">
                                Escolha uma senha forte e segura. Recomendamos usar pelo menos 8 caracteres com uma combinação de letras e números.
                            </p>
                        </div>

                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                <span className="text-blue-100">Senha criptografada e segura</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                <span className="text-blue-100">Acesso imediato após redefinir</span>
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

export default NewPassword;