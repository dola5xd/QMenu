import { authOptions, DBUser } from "@/_lib/authOptions";
import { getServerSession } from "next-auth";
import { NavUser } from "./NavUser";
import { getUserByID } from "@/_utils/api";
import { redirect } from "next/navigation";

async function SidebarHeader() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const user: DBUser | null = await getUserByID(userId!);
  if (!user) redirect("/login");

  return (
    <header className="flex items-center justify-between px-10 py-4 border-b">
      <h1 className="text-2xl font-semibold">Menus</h1>
      <NavUser user={user!} />
    </header>
  );
}

export default SidebarHeader;
