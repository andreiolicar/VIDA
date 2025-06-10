import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { Undo2 } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      console.log('[DEBUG] Status da resposta:', res.status); // Mostra status HTTP
      const data = await res.json();
      console.log('[DEBUG] Corpo da resposta:', data); // Mostra o conteúdo da resposta

      if (!res.ok) throw new Error(data.message || 'Erro ao fazer login');

      console.log('[LOGIN] Login bem-sucedido. Dados recebidos:', data);
      localStorage.setItem('token', data.token);
      login(data.user); // Salva no contexto
      navigate('/dashboard');
    } catch (err) {
      console.error('[LOGIN] Erro no login:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <button
        onClick={() => navigate('/')}
        className="absolute top-20 left-20 flex items-center gap-2 text-blue-400 font-semibold hover:text-white transition-colors"
        aria-label="Voltar para home"
        type="button"
      >
        <Undo2 size={20} />
        <span>Voltar</span>
      </button>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
            <p className="text-white/70 text-sm">Digite seu e-mail e senha para acessar sua conta.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium text-white/80">E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white/80">Senha</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
              />
              <div className="text-right mt-1">
                <a href="#" className="text-sm text-blue-400 hover:underline">Esqueceu sua senha?</a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition"
            >
              Entrar
            </button>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </form>

          <div className="flex items-center my-4 gap-2">
            <hr className="flex-grow border-white/20" />
            <span className="text-white/60 text-sm">Ou entre com</span>
            <hr className="flex-grow border-white/20" />
          </div>

          <div className="flex space-x-4">
            <button className="flex items-center justify-center gap-2 flex-1 border border-white/10 bg-white/10 rounded-full py-2 text-white/90 hover:bg-white/20 transition backdrop-blur-md">
              <FcGoogle size={20} />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 flex-1 border border-white/10 bg-white/10 rounded-full py-2 text-white/90 hover:bg-white/20 transition backdrop-blur-md">
              <FaApple size={20} />
              <span>Apple</span>
            </button>
          </div>

          <p className="text-center text-sm text-white/60">
            Ainda não tem uma conta?{' '}
            <a href="/register" className="text-blue-400 hover:underline">Cadastre-se agora.</a>
          </p>
        </div>
      </div>

      {/* Painel à direita (desktop apenas) */}
      <div className="hidden md:flex items-center justify-center w-1/2 bg-white text-[#0f172a] p-10">
        <div className="space-y-6 text-center max-w-md">
          <h2 className="text-2xl font-bold leading-snug text-[#0f172a]">
            Transforme suas decisões em ações com o V.I.D.A.
          </h2>
          <p className="text-[#1e293b] text-sm">
            Organize suas finanças, estudos, saúde e tarefas com inteligência artificial personalizada.
            Reduza o estresse, ganhe tempo e alcance seus objetivos com o nosso assistente inteligente.
          </p>
          <p className="text-[#475569] text-sm">
            Bem-estar, produtividade e equilíbrio na palma da sua mão.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;