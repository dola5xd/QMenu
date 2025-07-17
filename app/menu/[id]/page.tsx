import { getMenu } from "@/_actions/getMenu";
import { MenuData } from "@/_actions/createMenu";
import Link from "next/link";
import { Button } from "@/_components/ui/button";
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "@/_components/ui/scroll-area";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const res = await getMenu(id);

  if ("error" in res || !res.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-600 p-6">
        <p className="text-lg font-semibold">
          Error: Something went wrong with this menu.
        </p>
        <Link href="/designs">
          <Button className="mt-4" variant="outline">
            Go Home <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const {
    name,
    categories = [],
    logo,
    primaryColor,
    accentColor,
  }: MenuData = res.data;

  return (
    <main
      className="min-h-screen text-white font-cairo"
      style={{
        backgroundColor: primaryColor,
        backgroundImage: `radial-gradient(circle at top left, ${accentColor}20, transparent 70%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-y-6 items-center">
        {logo && (
          <div className="flex justify-center">
            <Image
              src={logo}
              height={100}
              width={100}
              alt={`${name} Logo`}
              className="object-contain aspect-square"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold text-center mb-10">{name}</h1>

        <ScrollArea className="w-full max-h-[70vh] pr-2">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white/5 p-4 rounded-lg shadow-md"
              >
                <h2
                  className="text-2xl font-semibold mb-4 text-center border-b pb-2"
                  style={{ borderColor: accentColor }}
                >
                  {category.name}
                </h2>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li
                      key={idx}
                      className={`flex justify-between ${
                        idx === category.items.length - 1 ? "" : "border-b"
                      } pb-1`}
                      style={{ borderColor: `${accentColor}40` }}
                    >
                      <span>{item.name}</span>
                      <span className="font-medium">{item.price} EGP</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
