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
import Link from "next/link";
import { DBUser } from "@/_lib/authOptions";

function UserActions({ session }: { session: DBUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="w-12 h-12 ">
          <AvatarImage src={session.image || ""} />
          <AvatarFallback className="font-bold uppercase bg-primary text-secondary">
            {session.name?.split("").slice(0, 2).join("")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-background [&>div]:cursor-pointer">
        <DropdownMenuLabel>{session.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/designs">My Designs</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={async () => {
            await signOut();
          }}
          variant="destructive"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserActions;
