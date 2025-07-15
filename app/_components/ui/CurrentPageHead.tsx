"use client";

import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";

const pathTitleMap: Record<string, string> = {
  "/Designs": "Home",
  "/Designs/menus": "My Menus",
  "/Designs/qrcodes": "My QR Codes",
};

type CurrentPageHeadProps = HTMLAttributes<HTMLHeadingElement>;

function CurrentPageHead({ className, ...rest }: CurrentPageHeadProps) {
  const pathname = usePathname();
  const title = pathTitleMap[pathname] || "Dashboard";

  return (
    <h1 {...rest} className={`text-2xl font-semibold ${className || ""}`}>
      {title}
    </h1>
  );
}

export default CurrentPageHead;
