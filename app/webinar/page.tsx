import { Nav } from "./_components/Nav";
import { Hero } from "./_components/Hero";
import { Speakers } from "./_components/Speakers";
import { Problem } from "./_components/Problem";
import { Learn } from "./_components/Learn";
import { Audience } from "./_components/Audience";
import { Why } from "./_components/Why";
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
        <Speakers />
        <Problem />
        <Learn />
        <Audience />
        <Why />
      </main>

      <Footer />
    </>
  );
}
