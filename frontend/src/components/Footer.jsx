import {
  Instagram,
  Link as LinkIcon,
  Github,
} from "lucide-react";

import brancoVidaLogo from '../assets/branco-site-vida.png';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-white/5 backdrop-blur-md border-t border-white/10 rounded-t-3xl py-16 mt-10">
      <div className="max-w-[1300px] mx-auto px-4 flex flex-col gap-12">

        <div className="flex flex-col md:flex-row justify-between gap-10">

          <div className="md:w-1/3 space-y-4">
            <Link to="/">
              <img src={brancoVidaLogo} alt="logo" className="h-8" />
            </Link>
            <p className="text-white text-base leading-relaxed">
              Sua VIDA organizada com praticidade,<br />
              bem-estar e eficiência.
            </p>
          </div>

          <div className="flex flex-1 justify-end gap-16 text-white">
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link to="http://localhost:5000/api-docs" className="hover:underline">Documentação</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#">LinkedIn</a></li>
                <li><Link to="/contact" className="hover:underline">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link to="/privacy-policy" className="hover:underline">Privacidade</Link></li>
                <li><Link to="/terms-of-use" className="hover:underline">Termos</Link></li>
                <li><Link to="/partnerships" className="hover:underline">Parceiros</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10 pt-6">
          <p className="text-white/40 text-sm">
            © 2025 VIDA. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-white/50">
            <a href="https://github.com/andreiolicar/VIDA"><Github className="hover:text-white" size={18} /></a>
            <a href="https://www.instagram.com/vida.api/"><Instagram className="hover:text-white" size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
