import Link from "next/link";
import Logo from "../ui/Logo";
import { getServerSession } from "next-auth";
import { authOptions, DBUser } from "@/_lib/authOptions";
import { getUserByID } from "@/_utils/api";
import UserActions from "../ui/UserActions";
import { Button } from "../ui/button";
import NavLinks from "../ui/NavLinks";
import ContactButton from "../ui/ContactButton";

type HeaderProps = {
  lang: "en" | "ar";
  headerText: {
    nav: string[];
    buttons: {
      create: string;
      contact: string;
    };
  };
};

async function Header({ lang = "en", headerText }: HeaderProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";
  const user: DBUser | null = await getUserByID(userId);

  const switchTo = lang === "ar" ? "en" : "ar";

  return (
    <header className="flex flex-col items-center justify-between px-10 py-4 gap-y-4 lg:flex-row lg:px-20">
      <nav className="flex flex-col items-center justify-center w-full lg:flex-row lg:justify-between gap-y-4 lg:w-2/3 ">
        <div className="flex items-center justify-center w-full lg:w-10 lg:max-w-1/4 gap-x-4">
          <Logo />
          <span className="h-full mt-auto lg:hidden">
            {user ? (
              <UserActions session={user} />
            ) : (
              <Link href={"/login"}>
                <Button variant="outline">{headerText.buttons.create}</Button>
              </Link>
            )}
          </span>
        </div>

        <NavLinks nav={headerText.nav} />
      </nav>

      <div className="items-center justify-end hidden w-1/3 lg:flex gap-x-4">
        <Link href={`/${switchTo}`}>
          <Button variant="link">
            {lang === "en" ? "العربية" : "English"}
          </Button>
        </Link>
        <ContactButton text={headerText.buttons.contact} />
        {user ? (
          <UserActions session={user} />
        ) : (
          <Link href={"/login"}>
            <Button variant="outline">{headerText.buttons.create}</Button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
