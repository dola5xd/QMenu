import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import namesPlugin from "colord/plugins/names";
extend([a11yPlugin, namesPlugin]);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePalette(baseColor: string) {
  const color = colord(baseColor);
  return {
    base: color.toHex(),
    light: color.lighten(0.2).toHex(),
    dark: color.darken(0.2).toHex(),
    accent: color.rotate(30).toHex(), // complementary
    muted: color.desaturate(0.3).toHex(),
  };
}
