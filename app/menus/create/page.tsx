import MenuDetailsStep from "@/_components/Steps/MenuDetailsStep";
import LogoStep from "@/_components/Steps/LogoStep";
import { getMenu } from "@/_actions/getMenu";
import ConfirmStep from "@/_components/Steps/ConfirmStep";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    id: string;
    step?: string;
  }>;
}) {
  const params = await searchParams;
  const step = Number(params.step ?? 1);
  const id = params.id;

  const res = await getMenu(id);

  if ("error" in res) {
    return <p className="text-red-500">Error: {res.error}</p>;
  }

  const menu = res.data ?? null;

  return (
    <main className="flex items-center justify-center py-12 px-20 w-screen h-screen font-cairo">
      <section className="h-full bg-background ring-1 px-10 py-10 ring-white/5 shadow-lg rounded aspect-video">
        {step === 1 && <LogoStep id={id} menu={menu} />}
        {step === 2 && <MenuDetailsStep id={id} menu={menu} />}
        {step === 3 && <ConfirmStep id={id} menu={menu} />}
      </section>
    </main>
  );
}
