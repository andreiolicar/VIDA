import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Partnerships() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto bg-[#1f2937] rounded-xl p-8 mt-10 mb-14 shadow-lg">
        <h1 className="text-4xl font-bold mb-8">Parcerias</h1>

        <section className="space-y-8 text-white/90 leading-relaxed">
          <article>
            <h2 className="text-2xl font-semibold mb-2">Etec da Zona Leste</h2>
            <p>
              A Etec da Zona Leste é uma escola técnica estadual vinculada ao Centro Paula Souza, oferecendo cursos técnicos presenciais como Administração, Contabilidade e Desenvolvimento de Sistemas. Conta com infraestrutura moderna e laboratórios equipados para apoiar o aprendizado prático dos estudantes.
            </p>
            <p>
              Saiba mais: <a href="https://eteczonaleste.cps.sp.gov.br" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">eteczonaleste.cps.sp.gov.br</a>
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold mb-2">Centro Paula Souza</h2>
            <p>
              O Centro Paula Souza (CPS) é uma instituição pública que administra as Escolas Técnicas Estaduais (Etecs) e Faculdades de Tecnologia (Fatecs) no estado de São Paulo, oferecendo educação técnica e tecnológica gratuita e de qualidade para milhares de alunos.
            </p>
            <p>
              Saiba mais: <a href="https://www.cps.sp.gov.br" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">cps.sp.gov.br</a>
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold mb-2">Venturus</h2>
            <p>
              A Venturus é um centro de inovação tecnológica que atua no desenvolvimento de soluções avançadas em diversas áreas, promovendo a integração entre pesquisa, tecnologia e mercado para gerar impacto positivo na sociedade.
            </p>
            <p>
              Saiba mais: <a href="https://venturus.org.br" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">venturus.org.br</a>
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold mb-2">Fundação IOCHPE</h2>
            <p>
              A Fundação IOCHPE é uma organização dedicada a promover a educação, a inovação e o desenvolvimento social por meio de projetos e parcerias que fortalecem o ecossistema empreendedor e educacional no Brasil.
            </p>
            <p>
              Saiba mais: <a href="https://www.iochpe.org.br" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">iochpe.org.br</a>
            </p>
          </article>
        </section>
      </div>

      <Footer />
    </main>
  );
}