import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";

import { AppSidebar } from "@/components/AppSidebar";
import { LoginDialog } from "@/components/LoginDialog";

import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Notes from "./pages/Notes";
import Ideas from "./pages/Ideas";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import AIServices from "./pages/AIServices";
import { SharedFiles } from "./pages/SharedFiles";

const queryClient = new QueryClient();

interface User {
  name: string;
  email: string;
  avatar?: string;
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowLoginDialog(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const openLoginDialog = () => {
    setShowLoginDialog(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
              <AppSidebar 
                isAuthenticated={isAuthenticated}
                user={user}
                onLogin={openLoginDialog}
                onLogout={handleLogout}
              />
              
              <div className="flex-1 flex flex-col">
                <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                  <div className="flex items-center h-full px-4 gap-4">
                    <SidebarTrigger />
                    <div className="flex-1" />
                  </div>
                </header>
                
                <main className="flex-1 p-6 overflow-auto">
                  <div className="mx-auto max-w-7xl">
                    <Routes>
                      <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
                      <Route path="/calendar" element={<Calendar isAuthenticated={isAuthenticated} onLogin={openLoginDialog} />} />
                      <Route path="/notes" element={<Notes isAuthenticated={isAuthenticated} />} />
                      <Route path="/ideas" element={<Ideas isAuthenticated={isAuthenticated} onLogin={openLoginDialog} />} />
                      <Route path="/ai-services" element={<AIServices isAuthenticated={isAuthenticated} onLogin={openLoginDialog} />} />
                      <Route path="/shared" element={<SharedFiles isAuthenticated={isAuthenticated} onLogin={openLoginDialog} />}/>
                     <Route path="/settings" element={<Settings isAuthenticated={isAuthenticated} onLogin={openLoginDialog} />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>

            <LoginDialog 
              open={showLoginDialog}
              onClose={() => setShowLoginDialog(false)}
              onLogin={handleLogin}
            />

            <Toaster />
            <Sonner />
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;