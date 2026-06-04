import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import TimingProblem from "@/components/landing/TimingProblem";
import OneQuestion from "@/components/landing/OneQuestion";
import DashboardPreview from "@/components/landing/DashboardPreview";
import PulseSurvey from "@/components/landing/PulseSurvey";
import Integrations from "@/components/landing/Integrations";
import SignalGrid from "@/components/landing/SignalGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import OutcomesSection from "@/components/landing/OutcomesSection";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <main className="relative z-10 bg-white">
        <Nav />
        <Hero />
        <Problem />
        <TimingProblem />
        <OneQuestion />
        <DashboardPreview />
        <PulseSurvey />
        <Integrations />
        <div id="signals">
          <SignalGrid />
        </div>
        <HowItWorks />
        <OutcomesSection />
        <div id="pricing">
          <Pricing />
        </div>
      </main>
      <Footer />
    </>
  );
}
