"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../_components/ui/Landing/Button";
import Logo from "../_components/ui/Logo";
import Squares from "../_components/ui/Squares";
import { BsGoogle } from "react-icons/bs";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

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
    <main className="flex items-center justify-center h-screen px-6 py-20 text-secondary bg-dark">
      <Squares
        speed={0.25}
        squareSize={50}
        direction="diagonal"
        borderColor="#d7ccc837"
        hoverFillColor="#1c1c1c"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="z-0 w-full max-w-md p-10 space-y-6 shadow-xl bg-dark/95 rounded-xl"
      >
        <div className="flex justify-center mb-6">
          <Logo variants="light" />
        </div>

        <h1 className="text-2xl font-bold text-center">
          Sign in to your account
        </h1>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            className="w-full px-4 py-2 mt-1 border rounded-md border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            {...register("password")}
            type="password"
            autoComplete="new-password"
            placeholder="********"
            className="w-full px-4 py-2 mt-1 border rounded-md border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <Button
            variants="custom"
            className="bg-accent hover:bg-accent/75 text-white w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <div className="relative flex items-center justify-center text-xs text-secondary/50 my-2">
            <span className="absolute left-0 w-full border-t border-secondary/30" />
            <span className="px-4 bg-dark z-10">OR</span>
          </div>

          <Button
            type="button"
            variants="custom"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 w-full border border-secondary hover:bg-secondary/10 transition text-secondary"
          >
            <BsGoogle /> <span>Sign in with Google</span>
          </Button>
        </div>
        <p className="text-sm text-center text-secondary/75">
          Don’t have an account?{" "}
          <a href="/register" className="text-secondary hover:underline">
            Register
          </a>
        </p>
      </form>
    </main>
  );
}
