import Link from "next/link";
import RotatingText from "../ui/RotatingText";
import { Button } from "../ui/button";
import { isRTL } from "@/_lib/utils";

function Hero({ heroText }) {
  const isRTLText = isRTL(heroText.rotating.at(0));
  return (
    <section className="flex flex-col-reverse md:items-center md:justify-between w-full px-5 sm:px-10 md:px-20 py-4 gap-x-8 md:flex-row min-h-[50dvh] md:min-h-[70dvh] xl:min-h-[75dvh] justify-center">
      <div className="flex flex-col items-center justify-center w-full gap-y-7 ">
        <h1
          dir={isRTLText ? "rtl" : "ltr"}
          className="flex items-center gap-x-1.5 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
        >
          {heroText.headline}{" "}
          <RotatingText
            texts={heroText.rotating}
            mainClassName="leading-tight px-1 sm:px-2 md:px-3 bg-primary text-white overflow-hidden py-2 sm:py-1 md:py-2 min-h-fit justify-center rounded-lg"
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
        <p className="max-w-sm text-xs text-center sm:max-w-2xl sm:text-base lg:text-lg text-primary/75 ">
          {heroText.subtitle}
        </p>
        <Link href={"/login"} className="cursor-pointer">
          <Button variant="default" size={"lg"}>
            {heroText.cta}
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default Hero;
