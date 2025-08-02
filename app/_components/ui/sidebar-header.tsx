import { authOptions } from "@/_lib/authOptions";
import { getServerSession } from "next-auth";
import { NavUser } from "./NavUser";

async function SidebarHeader() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <header className="px-10 py-4 border-b flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Menus</h1>
      <NavUser user={user!} />
    </header>
  );
}

export default SidebarHeader;
