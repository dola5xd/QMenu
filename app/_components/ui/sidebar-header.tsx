import { authOptions } from "@/_lib/authOptions";
import { getServerSession } from "next-auth";
import { NavUser } from "./NavUser";
import CurrentPageHead from "./CurrentPageHead";

async function SidebarHeader() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <header className="px-10 py-4 border-b flex items-center justify-between">
      <CurrentPageHead />
      <div>
        <NavUser user={user!} />
      </div>
    </header>
  );
}

export default SidebarHeader;
