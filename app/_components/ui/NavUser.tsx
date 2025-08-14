"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { LogOut, MenuSquareIcon, UserCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"secondary"}
          className="py-7 bg-transparent data-[state=open]:bg-primary/25 data-[state=open]:text-primary"
        >
          <Avatar className="h-8 w-8 rounded-lg ">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="rounded-lg bg-secondary">
              {user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <BsThreeDotsVertical className="hidden md:block ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg text-primary data-[state=open]:bg-background"
        side={"bottom"}
        align={"end"}
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback className="rounded-lg bg-secondary">
                {user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push("/designs")}>
          <MenuSquareIcon />
          Designs
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push("/account")}>
          <UserCircle />
          Account
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={async () => {
            await signOut();
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
