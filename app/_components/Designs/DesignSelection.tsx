"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/_components/ui/dialog";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const designs = [
  {
    id: "classic-coffee",
    name: "Classic Café",
    preview: "/designs/classic.png",
  },
  {
    id: "modern-black",
    name: "Modern Black",
    preview: "/designs/modern.png",
  },
  {
    id: "elegant-white",
    name: "Elegant White",
    preview: "/designs/elegant.png",
  },
];

export default function CreateMenuDialog() {
  const router = useRouter();

  const handleSelect = (designId: string) => {
    const randomId = uuidv4();
    router.push(`/menus/create?id=${randomId}&design=${designId}`);
  };

  return (
    <Dialog>
      <DialogTrigger>
        Create new <Plus size={18} />
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select a Menu Design</DialogTitle>
          <DialogDescription>
            Pick a template that fits your brand. You can customize the content
            after.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {designs.map((design) => (
            <button
              key={design.id}
              onClick={() => handleSelect(design.id)}
              className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-accent"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={design.preview}
                  alt={design.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 text-center font-semibold group-hover:text-accent">
                {design.name}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
