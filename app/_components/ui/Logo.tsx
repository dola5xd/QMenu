import Image from "next/image";
import Link from "next/link";

function Logo({ variants = "dark" }: { variants?: "dark" | "light" }) {
  return (
    <Link href={"/"} className="relative h-20 aspect-[9/8]">
      <Image
        src={
          variants === "dark"
            ? "/assets/logo-cafe.svg"
            : "/assets/logo-light.png"
        }
        fill
        sizes="400px 400px"
        className="object-contain object-left"
        alt="QMenu logo"
        priority={true}
      />
    </Link>
  );
}

export default Logo;
