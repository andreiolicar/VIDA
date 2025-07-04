import Header from "@/components/Header";
import HomeHero from "@/components/HomeHero";
import HomeBenefits from "../components/HomeBenefits";
import HomeFaq from "../components/HomeFaq";
import HomeCta from "../components/HomeCta";
import Footer from "../components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <Header/>
      <HomeHero/>
      <HomeBenefits/>
      <HomeFaq/>
      <HomeCta/>
      <Footer/>
    </main>
  );
}