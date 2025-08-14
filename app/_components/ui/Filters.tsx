"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select";
import { MenuData } from "@/_actions/createMenu";
import MenuItem from "./MenuItem";

interface Props {
  menus: MenuData[];
}

export default function FiltersBar({ menus }: Props) {
  const [visibility, setVisibility] = useState<string>();
  const [sort, setSort] = useState<string>();
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

  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4 px-2 py-4 sm:px-4 md:px-8">
        <div className="flex items-center gap-6 md:flex-wrap">
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
              </SelectContent>
            </Select>
          </div>

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
      </section>

      <section
        className={`min-h-[200px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}
      >
        {filteredMenus.length === 0 ? (
          <p className="py-10 text-lg text-center col-span-full text-muted-foreground">
            No menus found.
          </p>
        ) : (
          filteredMenus.map((menu) => <MenuItem menu={menu} key={menu.id} />)
        )}
      </section>
    </>
  );
}
