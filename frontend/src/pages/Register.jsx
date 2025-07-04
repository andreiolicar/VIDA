import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Undo2, User, Mail, Phone, Lock, Sparkles, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    captchaChecked: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  // Máscara para telefone
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : formattedValue
    });

    if (error) setError(''); // Limpar erro ao digitar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.captchaChecked) return setError('Por favor, confirme que você não é um robô.');
    if (form.password !== form.confirmPassword) return setError('As senhas não coincidem.');

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone.replace(/\D/g, ''), // Remover máscara
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao registrar');

      console.log('[REGISTER] Registro bem-sucedido. Dados:', data);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('[REGISTER] Erro ao registrar:', err.message);
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
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Crie sua conta
            </h1>
            <p className="text-gray-400">
              Preencha os dados para começar a usar o V.I.D.A.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Nome completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className={`w-5 h-5 transition-colors ${focusedField === 'name' ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Seu nome completo"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-800 border-2 rounded-xl transition-all duration-200 text-white placeholder-gray-500 ${focusedField === 'name'
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    } focus:outline-none`}
                  required
                />
              </div>
            </div>

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

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Telefone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className={`w-5 h-5 transition-colors ${focusedField === 'phone' ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField('')}
                  placeholder="(11) 99999-9999"
                  maxLength="15"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-800 border-2 rounded-xl transition-all duration-200 text-white placeholder-gray-500 ${focusedField === 'phone'
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    } focus:outline-none`}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Senha
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
                Confirmar senha
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

            {/* Captcha */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="captchaChecked"
                checked={form.captchaChecked}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 bg-gray-800 border-2 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label className="text-sm text-gray-300">
                Confirmo que não sou um robô
              </label>
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
                  Criando conta...
                </>
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-6">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors"
                >
                  Entre agora
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
                Sua nova jornada
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  começa agora
                </span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Cadastre-se e permita que nossa inteligência artificial ajude você a organizar sua vida e cuidar do seu bem-estar.
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-blue-100">Organização inteligente</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-blue-100">Economia de tempo</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span className="text-blue-100">Cuidado com bem-estar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;