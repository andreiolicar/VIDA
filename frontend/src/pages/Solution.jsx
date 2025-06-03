import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Solution() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Header />
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Solução V.I.D.A</h1>
        <p className="text-lg leading-relaxed mb-6">
          O V.I.D.A é uma plataforma completa que integra inteligência artificial para organizar sua vida nas áreas de finanças, estudos, saúde física e mental, e pequenas tarefas.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Nossa solução oferece um dashboard centralizado, assistente preditivo e controle total para que você alcance seus objetivos com praticidade e eficiência.
        </p>
        <p className="text-lg leading-relaxed">
          Automatize suas rotinas, receba recomendações personalizadas e acompanhe seu progresso para uma vida mais equilibrada e produtiva.
        </p>
      </section>
      <Footer />
    </main>
  );
}