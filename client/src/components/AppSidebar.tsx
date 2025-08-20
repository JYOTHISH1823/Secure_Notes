import { 
  Home, 
  Calendar, 
  FileText, 
  Lightbulb, 
  Bot, 
  Share2, 
  Settings,
  User,
  LogIn,
  LogOut,
  Lock,
  Users,// Added from first code
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";

// Combined navigation items
const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Notes", url: "/notes", icon: FileText },
  { title: "Ideas", url: "/ideas", icon: Lightbulb },
  { title: "Shared", url: "/shared", icon: Users }, // Renamed from "Share2" and used Users icon from first code
  { title: "AI Services", url: "/ai-services", icon: Bot },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface AppSidebarProps {
  isAuthenticated: boolean;
  user: { name: string; email: string; avatar?: string } | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function AppSidebar({ isAuthenticated, user, onLogin, onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-primary text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4">
        <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Lock className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">SecureNotes</h1>
              <p className="text-xs text-sidebar-foreground/70">Secure & Private</p>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!collapsed ? "Navigation" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        <ThemeToggle collapsed={collapsed} />
        {isAuthenticated && user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
            {!collapsed && (
              <Button 
                onClick={onLogout}
                variant="outline" 
                size="sm" 
                className="w-full bg-sidebar-accent hover:bg-sidebar-accent/80 border-sidebar-border text-sidebar-accent-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        ) : (
          <Button 
            onClick={onLogin}
            variant="outline" 
            size={collapsed ? "icon" : "sm"}
            className="w-full bg-sidebar-accent hover:bg-sidebar-accent/80 border-sidebar-border text-sidebar-accent-foreground"
          >
            <LogIn className="w-4 h-4" />
            {!collapsed && <span className="ml-2">Sign In</span>}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}