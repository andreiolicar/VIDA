import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Header />
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Sobre Nós</h1>
        <p className="text-lg leading-relaxed mb-6">
          O projeto V.I.D.A nasceu da vontade de ajudar pessoas a organizarem suas vidas com tecnologia de ponta e inteligência artificial.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Somos uma equipe multidisciplinar dedicada a criar soluções que promovam bem-estar, produtividade e equilíbrio para nossos usuários.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Acreditamos que a tecnologia deve ser uma aliada acessível e humana, capaz de transformar rotinas e facilitar o alcance de metas pessoais e profissionais.
        </p>
        <p className="text-lg leading-relaxed">
          Junte-se a nós nessa jornada para uma vida mais organizada, saudável e feliz.
        </p>
      </section>
      <Footer />
    </main>
  );
}