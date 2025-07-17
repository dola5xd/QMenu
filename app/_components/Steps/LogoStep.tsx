"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "@/_lib/Cloudinary";
import { createMenu, MenuData } from "@/_actions/createMenu";

const schema = z.object({
  primaryColor: z.string().min(1, "Primary color is required"),
  accentColor: z.string().min(1, "Accent color is required"),
});

type FormData = z.infer<typeof schema>;

export default function LogoStep({
  id,
  menu,
}: {
  id: string;
  menu: MenuData | null;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    menu?.logo || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      primaryColor: menu?.primaryColor || "#4e342e",
      accentColor: menu?.accentColor || "#ff7043",
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (menu?.primaryColor) setValue("primaryColor", menu.primaryColor);
    if (menu?.accentColor) setValue("accentColor", menu.accentColor);
  }, [menu, setValue]);

  useEffect(() => {
    if (logoFile) {
      const objectUrl = URL.createObjectURL(logoFile);
      setLogoPreview(objectUrl);
      setLogoError(null);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [logoFile]);

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in");
      return;
    }

    if (!logoFile && !menu?.logo) {
      setLogoError("Logo is required");
      toast.error("Please upload a logo before continuing");
      return;
    }

    setIsUploading(true);

    try {
      let logoUrl = menu?.logo || null;

      if (logoFile) {
        logoUrl = await uploadToCloudinary(logoFile);
      }

      const res = await createMenu({
        ...menu,
        id,
        logo: logoUrl,
        primaryColor: data.primaryColor,
        accentColor: data.accentColor,
        userId: session.user.id,
      });

      if ("error" in res) {
        toast.error(res.error!);
        return;
      }

      toast.success("Menu saved!");
      router.push(`/menus/create?id=${id}&step=2`);
    } catch (err) {
      console.error("Upload or save failed:", err);
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-full"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-7 h-full justify-center"
      >
        <div className="flex flex-col gap-y-1.5">
          <h1 className="text-4xl font-bold">Step 1</h1>
          <p className="text-muted-foreground">
            Choose your brand logo and colors
          </p>
        </div>

        {/* Logo Upload */}
        <div className="flex flex-col gap-y-1.5">
          <label className="text-sm font-medium text-primary">
            Upload Logo
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setLogoFile(file || null);
            }}
          />
          {logoError && <p className="text-sm text-red-500">{logoError}</p>}
        </div>

        {/* Primary Color */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-primary">
            Primary Color
          </label>
          <Input type="color" className="w-1/6" {...register("primaryColor")} />
        </div>
        {errors.primaryColor && (
          <p className="text-sm text-red-500">{errors.primaryColor.message}</p>
        )}

        {/* Accent Color */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-primary">
            Accent Color
          </label>
          <Input type="color" className="w-1/6" {...register("accentColor")} />
        </div>
        {errors.accentColor && (
          <p className="text-sm text-red-500">{errors.accentColor.message}</p>
        )}

        <Button
          className="mt-6 py-4 self-end cursor-pointer"
          type="submit"
          disabled={isUploading}
        >
          {isUploading ? "Saving..." : "Continue to Step 2"}
        </Button>
      </form>

      {/* Right: Preview */}
      <div className="border rounded-lg p-6 bg-muted flex items-center justify-center min-h-[200px]">
        {logoPreview ? (
          <Image
            src={logoPreview}
            alt="Logo preview"
            width={160}
            height={160}
            className="object-contain rounded max-h-40"
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Logo preview will appear here
          </p>
        )}
      </div>
    </motion.div>
  );
}
