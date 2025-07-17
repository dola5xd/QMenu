"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import QRCode from "react-qr-code";
import { CopyIcon, EyeIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import { publishMenu } from "@/_actions/publishMenu";
import { Category, MenuData, MenuItem } from "@/_actions/createMenu";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function ConfirmStep({
  id,
  menu,
}: {
  id: string;
  menu: MenuData | null;
}) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [status, setStatus] = useState(menu?.status || "public");
  const [publicLink, setPublicLink] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      setPublicLink(`${window.location.origin}/menu/${id}`);
    }
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicLink);
    toast.success("Link copied to clipboard!");
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    const res = await publishMenu(id, status);
    if ("error" in res) {
      toast.error(res.error!);
    } else {
      toast.success("Menu published!");
      router.push("/designs/menu");
    }
    setIsPublishing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col gap-y-4"
    >
      <h1 className="text-3xl font-bold">Step 3: Review & Publish</h1>
      <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: QR & Actions */}
        <div className="p-6 rounded-xl flex justify-center flex-col items-center bg-white gap-6 border shadow">
          <div className="flex flex-col items-center">
            <QRCode value={publicLink} size={150} />
            <p className="text-sm text-muted-foreground mt-2">
              Scan QR to view
            </p>
          </div>

          <div className="space-y-2 w-full">
            <label className="text-sm font-medium text-primary block">
              Visibility
            </label>
            <Select
              value={status}
              onValueChange={(value: "public" | "private" | "archived") =>
                setStatus(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full">
            <label className="text-sm font-medium text-primary block">
              Shareable Link
            </label>
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={handleCopy}>
                <CopyIcon size={16} className="mr-1" /> Copy
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => window.open(publicLink, "_blank")}
              >
                <EyeIcon size={16} className="mr-1" /> Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Live Menu Preview */}
        <ScrollArea
          className="rounded-xl shadow-lg border max-h-[500px] overflow-auto"
          style={{
            backgroundColor: menu?.primaryColor || "#ffffff",
            color: menu?.accentColor || "#000000",
          }}
        >
          <div className="relative rounded-t-xl flex flex-col gap-y-4">
            <div className="w-full flex flex-col gap-y-8 py-4" />
            {menu?.logo && (
              <div className="flex justify-center">
                <Image src={menu.logo} alt="Logo" width={100} height={100} />
              </div>
            )}
            <h2 className="text-2xl font-bold text-center">{menu?.name}</h2>
          </div>

          <div className="px-6 pb-6 space-y-8">
            {menu?.categories?.map((cat: Category) => (
              <div key={cat.id}>
                <h3 className="font-semibold text-xl border-b border-white/20 pb-2 mb-3 uppercase tracking-wide">
                  {cat.name}
                </h3>
                <ul className="space-y-2">
                  {cat.items.map((item: MenuItem, idx: number) => (
                    <li
                      key={idx}
                      className="flex justify-between text-sm border-b border-white/10 py-1"
                    >
                      <span>{item.name}</span>
                      <span>{item.price} EGP</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push(`/menus/create?id=${id}&step=2`)}
        >
          Back to Step 2
        </Button>

        <Button
          disabled={isPublishing}
          onClick={handlePublish}
          className="bg-accent text-white"
        >
          {isPublishing ? "Publishing..." : "Publish Menu"}
        </Button>
      </div>
    </motion.div>
  );
}
