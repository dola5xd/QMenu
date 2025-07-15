import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variants?: "primary" | "secondary" | "custom";
}

function Button({
  children,
  className = "",
  variants = "primary",
  type = "button",
  ...rest
}: ButtonProps) {
  const baseClass =
    "px-6 py-3 duration-300 rounded-lg cursor-pointer font-semibold";

  const variantClass =
    variants === "primary"
      ? "bg-primary text-white hover:bg-transparent hover:text-primary outline outline-1 outline-primary"
      : variants === "secondary"
      ? "outline-primary outline-1 hover:bg-accent hover:text-white hover:outline-accent"
      : "";

  return (
    <button
      type={type}
      className={clsx(baseClass, variantClass, className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
