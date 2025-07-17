"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2Icon, Plus } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { createMenu, MenuData } from "@/_actions/createMenu";

// Validation schema
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
  categories: z
    .array(categorySchema)
    .min(1, "At least one category is required"),
});

type FormData = z.infer<typeof schema>;

export default function MenuDetailsStep({
  id,
  menu,
}: {
  id: string;
  menu: MenuData | null;
}) {
  const router = useRouter();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { data: session } = useSession();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { menuName: "", categories: [] },
  });

  const {
    fields: categories,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "categories",
  });

  const watchedName = watch("menuName");

  useEffect(() => {
    if (menu) {
      reset({
        menuName: menu.name ?? "",
        categories: menu.categories ?? [],
      });
    }
  }, [menu, reset]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    append({
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      items: [{ name: "", price: "" }],
    });
    setNewCategoryName("");
  };

  const handleAddItem = (catIndex: number) => {
    const c = categories[catIndex];
    update(catIndex, { ...c, items: [...c.items, { name: "", price: "" }] });
  };

  const handleRemoveItem = (catIndex: number, idx: number) => {
    const c = categories[catIndex];
    const newItems = c.items.filter((_, i) => i !== idx);
    update(catIndex, { ...c, items: newItems });
  };

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in");
      router.push("/login");
      return;
    }
    if (!menu?.logo || !menu.primaryColor || !menu.accentColor) {
      toast.error("Missing logo/colors – go back to step 1");
      router.push(`/menus/create?id=${id}&step=1`);
      return;
    }

    setIsUploading(true);
    const res = await createMenu({
      ...menu,
      id,
      logo: menu.logo,
      primaryColor: menu.primaryColor,
      accentColor: menu.accentColor,
      userId: session.user.id,
      name: data.menuName,
      categories: data.categories,
      status: "private",
    });
    setIsUploading(false);

    if ("error" in res) {
      toast.error(res.error ?? "");
      return;
    }

    toast.success("Menu saved!");
    router.push(`/menus/create?id=${id}&step=3`);
  };

  const isDarkOrLight = (color: string) =>
    ["#ffffff", "#fff", "#000000", "#000"].includes(color.toLowerCase());

  const backgroundColor = menu?.primaryColor || "#f8f8f8";
  const textColor = menu?.accentColor || "#333";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-10 relative h-full"
    >
      {/* Form Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6 h-full"
      >
        <div className="flex flex-col gap-y-1.5">
          <h1 className="text-4xl font-bold">Step 2</h1>
          <p className="text-muted-foreground">Add categories and items</p>
        </div>

        <div>
          <label className="text-sm font-medium text-primary">Menu Name</label>
          <Input {...register("menuName")} placeholder="e.g. Coffee Menu" />
          {errors.menuName && (
            <p className="text-sm text-red-500">{errors.menuName.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-primary">
            Add Category
          </label>
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Beverages"
            />
            <Button type="button" onClick={handleAddCategory}>
              Add
            </Button>
          </div>
          {errors.categories && (
            <p className="text-sm text-red-500 mt-1">
              {errors.categories.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 mt-auto">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(`/menus/create?id=${id}&step=1`)}
          >
            Back
          </Button>
          <Button
            disabled={isUploading}
            type="submit"
            className="bg-accent text-white"
          >
            {isUploading ? "Saving..." : "Continue to Step 3"}
          </Button>
        </div>
      </form>

      {/* Live Preview */}
      <div className="flex flex-col gap-y-2 h-full">
        <div
          className="border rounded-lg py-4 px-6 flex flex-col h-full overflow-y-auto"
          style={{
            backgroundColor,
            color: textColor,
            ...(isDarkOrLight(backgroundColor) && {
              border: "1px solid #ccc",
            }),
          }}
        >
          {menu?.logo && (
            <div className="flex justify-center mb-4">
              <Image
                src={menu.logo}
                alt="Logo"
                width={100}
                height={100}
                className="rounded object-contain"
              />
            </div>
          )}

          <h2 className="text-xl font-bold text-center mb-4">
            {watchedName || menu?.name || "Menu Name"}
          </h2>

          <ScrollArea className="max-h-[400px] pr-2">
            {categories.map((cat, catIndex) => (
              <div key={cat.id} className="border-b py-4 mb-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{cat.name}</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remove(catIndex)}
                  >
                    <Trash2Icon size={16} />
                  </Button>
                </div>

                {cat.items.map((_, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2 mb-2 items-center">
                    <Input
                      placeholder="Item name"
                      className="placeholder:text-muted-foreground"
                      {...register(
                        `categories.${catIndex}.items.${itemIndex}.name`
                      )}
                    />
                    <Input
                      placeholder="Price"
                      type="number"
                      className="placeholder:text-muted-foreground"
                      {...register(
                        `categories.${catIndex}.items.${itemIndex}.price`
                      )}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-100"
                      onClick={() => handleRemoveItem(catIndex, itemIndex)}
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="border-0"
                  onClick={() => handleAddItem(catIndex)}
                >
                  <Plus size={16} /> Add Item
                </Button>
              </div>
            ))}
          </ScrollArea>
        </div>

        <p className="text-sm italic text-center text-muted-foreground">
          This is a live preview (not final layout)
        </p>
      </div>
    </motion.div>
  );
}
