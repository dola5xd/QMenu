import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Landing/Button";

function JoinUs() {
  return (
    <section
      id="join"
      className="relative px-6 py-32 overflow-hidden text-white sm:px-12 md:px-20 bg-primary"
    >
      <div className="grid items-center max-w-6xl gap-12 mx-auto md:grid-cols-2">
        <div className="flex flex-col gap-y-6 ">
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
            Ready to digitize your menu?
          </h2>
          <p className="text-lg leading-relaxed ">
            Join QMenu and start creating beautiful, interactive menus for your
            café or restaurant. Generate QR codes, manage updates in real-time,
            and keep your brand consistent — all in minutes.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/register">
              <Button
                variants="custom"
                className="bg-background text-primary hover:bg-background/75"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variants="custom"
                className="bg-accent text-background hover:bg-accent/75"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>

        <div className="hidden md:block bg-[url('/assets/background/blob.svg')] bg-center bg-no-repeat bg-cover">
          <Image
            src="/assets/illustrations/Join Us/join.svg"
            alt="Join QMenu"
            width={500}
            height={500}
            className="w-full h-auto z-0"
          />
        </div>
      </div>
    </section>
  );
}

export default JoinUs;
