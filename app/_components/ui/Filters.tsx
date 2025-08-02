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
import toast from "react-hot-toast";
import { deleteMenu } from "@/_actions/removeMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "./button";
import { updateMenuVisibility } from "@/_actions/updateMenu";

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

  async function handleVisibilityChange(id: string, newStatus: string) {
    const res = await updateMenuVisibility(
      id,
      newStatus as "public" | "private" | "archived"
    );
    if ("error" in res) {
      toast.error(res.error ?? "");
    } else {
      toast.success(`Visibility updated to ${newStatus}`);
      router.refresh();
    }
  }

  return (
    <>
      {/* Filter Bar */}
      <section className="flex flex-wrap items-center justify-between gap-4 px-2 py-4 sm:px-4 md:px-8">
        <div className="flex flex-wrap items-center gap-6">
          {/* Visibility Filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="visibility"
              className="text-sm font-medium text-primary"
            >
              Visibility
            </label>
            <Select
              value={visibility ?? "all"}
              onValueChange={(val) =>
                setVisibility(val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-[160px] border text-primary">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-primary">
              Sort
            </label>
            <Select onValueChange={(val) => setSort(val)}>
              <SelectTrigger className="w-[160px] border text-primary">
                <SelectValue placeholder="By Date/Name" />
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

        {/* View Toggle */}
        <div className="flex gap-2">
          <Toggle
            variant="outline"
            pressed={viewMode === "grid"}
            onPressedChange={() => setViewMode("grid")}
          >
            <Grid2X2Icon className="w-4 h-4" />
          </Toggle>
          <Toggle
            variant="outline"
            pressed={viewMode === "list"}
            onPressedChange={() => setViewMode("list")}
          >
            <ListIcon className="w-4 h-4" />
          </Toggle>
        </div>
      </section>

      {/* Menu Display */}
      <section
        className={`min-h-[200px] ${
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4 justify-center w-1/2 mx-auto"
        }`}
      >
        {filteredMenus.length === 0 ? (
          <p className="py-10 text-lg text-center col-span-full text-muted-foreground">
            No menus found.
          </p>
        ) : (
          filteredMenus.map((menu) => (
            <div
              key={menu.id}
              className="flex flex-col justify-between p-4 transition border rounded-lg shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-lg font-semibold truncate max-w-[70%]">
                  {menu.name}
                </h3>
                {menu.logo && (
                  <Image
                    src={menu.logo}
                    alt={menu.name ?? ""}
                    width={60}
                    height={60}
                    className="object-contain rounded-md aspect-square"
                  />
                )}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">
                      Visibility:
                    </label>
                    <Select
                      value={menu.status}
                      onValueChange={(val) =>
                        handleVisibilityChange(menu.id, val)
                      }
                    >
                      <SelectTrigger className="w-[120px] h-8 border text-xs text-muted-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background text-sm">
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last Edit:{" "}
                    {menu.updatedAt
                      ? new Date(menu.updatedAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "Africa/Cairo",
                        })
                      : "Unknown"}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="p-1 rounded-md"
                    >
                      <BsThreeDotsVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    className="bg-background"
                    sideOffset={4}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onSelect={() => router.push(`/menu/${menu.id}`)}
                      >
                        <EyeIcon className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          router.push(`/menus/create?id=${menu.id}&step=2`)
                        }
                      >
                        <PenBoxIcon className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={async () => handleRemoveMenu(menu.id)}
                      className="text-destructive"
                    >
                      <X className="w-4 h-4 mr-2 text-destructive" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
