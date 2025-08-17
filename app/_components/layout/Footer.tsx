import Link from "next/link";
import Waves from "../ui/Waves";
import { Button } from "../ui/button";
import FooterNav from "../ui/FooterNav";

type FooterProps = {
  footerText: {
    brand: { title: string; description: string };
    pages: string[];
    support: string[];
    startNow: { heading: string; description: string; button: string };
    copyright: string;
  };
};

function Footer({ footerText }: FooterProps) {
  return (
    <footer className="relative flex flex-col items-center justify-center px-6 pb-20 overflow-hidden text-sm pt-[120px] sm:pt-[180px] md:pt-[220px] lg:pt-[250px] xl:pt-[320px] bg-primary text-secondary sm:px-12 md:px-20">
      <Waves className="top-0 left-0 " />

      <div className="z-0 grid grid-cols-1 gap-10 mx-auto max-w-7xl sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col gap-y-3">
          <h3 className="text-2xl font-bold text-white">
            {footerText.brand.title}
          </h3>
          <p>{footerText.brand.description}</p>
        </div>

        <div className="flex flex-col gap-y-2">
          <h4 className="text-lg font-semibold text-white">Pages</h4>
          <FooterNav pages={footerText.pages} />
        </div>

        <div className="flex flex-col gap-y-2">
          <h4 className="text-lg font-semibold text-white">Support</h4>
          <ul className="flex flex-col gap-y-1 cursor-pointer hover:underline">
            {footerText.support.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">
            {footerText.startNow.heading}
          </h4>
          <p>{footerText.startNow.description}</p>
          <Link href="/register">
            <Button className="bg-secondary text-primary hover:bg-secondary/75">
              {footerText.startNow.button}
            </Button>
          </Link>
        </div>
      </div>

      <div className="z-0 pt-6 mt-12 text-xs text-center border-t border-muted text-white">
        &copy; {new Date().getFullYear()} {footerText.copyright}
      </div>
    </footer>
  );
}

export default Footer;
