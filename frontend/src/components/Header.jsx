import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import brancoVidaLogo from '../assets/branco-site-vida.png';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="max-w-[1300px] mx-auto px-4 py-8 text-white">
      <div className="max-w-[1300px] mx-auto flex items-center justify-between">

        <div className="text-xl font-bold flex items-center gap-1">
          <img src={brancoVidaLogo} alt="logo" className="h-10" />
        </div>

        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-10 text-[18px] items-center">
            <li>
              <a href="#" className="hover:text-blue-400 transition-all duration-300">Solução</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-all duration-300">Sobre</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-all duration-300">Contato</a>
            </li>
          </ul>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-full border border-white/20 bg-white/10 text-white text-base font-medium backdrop-blur-md hover:bg-white/20 transition-all duration-300 ease-in-out"
          >
            Entrar
          </Link>

          <Link
            to="/register"
            className="px-8 h-12 inline-flex items-center justify-center rounded-full bg-white text-black font-semibold border border-transparent hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 ease-in-out backdrop-blur-md"
          >
            Começar agora
          </Link>
        </div>

        <button
          className="md:hidden text-white ml-4"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0f172a] px-6 py-8 shadow-xl z-50">
          <ul className="space-y-6 text-lg text-white">
            <li><a href="#" className="block hover:text-blue-400 transition">Solução</a></li>
            <li><a href="#" className="block hover:text-blue-400 transition">Sobre</a></li>
            <li><a href="#" className="block hover:text-blue-400 transition">Contato</a></li>
          </ul>
          <div className="mt-6 space-y-3">
            <Link
              to="/login"
              className="block text-center px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="block text-center px-4 py-2 rounded-full bg-white text-black font-semibold hover:outline hover:outline-2 hover:outline-white hover:bg-transparent hover:text-white transition"
            >
              Começar agora
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}