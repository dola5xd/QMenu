import Link from "next/link";
import Logo from "../ui/Logo";
import { getServerSession } from "next-auth";
import { authOptions, DBUser } from "@/_lib/authOptions";
import { getUserByID } from "@/_utils/api";
import UserActions from "../ui/UserActions";
import { Button } from "../ui/button";

async function Header() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";

  const user: DBUser | null = await getUserByID(userId);

  return (
    <header className="flex flex-col items-center justify-between px-10 py-4 gap-y-4 lg:flex-row lg:px-20">
      <nav className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-y-4 w-full lg:w-2/3 lg:*:w-1/2">
        <div className="w-full lg:w-1/2 flex items-center justify-center gap-x-4">
          <Logo />
          <span className="lg:hidden h-full mt-auto">
            {user ? (
              <UserActions session={user} />
            ) : (
              <Link href={"/login"}>
                <Button variant="outline">Create Your First Menu</Button>
              </Link>
            )}
          </span>
        </div>
        <ul className="justify-center flex items-center gap-x-4 *:relative *:text-sm md:*:text-lg *:font-semibold *:cursor-pointer *:before:content-['']  *:before:absolute *:before:-bottom-1 *:before:left-0 *:before:bg-primary *:before:w-0 *:hover:before:w-full *:before:transition-all *:before:duration-500 *:before:h-1 *:before:rounded-full *:before:z-[-1]">
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
      <div className="hidden lg:flex items-center justify-end w-1/3 gap-x-4">
        <Link href={"#contact"}>
          <Button>Get in Touch</Button>
        </Link>
        {user ? (
          <UserActions session={user} />
        ) : (
          <Link href={"/login"}>
            <Button variant="outline">Create Your First Menu</Button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
