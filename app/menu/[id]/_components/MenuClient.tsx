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
import { EyeClosed, EyeIcon, PenBoxIcon } from "lucide-react";
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
  const [showAdminSettings, setAdminSettings] = useState<boolean>(isOwner);
  const [visibility, setVisibility] = useState<"public" | "private">(
    menu.status!
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      toast.loading("Updating menu visibility...");
      const res = await updateMenuVisibility(menu.id, visibility);
      toast.dismiss();
      if ("error" in res) {
        toast.error("Failed to update visibility");
      } else {
        toast.success("Visibility updated");
        router.refresh();
      }
    });
  };

  return (
    <main
      className="flex flex-col h-full min-h-screen font-cairo"
      style={{
        backgroundColor: menu.primaryColor,
        color: isDark ? "#fff" : "#000",
        backgroundImage: `radial-gradient(circle at top left, ${menu.accentColor}66, transparent 70%)`,
      }}
    >
      {showAdminSettings && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start justify-between w-full gap-3 px-4 text-sm transition-all duration-500 border-b py-7 bg-black/10 backdrop-blur-sm border-white/20 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <Button
            size={"icon"}
            variant={"secondary"}
            onClick={() => setAdminSettings((pre) => !pre)}
            className="absolute right-6 top-3"
          >
            <EyeClosed />
          </Button>
          <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center sm:w-auto">
            <label htmlFor="visibility" className="whitespace-nowrap">
              Visibility:
            </label>
            <Select
              value={visibility}
              onValueChange={(value) =>
                setVisibility(value as "public" | "private")
              }
            >
              <SelectTrigger className="w-full sm:w-[140px] dark:bg-secondary text-primary ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-secondary text-primary">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
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

          <Link
            href={`/menus/create?id=${menu.id}&step=1`}
            className="w-full sm:w-auto"
          >
            <Button
              variant="destructive"
              className="justify-center w-full sm:w-auto"
            >
              <PenBoxIcon className="w-4 h-4 mr-1" /> Edit Menu
            </Button>
          </Link>
        </form>
      )}
      {isOwner && !showAdminSettings && (
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => setAdminSettings((pre) => !pre)}
          className="absolute transition-all duration-500 right-4 top-3"
        >
          <EyeIcon />
        </Button>
      )}
      <section className="flex flex-col items-center flex-grow w-3/4 h-full px-4 py-8 mx-auto gap-y-6">
        {menu.logo && (
          <div className="flex justify-center mb-4">
            <Image
              src={menu.logo}
              height={80}
              width={80}
              alt={`${menu.name} Logo`}
              className="object-contain aspect-square"
            />
          </div>
        )}

        <h1 className="mb-6 text-3xl font-bold text-center sm:text-4xl">
          {menu.name}
        </h1>

        <ScrollArea className="w-full max-h-full sm:max-h-[70vh] pr-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {menu.categories?.map((category) => (
              <div
                key={category.id}
                className="p-4 rounded-lg shadow-inner bg-white/10"
              >
                <h2
                  className="pb-2 mb-3 text-lg font-semibold text-center border-b sm:text-2xl"
                  style={{ borderColor: isDark ? "#ffffff56" : "#00000056" }}
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
                      style={{
                        borderColor: isDark ? "#ffffff56" : "#00000056",
                      }}
                    >
                      <span className="truncate">{item.name}</span>
                      <span className="font-medium">{item.price} EGP</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </section>
    </main>
  );
}
