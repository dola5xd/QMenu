import { AppSidebar } from "@/_components/Designs/DesignSidebar";
import { SidebarProvider } from "@/_components/ui/sidebar";
import SidebarHeader from "@/_components/ui/sidebar-header";

export default async function DesignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="font-cairo bg-background/99 w-full text-primary flex flex-col gap-y-4">
        <SidebarHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
