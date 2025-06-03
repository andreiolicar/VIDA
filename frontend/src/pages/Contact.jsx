import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Header />

      <section className="flex flex-col md:flex-row items-start justify-center gap-12 max-w-5xl mx-auto px-4 py-16 w-full">
        {/* Formulário */}
        <div className="w-full md:max-w-md bg-[#1f2937] rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-8">Contato</h1>
          {submitted ? (
            <p className="text-green-400 text-lg">
              Obrigado por entrar em contato! Responderemos em breve.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-semibold">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md bg-[#111827] border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md bg-[#111827] border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 font-semibold">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md bg-[#111827] border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Escreva sua mensagem aqui"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold transition"
              >
                Enviar
              </button>
            </form>
          )}
        </div>

        {/* Informações e Mapa */}
        <div className="w-full md:max-w-sm flex flex-col gap-6">
          <div className="bg-[#1f2937] rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Informações de Contato</h2>
            <p className="mb-2">📍 <span className="font-semibold">Etec da Zona Leste</span></p>
            <p className="mb-2">Endereço: Rua Dr. José Artur de Souza, 1000, São Paulo, SP, Brasil</p>
            <p className="mb-2">Telefone: (11) 1234-5678</p>
            <p>Email: contato@eteczonaleste.sp.gov.br</p>
          </div>
          <div className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg h-64 w-full">
            <iframe
              title="Mapa Etec da Zona Leste"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.457801381368!2d-46.52034568446449!3d-23.54875358468665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a2a2b1d8d3f%3A0x3d4b3a8f4e7b5a8f!2sETEC%20Zona%20Leste!5e0!3m2!1spt-BR!2sbr!4v1685778300000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 200 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}