import Image from "next/image";
import Waves from "../ui/Waves";
import SectionHeader from "../ui/SectionHeader";

const features = [
  {
    title: "No Design Skills Needed",
    description:
      "Easily build beautiful, modern digital menus tailored to your brand without needing a designer.",
    image: "/assets/illustrations/About/process.svg",
  },
  {
    title: "Instant QR Code Generation",
    description:
      "Generate QR codes for your menu with a single click ready to print or share anywhere.",
    image: "/assets/illustrations/About/qr.svg",
  },
  {
    title: "Empowering Local Businesses",
    description:
      "QMenu helps cafés and restaurants create modern menus and share them with QR codes quickly and effortlessly.",

    image: "/assets/illustrations/About/relax.svg",
  },
];

function About() {
  return (
    <section
      id="about"
      className="relative min-h-screen px-6 pt-[120px] sm:pt-[180px] md:pt-[220px] lg:pt-[250px] xl:pt-[320px] pb-20 overflow-hidden text-secondary bg-primary sm:px-12 md:px-20"
    >
      <Waves className="top-0 left-0 " />

      <div className="flex flex-col text-center gap-y-4 xl:mt-4">
        <div className="flex flex-col items-center justify-center text-center gap-y-6">
          <SectionHeader>About Us</SectionHeader>
          <p className="max-w-sm text-xs sm:text-base sm:max-w-3xl">
            QMenu is a smart digital tool that helps café and restaurant owners
            create beautifully branded menus and share them through QR codes in
            just minutes. No tech skills required!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-10 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-6 text-center transition-transform duration-300 border gap-y-2 bg-white/10 backdrop-blur-sm rounded-2xl border-white/10 hover:scale-102"
            >
              <span className="relative h-[250px] aspect-square">
                <Image src={feature.image} alt={feature.title} fill />
              </span>
              <h3 className="text-lg font-bold text-white sm:text-2xl">
                {feature.title}
              </h3>
              <p className="max-w-lg text-xs sm:text-base sm:max-w-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
