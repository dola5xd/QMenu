"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "../_components/ui/Logo";
import Squares from "../_components/ui/Squares";
import { BsGoogle } from "react-icons/bs";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import Link from "next/link";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type LoginFormData = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        console.error("[NextAuth] Login error:", res.error);
        toast.error(res.error);
        return;
      }

      if (res?.ok) {
        toast.success("Logged in successfully!");
        redirect("/Designs");
      }
    } catch (err) {
      console.error("[Submit] Unexpected error:", err);
      toast.error("Something went wrong");
    }
  };

  const handleGoogleLogin = async () => {
    const res = await signIn("google", { callbackUrl: "/Designs" });
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
        className="z-0 w-full max-w-md p-5 space-y-6 shadow-xl sm:p-10 bg-dark/95 rounded-xl"
      >
        <div className="flex justify-center mb-3 lg:mb-6">
          <Logo variants="light" className="w-auto h-20 aspect-[9/8]" />
        </div>

        <h1 className="text-xl font-bold text-center sm:text-2xl">
          Sign in to your account
        </h1>

        <div>
          <label className="block text-xs font-medium sm:text-sm">Email</label>
          <Input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            className="w-full mt-1"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 sm:text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium sm:text-sm">
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
            <p className="mt-1 text-xs text-red-500 sm:text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2 sm:gap-y-4">
          <Button
            className="w-full text-white bg-accent hover:bg-accent/75"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <div className="relative flex items-center justify-center my-2 text-xs text-secondary/50">
            <span className="absolute left-0 w-full border-t border-secondary/30" />
            <span className="z-10 px-4 bg-dark">OR</span>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full gap-3 transition hover:bg-secondary/10 text-secondary"
          >
            <BsGoogle /> <span>Sign in with Google</span>
          </Button>
        </div>
        <p className="text-xs text-center sm:text-sm text-secondary/75">
          Don’t have an account?{" "}
          <Link href="/register" className="text-secondary hover:underline">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
