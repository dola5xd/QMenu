"use client";

import { useLenis } from "lenis/react";

type HeaderNavProps = {
  nav: string[];
};

export default function HeaderNav({ nav }: HeaderNavProps) {
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
    <ul className="lg:w-1/2 justify-center flex items-center gap-x-4 *:relative *:text-sm md:*:text-lg *:font-semibold *:cursor-pointer *:before:content-['']  *:before:absolute *:before:-bottom-1 *:before:left-0 *:before:bg-primary *:before:w-0 *:hover:before:w-full *:before:transition-all *:before:duration-500 *:before:h-1 *:before:rounded-full *:before:z-[-1]">
      <li onClick={() => handleScroll("#about")}>{nav[0]}</li>
      <li onClick={() => handleScroll("#services")}>{nav[1]}</li>
      <li onClick={() => handleScroll("#join")}>{nav[2]}</li>
    </ul>
  );
}
