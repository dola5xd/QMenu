"use client";

import { MenuData } from "@/_actions/createMenu";
import { updateMenuVisibility } from "@/_actions/updateMenu";
import { useTransition, useState } from "react";
import { colord } from "colord";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/_components/ui/select";
import { Button } from "@/_components/ui/button";
import { PenBoxIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { ScrollArea } from "@/_components/ui/scroll-area";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";

interface Props {
  menu: MenuData;
  isOwner: boolean;
}

export default function MenuClient({ menu, isOwner }: Props) {
  const isDark = colord(menu.primaryColor).isDark();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [visibility, setVisibility] = useState<
    "public" | "private" | "archived"
  >(menu.status!);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      toast.loading("Updating menu visibility...");
      const res = await updateMenuVisibility(menu.id, visibility);
      if ("error" in res) {
        toast.dismiss();

        toast.error("Failed to update visibility");
      } else {
        toast.dismiss();
        toast.success("Visibility updated");
        router.refresh();
      }
    });
  };

  return (
    <main
      className="min-h-screen font-cairo"
      style={{
        backgroundColor: menu.primaryColor,
        color: isDark ? "#fff" : "#000",
        backgroundImage: `radial-gradient(circle at top left, ${menu.accentColor}100, transparent 70%)`,
      }}
    >
      {isOwner && (
        <form
          onSubmit={handleSubmit}
          className="w-full bg-black/10 backdrop-blur-sm border-b border-white/20 px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="visibility">Visibility:</label>
            <Select
              value={visibility}
              onValueChange={(value) =>
                setVisibility(value as "public" | "private" | "archived")
              }
            >
              <SelectTrigger className="w-[140px] dark:bg-secondary text-primary ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-secondary text-primary">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Confirm"}
            </Button>
          </div>

          <Link href={`/menus/create?id=${menu.id}&step=1`}>
            <Button variant="destructive">
              <PenBoxIcon className="w-4 h-4" /> Edit Menu
            </Button>
          </Link>
        </form>
      )}

      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-y-6 items-center">
        {menu.logo && (
          <div className="flex justify-center">
            <Image
              src={menu.logo}
              height={100}
              width={100}
              alt={`${menu.name} Logo`}
              className="object-contain aspect-square"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold text-center mb-10">{menu.name}</h1>

        <ScrollArea className="w-full max-h-[70vh] pr-2">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {menu.categories?.map((category) => (
              <div
                key={category.id}
                className="bg-white/5 p-4 rounded-lg shadow-md"
              >
                <h2
                  className="text-2xl font-semibold mb-4 text-center border-b pb-2"
                  style={{ borderColor: isDark ? `#ffff` : `#000` }}
                >
                  {category.name}
                </h2>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li
                      key={idx}
                      className={`flex justify-between ${
                        idx !== category.items.length - 1 ? "border-b" : ""
                      } pb-1`}
                      style={{ borderColor: isDark ? `#ffff` : `#000` }}
                    >
                      <span>{item.name}</span>
                      <span className="font-medium">{item.price} EGP</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
