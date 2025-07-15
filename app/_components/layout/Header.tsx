import Link from "next/link";
import Logo from "../ui/Logo";
import Button from "../ui/Landing/Button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import UserActions from "../ui/UserActions";

async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex items-center justify-between px-20 py-4">
      <nav className="flex items-center justify-between w-2/3 *:w-1/2">
        <Logo />
        <ul className="justify-center flex items-center gap-x-4 *:relative *:text-lg *:font-semibold *:cursor-pointer *:before:content-['']  *:before:absolute *:before:-bottom-1 *:before:left-0 *:before:bg-primary *:before:w-0 *:hover:before:w-full *:before:transition-all *:before:duration-500 *:before:h-1 *:before:rounded-full *:before:z-[-1]">
          <li>
            <Link href={"#about"}>About Us</Link>
          </li>
          <li>
            <Link href={"#sevices"}>Services</Link>
          </li>
          <li>
            <Link href={"#join"}>Join Us</Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center justify-end w-1/3 gap-x-4">
        <Link href={"#contact"}>
          <Button>Get in Touch</Button>
        </Link>
        {session?.user ? (
          <UserActions session={session} />
        ) : (
          <Link href={"/login"}>
            <Button variants="secondary">Create Your First Menu</Button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
