"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Logo from "../_components/ui/Logo";
import Squares from "../_components/ui/Squares";
import { BsGoogle } from "react-icons/bs";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error);
      return;
    }
    // auto-login after successful registration
    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    toast.success("Registered successfully!");

    router.push("/designs");
  };

  const handleGoogleRegister = async () => {
    const res = await signIn("google", { callbackUrl: "/designs" });
    if (res?.ok) toast.success("Logged in sucessfully!");
  };

  return (
    <main className="flex items-center justify-center px-6 py-20 h-dvh text-secondary bg-dark">
      <div className="absolute w-full h-full">
        <Squares
          speed={0.25}
          squareSize={50}
          direction="diagonal"
          borderColor="#d7ccc81e"
          hoverFillColor="#222222"
        />

        <div className="absolute inset-0 bg-gradient-to-br to-transparent via-dark/80 from-dark" />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="z-0 flex flex-col w-full max-w-md p-5 text-sm shadow-xl xl:p-10 gap-y-3 xl:gap-y-4 bg-dark/95 rounded-xl xl:text-base"
      >
        <div className="flex justify-center mb-3 xl:mb-6">
          <Logo variants="light" className="w-auto h-20 aspect-[9/8]" />
        </div>

        <h1 className="text-xl font-bold text-center xl:text-2xl">
          Create your account
        </h1>

        <div>
          <label className="block text-xs font-medium xl:text-sm">Name</label>
          <Input
            {...register("name")}
            autoComplete="name"
            placeholder="Adel Yasser"
            className="w-full mt-1"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500 xl:text-sm">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium xl:text-sm">Email</label>
          <Input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            className="w-full mt-1"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 xl:text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium xl:text-sm">
            Password
          </label>
          <Input
            {...register("password")}
            type="password"
            autoComplete="new-password"
            placeholder="********"
            className="w-full mt-1"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500 xl:text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          className="w-full text-white bg-accent hover:bg-accent/75"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>

        <div className="relative flex items-center justify-center text-xs xl:my-2 text-secondary/50">
          <span className="absolute left-0 w-full border-t border-secondary/30" />
          <span className="z-10 px-4 bg-dark">OR</span>
        </div>

        <Button
          type="button"
          onClick={handleGoogleRegister}
          className="flex items-center justify-center w-full gap-3 transition hover:bg-secondary/10 text-secondary"
        >
          <BsGoogle /> <span>Register with Google</span>
        </Button>

        <p className="text-xs text-center xl:text-sm text-secondary/75">
          Already have an account?{" "}
          <a href="/login" className="text-secondary hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </main>
  );
}
