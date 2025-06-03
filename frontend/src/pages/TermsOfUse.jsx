import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function TermsOfUse() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Header />

      <div className="max-w-4xl mx-auto bg-[#1f2937] rounded-xl p-8 mt-10 mb-14 shadow-lg">
        <h1 className="text-4xl font-bold mb-6">Termos de Uso</h1>

        <section className="space-y-4 text-white/90 leading-relaxed">
          <p>
            Ao utilizar o projeto V.I.D.A, você concorda com os termos e condições aqui descritos. É importante ler atentamente para entender seus direitos e responsabilidades.
          </p>

          <p>
            O uso do sistema é pessoal e intransferível. Você se compromete a utilizar as funcionalidades de forma ética e responsável.
          </p>

          <p>
            O projeto V.I.D.A reserva-se o direito de modificar, suspender ou interromper serviços a qualquer momento, sem aviso prévio.
          </p>

          <p>
            Não nos responsabilizamos por perdas ou danos decorrentes do uso inadequado da plataforma.
          </p>

          <p>
            Estes termos podem ser atualizados periodicamente. Recomendamos que você os revise regularmente.
          </p>
        </section>
      </div>

      <Footer />
    </main>
  );
}