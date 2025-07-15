import Link from "next/link";
import Button from "../ui/Landing/Button";
import RotatingText from "../ui/RotatingText";

function Hero() {
  return (
    <section className="flex flex-col-reverse items-center justify-between w-full px-20 py-4 gap-x-8 md:flex-row min-h-[75dvh]">
      <div className="flex flex-col items-center justify-center gap-y-7 md:w-full ">
        <h1 className="flex items-center gap-x-1.5 text-5xl font-bold text-nowrap">
          Let&apos;s{" "}
          <RotatingText
            texts={[
              "Create your menu.",
              "Brand your menu.",
              "Customize your menu.",
              "Generate a QR code.",
              "Share your menu.",
            ]}
            mainClassName="leading-tight px-2 sm:px-2 md:px-3 bg-primary text-white overflow-hidden py-0.5 sm:py-1 md:py-2 min-h-fit justify-center rounded-lg"
            staggerFrom={"first"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={4000}
          />
        </h1>
        <p className="max-w-2xl text-lg text-center text-primary/75 ">
          Design stunning, fully branded digital menus and generate QR codes for
          your café, restaurant, or food business all in just a few minutes, no
          technical skills needed.
        </p>
        <Link href={"/login"} className="cursor-pointer">
          <Button variants="primary">Start Now – It’s Free</Button>
        </Link>
      </div>
    </section>
  );
}

export default Hero;
