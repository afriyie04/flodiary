import BreadcrumbComponent from "@/components/ui/breadcrumb/BreadcrumbComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/sidebar/app-sidebar";
import ProtectedLayout from "@/components/ProtectedLayout";

export default function Layout({ children }) {
  return (
    <ProtectedLayout>
      <SidebarProvider>
        <AppSidebar />

        <main className="mx-4 w-full">
          <div className="flex gap-2 items-center mt-2">
            <SidebarTrigger />
            <BreadcrumbComponent />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </ProtectedLayout>
  );
}
