import Image from "next/image";
import Link from "next/link";

function Logo({
  variants = "dark",
  className = "",
}: {
  variants?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={"/"}
      className={`relative h-10 w-10 sm:w-auto sm:h-20 sm:aspect-[9/8] ${className}`}
    >
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
