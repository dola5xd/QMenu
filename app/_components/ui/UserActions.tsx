"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import Link from "next/link";

function UserActions({ session }: { session: Session }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-12 w-12 ">
          <AvatarImage src={session.user.image || ""} />
          <AvatarFallback className="bg-primary text-secondary uppercase font-bold">
            {session.user.name?.split("").slice(0, 2).join("")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-background [&>div]:cursor-pointer">
        <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/designs">My Designs</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={async () => {
            await signOut();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserActions;
