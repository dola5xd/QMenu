"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Input } from "@/_components/ui/input";
import { Button } from "@/_components/ui/button";
import { uploadToCloudinary } from "@/_lib/Cloudinary";
import { updateUser } from "@/_actions/uptadeUser";
import { useRouter } from "next/navigation";
import type { DBUser } from "@/_lib/authOptions";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const getSchema = (user: DBUser) =>
  z
    .object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
      currentPassword: z.string().optional(),
      newPassword: z.string().optional(),
      confirmPassword: z.string().optional(),
      image: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      const { currentPassword, newPassword, confirmPassword } = data;
      const wantsToSetPassword = newPassword || confirmPassword;

      if (wantsToSetPassword) {
        if (!newPassword || newPassword.length < 8) {
          ctx.addIssue({
            path: ["newPassword"],
            code: z.ZodIssueCode.custom,
            message: "New password must be at least 8 characters",
          });
        }

        if (newPassword !== confirmPassword) {
          ctx.addIssue({
            path: ["confirmPassword"],
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
          });
        }

        if (user.password && !currentPassword) {
          ctx.addIssue({
            path: ["currentPassword"],
            code: z.ZodIssueCode.custom,
            message: "Current password is required",
          });
        }
      }
    });

export default function AccountForm({ user }: { user: DBUser }) {
  const schema = getSchema(user);
  type FormData = z.infer<typeof schema>;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(user.image || "");
  const [isUploading, setIsUploading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      image: undefined,
    },
  });

  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile instanceof File) {
      const objectUrl = URL.createObjectURL(imageFile);
      setLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("image", file, { shouldValidate: true });
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsUploading(true);
      toast.loading("Updating user!");

      let imageUrl = user.image;

      if (data.image instanceof File) {
        imageUrl = await uploadToCloudinary(data.image);
      }

      const updatedUser: Partial<DBUser> = {};

      if (data.name !== user.name) updatedUser.name = data.name;
      if (imageUrl !== user.image) updatedUser.image = imageUrl;
      if (data.newPassword && data.newPassword.trim() !== "") {
        updatedUser.password = data.newPassword;
      }

      if (Object.keys(updatedUser).length === 0) {
        toast.dismiss();
        toast("No changes detected.");
        return;
      }

      const result = await updateUser(
        user.id,
        updatedUser,
        data.currentPassword
      );

      toast.dismiss();

      if ("error" in result) {
        toast.error(result.error ?? "");
        return;
      }
      reset();
      router.refresh();
      toast.success("Account updated successfully!");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to update account");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-between w-full h-full px-3 py-5 space-y-3 shadow-lg md:space-y-8 rounded-xl ring-1 ring-border md:px-6 lg:py-10"
      autoComplete="off"
    >
      <section className="flex flex-col flex-1 w-full gap-4 md:flex-row md:gap-8">
        <div className="flex flex-col gap-3 md:w-1/2 md:gap-6">
          <div className="flex flex-col gap-y-2">
            <label className="block text-sm font-medium">Name</label>
            <Input {...register("name")} placeholder="Your name" />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              disabled
              readOnly
              className="cursor-not-allowed bg-muted"
              defaultValue={user.email}
            />
          </div>

          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <label className="block text-sm font-medium">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter current password"
                  disabled={!user.password}
                  {...register("currentPassword")}
                  className="pr-10"
                />
                <Button
                  type="button"
                  size={"icon"}
                  variant={"link"}
                  onClick={() => setShowCurrent((prev) => !prev)}
                  className="absolute -translate-y-1/2 right-2 top-1/2 text-muted-foreground"
                >
                  {showCurrent ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-500">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="block text-sm font-medium">New Password</label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  {...register("newPassword")}
                  className="pr-10"
                />
                <Button
                  size={"icon"}
                  type="button"
                  variant={"link"}
                  onClick={() => setShowNew((prev) => !prev)}
                  className="absolute -translate-y-1/2 right-2 top-1/2 text-muted-foreground"
                >
                  {showNew ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="block text-sm font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                  {...register("confirmPassword")}
                  className="pr-10"
                />
                <Button
                  size={"icon"}
                  variant={"link"}
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute -translate-y-1/2 right-2 top-1/2 text-muted-foreground"
                >
                  {showConfirm ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:w-1/2">
          <label className="text-sm font-medium">Profile Image</label>
          <label
            className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 flex items-center justify-center hover:border-primary transition cursor-pointer bg-muted h-[240px] md:h-full"
            htmlFor="logo-upload"
          >
            <Input
              ref={inputRef}
              id="logo-upload"
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Profile"
                width={200}
                height={200}
                className="object-contain rounded-lg pointer-events-none"
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                Click or drag an image here
              </div>
            )}
          </label>

          {errors.image && (
            <p className="text-sm text-red-500">
              {errors.image.message?.toString()}
            </p>
          )}

          {logoFile?.name && (
            <p className="text-sm text-muted-foreground">
              Selected: {logoFile.name}
            </p>
          )}
        </div>
      </section>

      <div>
        <Button
          type="submit"
          className="w-full cursor-pointer md:w-auto"
          disabled={isUploading}
        >
          {isUploading ? "Saving..." : "Update Account"}
        </Button>
      </div>
    </motion.form>
  );
}
