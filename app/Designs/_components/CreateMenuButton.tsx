"use client";

import { Plus } from "lucide-react";
import { Button } from "@/_components/ui/button";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function CreateMenuButton() {
  const router = useRouter();

  const handleSelect = () => {
    const randomId = uuidv4();
    router.push(`/menus/create?id=${randomId}`);
  };

  return (
    <Button className="w-fit" onClick={handleSelect}>
      Create new <Plus size={18} />
    </Button>
  );
}
