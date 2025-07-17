"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";

export default function CreateMenuDialog() {
  const router = useRouter();

  const handleSelect = () => {
    const randomId = uuidv4();
    router.push(`/menus/create?id=${randomId}`);
  };

  return (
    <Button className="w-fit" onClick={() => handleSelect()}>
      Create new <Plus size={18} />
    </Button>
  );
}
