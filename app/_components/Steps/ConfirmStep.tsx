"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import QRCode from "react-qr-code";
import { CopyIcon, EyeIcon, DownloadIcon } from "lucide-react";
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
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { uploadToCloudinary } from "@/_lib/Cloudinary";
import { colord } from "colord";

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
  const qrRef = useRef<HTMLDivElement>(null);
  const isDark = colord(menu?.primaryColor || "#ffffff").isDark();
  const readableTextColor = isDark ? "#ffffff" : "#000000";
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
    if (!qrRef.current || !menu?.id || !menu?.name) return;

    try {
      toast.loading("Publishing menu...");
      setIsPublishing(true);

      const dataUrl = await toPng(qrRef.current, { pixelRatio: 2 });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const pngFile = new File([blob], `${menu.name}-qr.png`, {
        type: "image/png",
      });

      const [cloudinaryUrl] = await Promise.all([
        uploadToCloudinary(pngFile),
        new Promise((resolve) => setTimeout(resolve, 50)),
      ]);

      const result = await publishMenu(menu.id, "public", cloudinaryUrl);

      if (result.success) {
        toast.dismiss();
        toast.success("Menu published and QR uploaded!");
        router.push("/designs");
      } else {
        toast.dismiss();
        toast.error("Failed to publish menu");
      }
    } catch (err) {
      console.error("Publish error:", err);
      toast.dismiss();
      toast.error("An error occurred while publishing");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!qrRef.current) return;

    const element = qrRef.current;
    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const dataUrl = await toPng(element, {
      pixelRatio: 4,
      backgroundColor: menu?.primaryColor || "#ffffff",
    });
    const pdf = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "pt",
      format: [width, height],
    });

    pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
    pdf.save(`${menu?.name || "menu"}-qr.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full gap-y-4"
    >
      <h1 className="text-3xl font-bold">Step 3: Review & Publish</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 h-full">
        <div className="flex flex-col items-center justify-center gap-6 p-6 bg-white/25 border shadow-md rounded-xl max-h-[600px]">
          <div
            ref={qrRef}
            className="flex flex-col items-center w-full max-w-xs p-4 space-y-4 border shadow-md rounded-xl"
            style={{
              backgroundColor: menu?.primaryColor || "#ffffff",
              color: readableTextColor,
            }}
          >
            {menu?.logo && (
              <Image
                src={menu.logo}
                alt="Menu Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            )}
            {menu?.name && (
              <h3 className="text-lg font-semibold text-center">{menu.name}</h3>
            )}
            <div className="p-2 bg-white border rounded-md">
              <QRCode value={publicLink} size={100} />
            </div>
            <p className="text-xs text-muted-foreground">
              Scan QR to view menu
            </p>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-2">
              <label className="block text-sm font-medium text-primary">
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
            <Button onClick={handleDownloadPDF}>
              <DownloadIcon className="w-4 h-4 mr-2" /> Download as PDF
            </Button>
          </div>

          <div className="flex items-center justify-between w-full">
            <label className="block text-sm font-medium text-primary">
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

        <ScrollArea
          className="rounded-xl shadow-lg border max-h-[500px]"
          style={{
            backgroundColor: menu?.primaryColor || "#ffffff",
            color: readableTextColor,
          }}
        >
          <div className="relative flex flex-col rounded-t-xl gap-y-4">
            <div className="flex flex-col w-full py-4 gap-y-8" />
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
                <h3 className="pb-2 mb-3 text-xl font-semibold tracking-wide uppercase border-b border-white/20">
                  {cat.name}
                </h3>
                <ul className="space-y-2">
                  {cat.items.map((item: MenuItem, idx: number) => (
                    <li
                      key={idx}
                      className="flex justify-between py-1 text-sm border-b border-white/10"
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

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push(`/menus/create?id=${id}&step=1`)}
        >
          Back to Edit
        </Button>
        <Button
          disabled={isPublishing}
          onClick={handlePublish}
          className="text-white bg-primary"
        >
          {isPublishing ? "Publishing..." : "Publish Menu"}
        </Button>
      </div>
    </motion.div>
  );
}
