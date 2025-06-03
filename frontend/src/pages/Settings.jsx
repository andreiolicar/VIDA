import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { Settings } from 'lucide-react';

const translations = {
  'pt-BR': {
    settings: 'Configurações',
    profile: 'Perfil',
    notifications: 'Notificações',
    privacy: 'Privacidade',
    language: 'Idioma',
    theme: 'Tema',
    dark: 'Escuro',
    light: 'Claro',
  },
  en: {
    settings: 'Settings',
    profile: 'Profile',
    notifications: 'Notifications',
    privacy: 'Privacy',
    language: 'Language',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
  },
};

export default function SettingsPage() {
  const [language, setLanguage] = useState('pt-BR');
  const [theme, setTheme] = useState('light');

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    const savedTheme = localStorage.getItem('theme');
    if (savedLang) setLanguage(savedLang);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] dark:from-gray-900 dark:to-gray-800 text-white">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto max-w-6xl mx-auto w-full">
        <div className="bg-[#1f2937] dark:bg-gray-900 rounded-xl p-8 shadow-xl">
          <header className="flex items-center gap-3 mb-8">
            <Settings className="w-7 h-7 text-blue-400" />
            <h1 className="text-3xl font-bold">{t('settings')}</h1>
          </header>

          <section className="space-y-6">
            <div>
              <label htmlFor="language-select" className="block mb-2 font-semibold">
                {t('language')}
              </label>
              <select
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
                className="bg-[#111827] dark:bg-gray-800 rounded-md px-4 py-2 w-48 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">{t('theme')}</label>
              <button
                onClick={handleThemeToggle}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold"
              >
                {theme === 'dark' ? t('light') : t('dark')}
              </button>
            </div>

            <div className="bg-[#111827] dark:bg-gray-800 rounded-md p-4 text-white/80">
              <h2 className="font-semibold mb-2">{t('profile')}</h2>
              <p>Em breve: edição de perfil, senha e preferências.</p>
            </div>

            <div className="bg-[#111827] dark:bg-gray-800 rounded-md p-4 text-white/80">
              <h2 className="font-semibold mb-2">{t('notifications')}</h2>
              <p>Em breve: configurações de notificações personalizadas.</p>
            </div>

            <div className="bg-[#111827] dark:bg-gray-800 rounded-md p-4 text-white/80">
              <h2 className="font-semibold mb-2">{t('privacy')}</h2>
              <p>Em breve: controle de privacidade e dados.</p>
            </div>
          </section>
        </div>
      </main>

      <DashboardRightPanel />
    </div>
  );
}