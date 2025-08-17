"use client";

import { useLenis } from "lenis/react";

type FooterNavProps = {
  pages: string[];
};

export default function FooterNav({ pages }: FooterNavProps) {
  const lenis = useLenis();

  const handleScroll = (id: string) => {
    if (id === "top") {
      lenis?.scrollTo(0);
      return;
    }

    const el = document.querySelector(id);
    if (el && el instanceof HTMLElement) {
      lenis?.scrollTo(el);
    }
  };

  return (
    <ul className="flex flex-col gap-y-1 *:cursor-pointer *:hover:underline">
      <li onClick={() => handleScroll("top")}>{pages[0]}</li>
      <li onClick={() => handleScroll("#about")}>{pages[1]}</li>
      <li onClick={() => handleScroll("#services")}>{pages[2]}</li>
      <li onClick={() => handleScroll("#join")}>{pages[3]}</li>
      <li onClick={() => handleScroll("#contact")}>{pages[4]}</li>
    </ul>
  );
}
