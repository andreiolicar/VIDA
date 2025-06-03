import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Header />

      <div className="max-w-4xl mx-auto bg-[#1f2937] rounded-xl p-8 mt-10 mb-14 shadow-lg">
        <h1 className="text-4xl font-bold mb-6">Política de Privacidade</h1>

        <section className="space-y-4 text-white/90 leading-relaxed">
          <p>
            Sua privacidade é muito importante para nós. No projeto V.I.D.A, coletamos e utilizamos seus dados apenas para melhorar sua experiência e oferecer funcionalidades personalizadas.
          </p>

          <p>
            Não compartilhamos suas informações com terceiros sem seu consentimento explícito. Utilizamos tecnologias seguras para proteger seus dados contra acessos não autorizados.
          </p>

          <p>
            Você pode solicitar a qualquer momento a exclusão dos seus dados ou a revisão das informações que armazenamos.
          </p>

          <p>
            Para dúvidas ou solicitações relacionadas à privacidade, entre em contato conosco através dos canais disponíveis no site.
          </p>

          <p>
            Esta política pode ser atualizada periodicamente. Recomendamos que você a revise regularmente para estar ciente de quaisquer alterações.
          </p>
        </section>
      </div>

      <Footer />
    </main>
  );
}