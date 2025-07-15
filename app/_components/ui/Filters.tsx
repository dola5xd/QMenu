"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/_components/ui/select";
import { Grid2X2Icon, ListIcon } from "lucide-react";
import { Toggle } from "./toggle";
import { useState } from "react";

export default function FiltersBar() {
  const [visibility, setVisibility] = useState<string | undefined>();
  const [sort, setSort] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <section
      title="filters"
      className="flex items-center justify-between py-4 pr-10"
    >
      {/* Filters */}
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

      {/* View Mode Toggle */}
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
  );
}
