"use client";
import { EyeIcon, PenBoxIcon, ScanEye, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_components/ui/dialog";
import { useState } from "react";
import { Badge } from "@/_components/ui/badge";

function MenuItem({ menu }: { menu: MenuData }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      newStatus as "public" | "private"
    );
    if ("error" in res) {
      toast.error(res.error ?? "");
    } else {
      toast.success(`Visibility updated to ${newStatus}`);
      setIsDialogOpen(false);
      router.refresh();
    }
  }

  return (
    <div
      key={menu.id}
      className="flex flex-col justify-between p-4 transition border rounded-lg shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 max-w-[70%] truncate">
          <Badge
            variant={
              menu.status === "public"
                ? "default"
                : menu.status === "private"
                ? "secondary"
                : "outline"
            }
            className="text-xs capitalize"
          >
            {menu.status === "public" ? "Public" : "Private"}
          </Badge>
          <h3 className="text-lg font-semibold truncate">{menu.name}</h3>
        </div>
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
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Last Edit:{" "}
            {menu.updatedAt
              ? new Date(menu.updatedAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Africa/Cairo",
                })
              : new Date(menu.createdAt!).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Africa/Cairo",
                })}
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

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger className="w-auto" asChild>
                  <DropdownMenuItem
                    className="text-primary bg-transparent w-auto"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <ScanEye className="w-4 h-4 mr-2" />
                    Change Visibility
                  </DropdownMenuItem>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Menu Visibility</DialogTitle>
                    <DialogDescription>
                      Select how you want customers to see this menu.
                    </DialogDescription>
                  </DialogHeader>

                  <Select
                    value={menu.status}
                    onValueChange={(val) =>
                      handleVisibilityChange(menu.id, val)
                    }
                  >
                    <SelectTrigger className="w-full h-9 border text-sm">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent className="text-sm bg-background">
                      <SelectItem value="public">
                        Public – Visible to anyone
                      </SelectItem>
                      <SelectItem value="private">
                        Private – Only you can see it
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </DialogContent>
              </Dialog>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={async () => handleRemoveMenu(menu.id)}
              variant="destructive"
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
