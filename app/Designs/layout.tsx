import SidebarHeader from "@/_components/ui/sidebar-header";

export default async function DesignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="font-cairo bg-background/99 w-full text-primary flex flex-col gap-y-4">
      <SidebarHeader />
      {children}
    </main>
  );
}
