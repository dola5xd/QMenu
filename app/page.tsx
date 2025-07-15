import Hero from "./_components/landing/Hero";
import About from "./_components/landing/About";
import Header from "./_components/layout/Header";
import Services from "./_components/landing/Services";
import JoinUs from "./_components/landing/Joinus";
import Footer from "./_components/layout/Footer";
import Contact from "./_components/landing/Contact";

function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <About />
      <Services />
      <JoinUs />
      <Contact />
      <Footer />
    </main>
  );
}

export default Home;
