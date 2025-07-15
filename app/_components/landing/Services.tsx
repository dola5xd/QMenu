import Image from "next/image";
import SectionHeader from "../ui/SectionHeader";
const services = [
  {
    title: "Custom Menu Builder",
    description:
      "Effortlessly design and structure your café or restaurant menu using our intuitive drag-and-drop builder. Whether you're adding categories, dishes, or custom options you’ll have full control without needing any coding or design experience.",
    image: "/assets/illustrations/Services/build.svg",
  },
  {
    title: "QR Code Generator",
    description:
      "Instantly generate high-quality, scannable QR codes that link directly to your digital menu. Perfect for printing on tables, flyers, or displays making it easier than ever for customers to access your offerings with a simple scan.",
    image: "/assets/illustrations/Services/Qr-code.svg",
  },
  {
    title: "Branding & Themes",
    description:
      "Keep your brand front and center with full customization options. From your logo to your colors, fonts, and menu layout make sure your digital presence reflects your café’s unique identity and atmosphere.",
    image: "/assets/illustrations/Services/Branding.svg",
  },
  {
    title: "Real-time Updates",
    description:
      "Need to update your prices, change availability, or run a new promotion? QMenu lets you make instant changes to your menu from any device ensuring your customers always see the latest version.",
    image: "/assets/illustrations/Services/update.svg",
  },
];

function Services() {
  return (
    <section
      id="sevices"
      className="flex items-center justify-center px-6 py-20 text-white min-h-dvh sm:px-12 md:px-20 bg-primary"
    >
      <div className="flex flex-col items-center justify-center gap-y-7">
        <SectionHeader>Our Services</SectionHeader>
        <div className="flex flex-col items-center justify-between w-full gap-y-10 [&>div:nth-child(even)>span]:bg-[url('/assets/background/blob.svg')] [&>div:nth-child(odd)>span]:bg-[url('/assets/background/blob-reverse.svg')] *:odd:flex-row-reverse *:even:flex-row">
          {services.map((service, i) => (
            <div key={i} className="flex items-center w-full">
              <span className="relative h-[500px] min-w-1/2  bg-center bg-cover bg-no-repeat rounded-lg aspect-square ">
                <Image src={service.image} alt={service.title} fill />
              </span>
              <div className="flex flex-col w-1/2 gap-y-2 ">
                <h3 className="text-4xl font-semibold">{service.title}</h3>
                <p className="max-w-lg text-white/75">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
