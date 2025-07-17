import { Home, MenuSquareIcon, QrCode } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/_components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { NavUser } from "../ui/NavUser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/_lib/authOptions";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "My Menus", url: "/designs/menu", icon: MenuSquareIcon },
  { title: "My QR", url: "/qr", icon: QrCode },
];

export async function AppSidebar() {
  const session = await getServerSession(authOptions);

  return (
    <Sidebar>
      <SidebarContent className="text-primary flex flex-col justify-between h-full ml-4">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="relative min-h-20 justify-center gap-x-1.5 flex items-center w-full">
              <Image
                src="/assets/logo-cafe.svg"
                width={80}
                height={80}
                className="object-contain object-center"
                alt="QMenu logo"
                priority={true}
              />
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-y-3 mt-7">
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="transition-all duration-300 font-semibold"
                      asChild
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="mb-6">
          <NavUser user={session!.user} />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
