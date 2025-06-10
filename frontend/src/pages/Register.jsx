import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { Undo2 } from 'lucide-react';

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.captchaChecked) return setError('Por favor, confirme que você não é um robô.');
    if (form.password !== form.confirmPassword) return setError('As senhas não coincidem.');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erro ao registrar');

      console.log('[REGISTER] Registro bem-sucedido. Dados:', data.user);
      localStorage.setItem('token', data.user.token);
      login(data.user.id); // Salva no contexto
      navigate('/dashboard');
    } catch (err) {
      console.error('[REGISTER] Erro ao registrar:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center items-center w-1/2 bg-[#0f172a] text-white px-10">
        <button
          onClick={() => navigate('/')}
          className="absolute top-20 left-20 flex items-center gap-2 text-blue-400 font-semibold hover:text-white transition-colors"
          aria-label="Voltar para home"
          type="button"
        >
          <Undo2 size={20} />
          <span>Voltar</span>
        </button>

        <div className="w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold text-white">Crie sua conta</h1>
          <p className="text-white/80">Preencha os dados para começar a usar o V.I.D.A.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium text-white/80">Nome completo</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#1e293b] border border-white/10 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/40"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white/80">E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-[#1e293b] border border-white/10 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/40"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white/80">Telefone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-[#1e293b] border border-white/10 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/40"
                placeholder="(99) 99999-9999"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white/80">Senha</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-[#1e293b] border border-white/10 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/40"
                placeholder="********"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white/80">
                Confirmar senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#1e293b] border border-white/10 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/40"
                placeholder="********"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="captchaChecked"
                checked={form.captchaChecked}
                onChange={handleChange}
                id="captcha"
                className="w-4 h-4 accent-blue-500"
              />
              <label htmlFor="captcha" className="text-sm text-white/80">
                Não sou um robô
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              Criar conta
            </button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-white/10" />
            <span className="mx-2 text-white/60 text-sm">Ou cadastre-se com</span>
            <hr className="flex-grow border-white/10" />
          </div>

          <div className="flex space-x-4">
            <button className="flex items-center justify-center space-x-2 flex-1 border border-white/10 bg-white/10 rounded-md py-2 hover:bg-white/20 transition text-white">
              <FcGoogle size={20} />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 flex-1 border border-white/10 bg-white/10 rounded-md py-2 hover:bg-white/20 transition text-white">
              <FaApple size={20} />
              <span>Apple</span>
            </button>
          </div>

          <p className="text-center text-sm text-white/60">
            Já tem uma conta?{' '}
            <a href="/login" className="text-blue-400 hover:underline">
              Entre agora.
            </a>
          </p>
        </div>
      </div>

      {/* Lado direito - descrição */}
      <div className="hidden md:flex items-center justify-center w-1/2 bg-white text-[#0f172a] p-10">
        <div className="space-y-6 text-center max-w-md">
          <h2 className="text-2xl font-bold leading-snug text-[#0f172a]">
            Comece sua transformação com o V.I.D.A.
          </h2>
          <p className="text-[#1e293b] text-sm">
            Cadastre-se e permita que nossa inteligência artificial ajude você a organizar sua vida,
            economizar seu tempo e cuidar do seu bem-estar.
          </p>
          <p className="text-[#475569] text-sm">Sua nova jornada começa agora.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
