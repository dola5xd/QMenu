import FiltersBar from "@/_components/ui/Filters";

import CreateMenuDialog from "@/_components/Designs/DesignSelection";
function Page() {
  return (
    <section className="px-10 py-2">
      <header className="flex items-center justify-between pr-10">
        <h2 className="text-xl font-semibold ">Your Menus</h2>
        <CreateMenuDialog />
      </header>
      <div className="flex flex-col gap-y-7">
        <FiltersBar />
        <section className="grid grid-cols-3 gap-10 items-center justify-center min-h-[50vh]">
          <p className="text-3xl col-span-3 text-center">
            No Menus in your account!
          </p>
        </section>
      </div>
    </section>
  );
}

export default Page;
