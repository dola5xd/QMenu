"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Button from "../_components/ui/Landing/Button";
import Logo from "../_components/ui/Logo";
import Squares from "../_components/ui/Squares";
import { BsGoogle } from "react-icons/bs";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
        className="z-0 w-full max-w-md p-10 flex flex-col gap-y-4 shadow-xl bg-dark/95 rounded-xl"
      >
        <div className="flex justify-center mb-6">
          <Logo variants="light" />
        </div>

        <h1 className="text-2xl font-bold text-center">Create your account</h1>

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            {...register("name")}
            autoComplete="name"
            placeholder="Adel Yasser"
            className="w-full px-4 py-2 mt-1 border rounded-md border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

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

        <Button
          variants="custom"
          className="bg-accent hover:bg-accent/75 text-white w-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>

        <div className="relative flex items-center justify-center text-xs text-secondary/50 my-2">
          <span className="absolute left-0 w-full border-t border-secondary/30" />
          <span className="px-4 bg-dark z-10">OR</span>
        </div>

        <Button
          type="button"
          variants="custom"
          onClick={handleGoogleRegister}
          className="flex items-center justify-center gap-3 w-full border border-secondary hover:bg-secondary/10 transition text-secondary"
        >
          <BsGoogle /> <span>Register with Google</span>
        </Button>

        <p className="text-sm text-center text-secondary/75">
          Already have an account?{" "}
          <a href="/login" className="text-secondary hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </main>
  );
}
