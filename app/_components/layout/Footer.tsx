import Link from "next/link";
import Waves from "../ui/Waves";
import Button from "../ui/Landing/Button";

function Footer() {
  return (
    <footer className="relative flex flex-col items-center justify-center overflow-hiddenS px-6 pt-44 pb-20 overflow-x-hidden text-sm bg-primary text-secondary sm:px-12 md:px-20">
      <Waves className="absolute inset-0 h-screen overflow-hidden" />
      <div className="z-0 grid grid-cols-1 gap-10 mx-auto max-w-7xl sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col gap-y-3">
          <h3 className="text-xl font-bold text-white">QMenu</h3>
          <p>Simple QR menus for modern cafés and restaurants.</p>
        </div>

        <div className="flex flex-col gap-y-2">
          <h4 className="font-semibold text-white text-lg">Pages</h4>
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
          <h4 className="font-semibold text-white text-lg">Support</h4>
          <ul className="flex flex-col gap-y-1 *:cursor-pointer *:hover:underline">
            <li>FAQs</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-white text-lg">Start Now</h4>
          <p>Sign up and build your first digital menu today.</p>
          <Link href="/register">
            <Button
              variants="custom"
              className="bg-secondary text-primary hover:bg-secondary/75"
            >
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
