import MenuDetailsStep from "@/_components/Steps/MenuDetailsStep";
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
    <main className="w-full min-h-screen p-0 sm:p-6 font-cairo bg-background">
      <section className="bg-gradient-to-br from-[#fffdf8] to-[#fef8e8] shadow-md rounded-none sm:rounded-2xl px-4 py-7 sm:py-5 sm:px-5 lg:p-10 w-full max-w-7xl mx-auto">
        {step === 1 && <MenuDetailsStep id={id} menu={menu} />}
        {step === 2 && <ConfirmStep id={id} menu={menu} />}
      </section>
    </main>
  );
}
