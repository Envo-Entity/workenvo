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
    <main>
      <Nav />
      <Hero />
      <Problem />
      <EmotionalReality />
      <CapabilityLoop />
      <ProductSection />
      <AILayer />
      <ESGSection />
      <OutcomesSection />
      <Differentiation />
      <NewCategory />
      <FinalCTA />
      <Footer />
    </main>
  );
}
