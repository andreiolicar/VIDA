import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Undo2, Mail, Lock, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError(''); // Limpar erro ao digitar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao fazer login');

      console.log('[LOGIN] Login bem-sucedido. Dados recebidos:', data);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('[LOGIN] Erro no login:', err.message);
      setError(err.message);
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
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Bem-vindo de volta!
            </h1>
            <p className="text-gray-400">
              Entre na sua conta e continue organizando sua vida
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
                  value={form.email}
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

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300 block">
                  Senha
                </label>
                {/* "Esqueceu a senha?" */}
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-xl">
                <p className="text-red-600 dark:text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-6">
              <p className="text-gray-400">
                Ainda não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors"
                >
                  Cadastre-se agora
                </button>
              </p>
            </div>
          </form>

          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
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
                Organize sua vida com
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Inteligência Artificial
                </span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Reduza o estresse, ganhe tempo e alcance seus objetivos com nosso assistente inteligente personalizado.
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-blue-100">Bem-estar e produtividade</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-blue-100">Equilíbrio na palma da sua mão</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-blue-100">Assistente personalizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;