"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select";
import { Toggle } from "./toggle";
import { EyeIcon, Grid2X2Icon, ListIcon, PenBoxIcon, X } from "lucide-react";
import { MenuData } from "@/_actions/createMenu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CreateMenuDialog from "../designs/DesignSelection";
import { Button } from "./button";
import Link from "next/link";
import toast from "react-hot-toast";
import { deleteMenu } from "@/_actions/removeMenu";

interface Props {
  menus: MenuData[];
}

export default function FiltersBar({ menus }: Props) {
  const router = useRouter();
  const [visibility, setVisibility] = useState<string>();
  const [sort, setSort] = useState<string>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredMenus, setFilteredMenus] = useState<MenuData[]>(menus);

  useEffect(() => {
    let filtered = [...menus];

    if (visibility) {
      filtered = filtered.filter((m) => m.status === visibility);
    }

    if (sort) {
      filtered.sort((a, b) => {
        const aTime = a.createdAt!;
        const bTime = b.createdAt!;
        switch (sort) {
          case "newest":
            return bTime - aTime;
          case "oldest":
            return aTime - bTime;
          case "name_asc":
            return a.name!.localeCompare(b.name!);
          case "name_desc":
            return b.name!.localeCompare(a.name!);
          default:
            return 0;
        }
      });
    }

    setFilteredMenus(filtered);
  }, [visibility, sort, menus]);

  async function handleRemoveMenu(id: string) {
    const res = await deleteMenu(id);

    if ("error" in res) {
      toast.error(res.error!);
    } else {
      toast.success("Menu deleted successfully");
      router.refresh();
    }
  }
  return (
    <>
      <section className="flex items-center justify-between py-4 pr-10">
        <div className="flex items-center gap-8">
          {/* Visibility Filter */}
          <div className="flex items-center gap-x-2">
            <label
              htmlFor="visibility"
              className="text-sm font-medium text-primary"
            >
              Filter by Visibility
            </label>
            <Select onValueChange={(val) => setVisibility(val)}>
              <SelectTrigger
                id="visibility"
                className="w-[180px] border border-primary text-primary"
              >
                <SelectValue placeholder="Select Visibility" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-x-2">
            <label htmlFor="sort" className="text-sm font-medium text-primary">
              Sort by
            </label>
            <Select onValueChange={(val) => setSort(val)}>
              <SelectTrigger
                id="sort"
                className="w-[180px] border border-primary text-primary"
              >
                <SelectValue placeholder="Select Sort" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-2">
          <Toggle
            variant={"outline"}
            pressed={viewMode === "grid"}
            onPressedChange={() => setViewMode("grid")}
          >
            <Grid2X2Icon />
          </Toggle>
          <Toggle
            variant={"outline"}
            pressed={viewMode === "list"}
            onPressedChange={() => setViewMode("list")}
          >
            <ListIcon />
          </Toggle>
        </div>
      </section>

      {/* Menu Grid/List View */}
      <section
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "flex flex-col gap-6"
        } min-h-[200px]`}
      >
        {filteredMenus.length === 0 ? (
          <p className="flex flex-col items-center gap-y-2 text-2xl mt-auto col-span-full text-center text-muted-foreground">
            No Menus found. <CreateMenuDialog />
          </p>
        ) : (
          filteredMenus.map((menu) => (
            <div
              key={menu.id}
              className="flex flex-col rounded-lg border p-4 shadow ring ring-dark/5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{menu.name}</h3>
                <Image
                  src={menu.logo!}
                  height={100}
                  width={100}
                  alt={menu.name!}
                  className="object-contain aspect-square"
                />
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {menu.status}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last Edit:{" "}
                    {menu.createdAt
                      ? new Date(menu.updatedAt!).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "Africa/Cairo",
                        })
                      : "Unknown"}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <Link href={`/menu/${menu.id}`}>
                    <Button title="visit" variant={"default"} size={"icon"}>
                      <EyeIcon />
                    </Button>
                  </Link>
                  <Link href={`/menus/create?id=${menu.id}&step=2`}>
                    <Button title="edit" variant={"default"} size={"icon"}>
                      <PenBoxIcon />
                    </Button>
                  </Link>

                  <Button
                    title="remove"
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => handleRemoveMenu(menu.id)}
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
