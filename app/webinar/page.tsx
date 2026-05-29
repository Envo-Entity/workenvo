import { Nav } from "./_components/Nav";
import { Hero } from "./_components/Hero";
import { Problem } from "./_components/Problem";
import { Learn } from "./_components/Learn";
import { Audience } from "./_components/Audience";
import { Why } from "./_components/Why";
import { Speaker } from "./_components/Speaker";
import { RegisterCTA } from "./_components/RegisterCTA";
import Footer from "@/components/landing/Footer";
import { JourneyThread } from "./_components/JourneyThread";

export default function Page() {
  return (
    <>
      {/* Fixed navigation */}
      <Nav />

      {/* Journey progress sidebar — xl screens only */}
      <JourneyThread />

      {/* Page body */}
      <main>
        <Hero />
        <Problem />
        <Learn />
        <Audience />
        <Why />
        <Speaker />
        <RegisterCTA />
      </main>

      <Footer />
    </>
  );
}
