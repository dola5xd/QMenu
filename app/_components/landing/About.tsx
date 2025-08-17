import Image from "next/image";
import Waves from "../ui/Waves";
import SectionHeader from "../ui/SectionHeader";

type AboutProps = {
  aboutText: {
    heading: string;
    description: string;
    features: { title: string; description: string; image: string }[];
  };
};

function About({ aboutText }: AboutProps) {
  return (
    <section
      id="about"
      className="relative min-h-screen px-6 pt-[120px] sm:pt-[180px] md:pt-[220px] lg:pt-[250px] xl:pt-[320px] pb-20 overflow-hidden text-secondary bg-primary sm:px-12 md:px-20"
    >
      <Waves className="top-0 left-0 " />

      <div className="flex flex-col text-center gap-y-4 xl:mt-4">
        <div className="flex flex-col items-center justify-center text-center gap-y-6">
          <SectionHeader>{aboutText.heading}</SectionHeader>
          <p className="max-w-sm text-xs sm:text-base sm:max-w-3xl">
            {aboutText.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-10 lg:grid-cols-3">
          {aboutText.features.map((feature, i) => (
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
