import Link from "next/link";
import Waves from "../ui/Waves";
import { Button } from "../ui/button";

function Footer() {
  return (
    <footer className="relative flex flex-col items-center justify-center px-6 pb-20 overflow-hidden text-sm pt-[120px] sm:pt-[180px] md:pt-[220px] lg:pt-[250px] xl:pt-[320px] bg-primary text-secondary sm:px-12 md:px-20">
      <Waves className="top-0 left-0 " />

      {/* <Waves className="inset-0 -top-[75%] sm:-top-[40%] md:top-0 lg:top-0 lg:absolute lg:h-screen" /> */}
      <div className="z-0 grid grid-cols-1 gap-10 mx-auto max-w-7xl sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col gap-y-3">
          <h3 className="text-2xl font-bold text-white">QMenu</h3>
          <p>Simple QR menus for modern cafés and restaurants.</p>
        </div>

        <div className="flex flex-col gap-y-2">
          <h4 className="text-lg font-semibold text-white">Pages</h4>
          <ul className="flex flex-col gap-y-1 *:cursor-pointer *:hover:underline">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="#about">About</Link>
            </li>
            <li>
              <Link href="#services">Services</Link>
            </li>
            <li>
              <Link href="#join">Join Us</Link>
            </li>
            <li>
              <Link href="#contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-y-2">
          <h4 className="text-lg font-semibold text-white">Support</h4>
          <ul className="flex flex-col gap-y-1 *:cursor-pointer *:hover:underline">
            <li>FAQs</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">Start Now</h4>
          <p>Sign up and build your first digital menu today.</p>
          <Link href="/register">
            <Button className="bg-secondary text-primary hover:bg-secondary/75">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      <div className="z-0 pt-6 mt-12 text-xs text-center border-t -foreground border-muted">
        &copy; {new Date().getFullYear()} QMenu. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
