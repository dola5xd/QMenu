"use client";

import { motion } from "framer-motion";
import tinycolor from "tinycolor2";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Plus, Trash2Icon } from "lucide-react";
import { uploadToCloudinary } from "@/_lib/Cloudinary";
import { createMenu, MenuData } from "@/_actions/createMenu";
import { v4 as uuidv4 } from "uuid";

const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.string().min(1, "Price is required"),
});

const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  items: z
    .array(itemSchema)
    .min(1, "Each category must have at least one item"),
});

const schema = z.object({
  menuName: z.string().min(1, "Menu name is required"),
  primaryColor: z.string().min(1, "Primary color is required"),
  accentColor: z.string().min(1, "Accent color is required"),
  categories: z
    .array(categorySchema)
    .min(1, "At least one category is required"),
});

type FormData = z.infer<typeof schema>;

export default function LogoAndDetailsStep({
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
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      menuName: menu?.name || "",
      primaryColor: menu?.primaryColor || "#4e342e",
      accentColor: menu?.accentColor || "#ff7043",
      categories: menu?.categories || [],
    },
  });

  const {
    fields: categories,
    append,
    update,
    remove,
  } = useFieldArray({
    control,
    name: "categories",
  });

  const watchedName = watch("menuName");
  const primaryColor = watch("primaryColor");
  const isDark = tinycolor(primaryColor).isDark();

  useEffect(() => {
    if (logoFile) {
      const objectUrl = URL.createObjectURL(logoFile);
      setLogoPreview(objectUrl);
      setLogoError(null);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [logoFile]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    append({
      id: uuidv4(),
      name: newCategoryName.trim(),
      items: [{ name: "", price: "" }],
    });
    setNewCategoryName("");
  };

  const handleAddItem = (catIndex: number) => {
    const c = categories[catIndex];
    update(catIndex, { ...c, items: [...c.items, { name: "", price: "" }] });
  };

  const handleRemoveItem = (catIndex: number, itemIndex: number) => {
    const c = categories[catIndex];
    const newItems = c.items.filter((_, i) => i !== itemIndex);
    update(catIndex, { ...c, items: newItems });
  };

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in");
      router.push("/login");
      return;
    }

    if (!logoFile && !menu?.logo) {
      setLogoError("Logo is required");
      toast.error("Please upload a logo");
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
        name: data.menuName,
        categories: data.categories,
        status: "private",
      });

      if ("error" in res) {
        toast.error(res.error ?? "");
        return;
      }

      toast.success("Menu saved!");
      router.push(`/menus/create?id=${id}&step=2`);
    } catch (error) {
      console.error("Error:", error);
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
      className="flex flex-col w-full h-full gap-8 lg:grid lg:grid-cols-2 lg:gap-10"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center order-1 w-full gap-y-4 md:gap-y-6 lg:order-none"
      >
        <h1 className="text-2xl font-bold md:text-4xl">Menu Details</h1>
        <p className="mb-4 text-muted-foreground">
          Upload logo, pick colors, and create your menu
        </p>

        {/* Logo Upload & Color Pickers */}
        <div className="flex flex-col gap-y-4 lg:flex-row lg:items-start lg:gap-x-6">
          {/* Logo Upload */}
          <div className="flex flex-col flex-1 gap-2">
            <label className="text-sm font-medium text-primary">
              Upload Logo
            </label>
            <div className="relative flex items-center justify-center p-4 transition border-2 border-dashed rounded-lg cursor-pointer border-muted-foreground/30 hover:border-primary bg-muted">
              <input
                title="logo upload"
                id="logo-upload"
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
              <div className="text-sm text-muted-foreground">
                {logoFile?.name || "Click to upload or drag an image here"}
              </div>
            </div>
            {logoError && <p className="text-sm text-red-500">{logoError}</p>}
          </div>

          {/* Color Pickers */}
          <div className="flex flex-col flex-1 gap-y-4">
            <div className="flex items-center justify-between gap-x-4">
              <label className="text-xs font-medium sm:text-sm md:w-1/2">
                Primary Color
              </label>
              <Input
                type="color"
                className="w-16"
                {...register("primaryColor")}
              />
            </div>
            {errors.primaryColor && (
              <p className="text-sm text-red-500">
                {errors.primaryColor.message}
              </p>
            )}

            <div className="flex items-center justify-between gap-x-4">
              <label className="text-xs font-medium sm:text-sm md:w-1/2">
                Accent Color
              </label>
              <Input
                type="color"
                className="w-16"
                {...register("accentColor")}
              />
            </div>
            {errors.accentColor && (
              <p className="text-sm text-red-500">
                {errors.accentColor.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Menu Name</label>
          <Input {...register("menuName")} placeholder="e.g. Cafe Delight" />
          {errors.menuName && (
            <p className="text-sm text-red-500">{errors.menuName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-4">
          <label className="text-sm font-medium">Add Category</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Beverages"
              className="h-full"
            />
            <Button
              type="button"
              onClick={handleAddCategory}
              className="w-full sm:w-auto"
            >
              Add
            </Button>
          </div>
          {errors.categories && (
            <p className="mt-1 text-sm text-red-500">
              {errors.categories.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isUploading}
          className="self-end w-full mt-4 sm:w-auto"
        >
          {isUploading ? "Saving..." : "Continue to Preview"}
        </Button>
      </form>

      <ScrollArea
        className={`border rounded-lg w-full p-4 md:p-6 flex flex-col overflow-y-auto 
                min-h-[40vh] max-h-[60vh] sm:min-h-[50vh] sm:max-h-[80vh] transition-colors`}
        style={{ backgroundColor: primaryColor }}
      >
        <div className={`${isDark ? "text-white" : "text-black"}`}>
          {logoPreview ? (
            <div className="flex justify-center mb-4">
              <Image
                src={logoPreview}
                alt="Logo preview"
                width={100}
                height={100}
                className="object-contain rounded max-h-24"
              />
            </div>
          ) : (
            <p
              className={`text-sm text-center mb-4 ${
                isDark ? "text-gray-200" : "text-muted-foreground"
              }`}
            >
              Logo preview will appear here
            </p>
          )}
          <h2 className="mb-4 text-xl font-bold text-center">
            {watchedName || "Menu Name"}
          </h2>

          <div className="pr-2">
            {categories.map((cat, catIndex) => (
              <div key={cat.id} className="mb-4">
                <div
                  className={`flex justify-between items-center mb-2 border-b pb-1 ${
                    isDark ? "border-gray-400" : "border-gray-300"
                  }`}
                >
                  <h3 className="font-semibold">{cat.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className={isDark ? "text-white" : "text-black"}
                    onClick={() => remove(catIndex)}
                  >
                    <Trash2Icon size={16} />
                  </Button>
                </div>

                {cat.items.map((_, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Item name"
                      {...register(
                        `categories.${catIndex}.items.${itemIndex}.name`
                      )}
                      className={`${isDark ? "text-white" : ""}`}
                    />
                    <Input
                      placeholder="Price"
                      type="number"
                      {...register(
                        `categories.${catIndex}.items.${itemIndex}.price`
                      )}
                      className={`${isDark ? "text-white" : ""}`}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      className="text-red-500"
                      onClick={() => handleRemoveItem(catIndex, itemIndex)}
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant={isDark ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleAddItem(catIndex)}
                >
                  <Plus size={16} /> Add Item
                </Button>
              </div>
            ))}
          </div>

          <p
            className={`text-xs text-center italic mt-4 ${
              isDark ? "text-gray-300" : "text-muted-foreground"
            }`}
          >
            This is a live preview
          </p>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
