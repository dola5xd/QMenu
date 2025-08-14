import { getServerSession } from "next-auth";
import { getMenusByUser } from "@/_actions/getMenus";
import { MenuData } from "@/_actions/createMenu";
import FiltersBar from "@/_components/ui/Filters";
import CreateMenuDialog from "@/_components/designs/DesignSelection";
import { authOptions } from "@/_lib/authOptions";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let menus: MenuData[] = [];

  if (userId) {
    const result = await getMenusByUser(userId);
    if ("data" in result) {
      menus = result.data;
    } else {
      console.error("Error fetching menus:", result.error);
      throw new Error(result.error);
    }
  }

  return (
    <section className="px-4 md:px-5 lg:px-10 py-2">
      <header className="flex items-center justify-between md:pr-10">
        <h2 className="text-xl font-semibold">Your Menus</h2>
        <CreateMenuDialog />
      </header>

      <FiltersBar menus={menus} />
    </section>
  );
}
