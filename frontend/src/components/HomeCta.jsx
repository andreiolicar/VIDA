import { Zap, UserPlus } from "lucide-react";
import CtaButton from "@/components/ui/CtaButton";

export default function HomeCta() {
    return (
        <section className="max-w-[1300px] mx-auto pb-20 px-4 text-white text-center relative z-10">
            <h2 className="text-3xl mb-6 md:text-4xl font-semibold text-center">
                Alcance seu potencial com a IA do V.I.D.A
            </h2>

            <p className="text-white/80 text-base max-w-2xl mx-auto mb-10">
                Junte-se a milhares de usuários que já estão organizando sua rotina com inteligência. Comece agora a transformar sua vida com automações, metas e recomendações personalizadas.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <CtaButton />

                <a href="/register">
                    <button className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-full border border-white/20 bg-white/10 text-white text-base font-medium backdrop-blur-md hover:bg-white/20 transition">
                        <UserPlus size={18} />
                        Criar Conta
                    </button>
                </a>
            </div>
        </section>
    );
}
