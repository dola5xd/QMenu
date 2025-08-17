import Hero from "../_components/landing/Hero";
import About from "../_components/landing/About";
import Header from "../_components/layout/Header";
import Services from "../_components/landing/Services";
import JoinUs from "../_components/landing/Joinus";
import Footer from "../_components/layout/Footer";
import Contact from "../_components/landing/Contact";

import en from "@/../locales/en.json";
import ar from "@/../locales/ar.json";

async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang === "ar" ? "ar" : "en";
  const t = lang === "ar" ? ar : en;
  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${lang === "ar" ? "font-cairo" : ""} relative`}
    >
      <Header lang={lang} headerText={t.header} />
      <Hero heroText={t.hero} />
      <About aboutText={t.about} />
      <Services servicesText={t.services} />
      <JoinUs joinText={t.join} />
      <Contact contactText={t.contact} />
      <Footer footerText={t.footer} />
    </main>
  );
}

export default Home;
