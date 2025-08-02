"use client";
import { EyeIcon, PenBoxIcon, X } from "lucide-react";
import Image from "next/image";
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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteMenu } from "@/_actions/removeMenu";
import { updateMenuVisibility } from "@/_actions/updateMenu";
import { MenuData } from "@/_actions/createMenu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select";

function MenuItem({ menu }: { menu: MenuData }) {
  const router = useRouter();

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
            <label className="text-xs text-muted-foreground">Visibility:</label>
            <Select
              value={menu.status}
              onValueChange={(val) => handleVisibilityChange(menu.id, val)}
            >
              <SelectTrigger className="w-[120px] h-8 border text-xs text-muted-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-sm bg-background">
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
            <Button size="icon" variant="outline" className="p-1 rounded-md">
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
                  router.push(`/menus/create?id=${menu.id}&step=1`)
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
  );
}

export default MenuItem;
