import Image from "next/image";
import SectionHeader from "../ui/SectionHeader";

type ServicesProps = {
  servicesText: {
    heading: string;
    items: { title: string; description: string; image: string }[];
  };
};

function Services({ servicesText }: ServicesProps) {
  return (
    <section
      id="services"
      className="flex items-center justify-center px-6 py-20 text-white min-h-dvh sm:px-12 lg:px-20 bg-primary"
    >
      <div className="flex flex-col items-center justify-center gap-y-7">
        <SectionHeader>{servicesText.heading}</SectionHeader>
        <div className="flex flex-col items-center justify-between w-full gap-y-10 [&>div:nth-child(even)>span]:bg-[url('/assets/background/blob.svg')] [&>div:nth-child(odd)>span]:bg-[url('/assets/background/blob-reverse.svg')]">
          {servicesText.items.map((service, i) => (
            <div
              key={i}
              className="flex flex-col items-center w-full px-4 lg:flex-row lg:odd:flex-row-reverse lg:even:flex-row lg:px-0"
            >
              <span className="relative h-[250px] sm:h-[500px] min-w-1/2 bg-center bg-cover bg-no-repeat rounded-lg aspect-square">
                <Image src={service.image} alt={service.title} fill />
              </span>
              <div className="flex flex-col items-center text-center lg:items-start lg:w-1/2 gap-y-2 lg:text-start">
                <h3 className="text-xl sm:text-3xl font-semibold lg:text-4xl">
                  {service.title}
                </h3>
                <p className="sm:max-w-sm text-xs sm:text-sm lg:max-w-lg lg:text-base text-white/75">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
