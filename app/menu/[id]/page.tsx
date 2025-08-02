import { getMenu } from "@/_actions/getMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_lib/authOptions";
import { redirect } from "next/navigation";
import { MenuData } from "@/_actions/createMenu";
import MenuClient from "./_components/MenuClient";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const id = (await params).id;
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const res = await getMenu(id);
  if ("error" in res || !res.data) {
    redirect("/");
  }

  const menu: MenuData = res.data;
  const isOwner = currentUserId === menu.userId;

  if (menu.status !== "public" && !isOwner) {
    redirect("/");
  }

  return <MenuClient menu={menu} isOwner={isOwner} />;
}
