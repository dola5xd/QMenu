import { getServerSession } from "next-auth";
import { getMenusByUser } from "@/_actions/getMenus";
import { MenuData } from "@/_actions/createMenu";
import FiltersBar from "@/_components/ui/Filters";
import { authOptions } from "@/_lib/authOptions";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/_components/ui/button";
import { redirect } from "next/navigation";

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

  const handleSelect = () => {
    const randomId = uuidv4();
    redirect(`/menus/create?id=${randomId}`);
  };
  return (
    <section className="px-4 py-2 md:px-5 lg:px-10">
      <header className="flex items-center justify-between md:pr-10">
        <h2 className="text-xl font-semibold">Your Menus</h2>
        <Button className="w-fit" onClick={() => handleSelect()}>
          Create new <Plus size={18} />
        </Button>{" "}
      </header>

      <FiltersBar menus={menus} />
    </section>
  );
}
