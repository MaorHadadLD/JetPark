import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";
import { Handoff } from "@/components/Handoff";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Interlude } from "@/components/Interlude";
import { Modes } from "@/components/Modes";
import { Questions } from "@/components/Questions";
import { RevealRoot } from "@/components/RevealRoot";
import { Route } from "@/components/Route";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        דילוג לתוכן
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Handoff />
        <Interlude />
        <Route />
        <Modes />
        <Booking />
        <Questions />
      </main>
      <Footer />
      <RevealRoot />
    </>
  );
}
