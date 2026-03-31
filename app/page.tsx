import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import EmotionalReality from "@/components/landing/EmotionalReality";
import CapabilityLoop from "@/components/landing/CapabilityLoop";
import ProductSection from "@/components/landing/ProductSection";
import AILayer from "@/components/landing/AILayer";
import ESGSection from "@/components/landing/ESGSection";
import OutcomesSection from "@/components/landing/OutcomesSection";
import Differentiation from "@/components/landing/Differentiation";
import NewCategory from "@/components/landing/NewCategory";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <main className="relative z-10">
        <Nav />
        <Hero />
        <Problem />
        <EmotionalReality />
        <CapabilityLoop />
        <div id="platform">
          <ProductSection />
        </div>
        <AILayer />
        <div id="esg">
          <ESGSection />
        </div>
        <div id="for-hr">
          <OutcomesSection />
        </div>
        <div id="for-leaders">
          <Differentiation />
        </div>
        <NewCategory />
        <div id="pricing">
          <FinalCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
