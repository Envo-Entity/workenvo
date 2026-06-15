import { Nav } from "./_components/Nav";
import { Hero } from "./_components/Hero";
import { Speakers } from "./_components/Speakers";
import { Problem } from "./_components/Problem";
import { Learn } from "./_components/Learn";
import { Audience } from "./_components/Audience";
import { Why } from "./_components/Why";
import { RegisterCTA } from "./_components/RegisterCTA";
import { WebinarRegister } from "./_components/WebinarRegister";
import Footer from "@/components/landing/Footer";
import { JourneyThread } from "./_components/JourneyThread";

export default function Page() {
  return (
    <>
      <Nav />
      <JourneyThread />
      <main>
        <Hero />
        <Speakers />
        <Problem />
        <Learn />
        <Audience />
        <Why />
        <RegisterCTA />
      </main>
      <Footer />
      <WebinarRegister />
    </>
  );
}
