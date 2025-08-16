"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Heart,
  Home,
  Calendar,
  BarChart3,
  User,
  Settings,
  LogOut,
  Plus,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const mainNavigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    description: "Overview of your cycle and health",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    description: "Track your cycle and important dates",
  },
  {
    title: "Cycle History",
    url: "/cycle-history",
    icon: BarChart3,
    description: "View patterns and trends over time",
  },
  {
    title: "Periods",
    url: "/periods",
    icon: Calendar,
    description: "Track your periods and cycle",
  },
];

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader className="mt-2 border-b">
        <div className="flex flex-col items-center gap-2 w-full">
          <span className="text-lg font-bold text-purple-900 flex items-center justify-center">
            <Heart className="w-5 h-5 mr-2" />
            Flodiary
          </span>
          {user && (
            <span className="text-sm text-gray-600">
              Welcome, {user.firstName}!
            </span>
          )}
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="flex flex-col gap-4 px-2 mt-4">
        {/* Main Navigation Group */}
        <SidebarGroup>
          <SidebarMenu>
            {mainNavigationItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-4 px-3 py-5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                      title={item.description}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="mt-auto px-4 py-4 border-t flex flex-col gap-2">
        {/* Profile Link */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/profile"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  pathname === "/profile"
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Manage your account settings"
              >
                <User className="w-4 h-4" />
                <span className="font-medium">Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
