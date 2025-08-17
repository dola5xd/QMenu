"use client";

import { Button } from "./button";
import { useLenis } from "lenis/react";

type ContactButtonProps = {
  text: string;
};

export default function ContactButton({ text }: ContactButtonProps) {
  const lenis = useLenis();

  const handleScroll = () => {
    const el = document.getElementById("contact");
    if (el) lenis?.scrollTo(el);
  };

  return <Button onClick={handleScroll}>{text}</Button>;
}
