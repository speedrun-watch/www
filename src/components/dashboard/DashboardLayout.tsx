
import { ReactNode } from 'react';
import { SidebarProvider, SidebarRail, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from './DashboardSidebar';
import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const user = {
    name: "Jane Doe",
    email: "jane@example.com",
    avatar: "https://i.imgur.com/6yCHBsS.png"
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-discord-dark text-gray-200">
        <DashboardSidebar />
        <SidebarRail />

        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-discord-darker bg-discord-dark/90 backdrop-blur-sm px-6">
            <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:text-white">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            
            <div className="flex-1">
              <Link to="/" className="flex items-center space-x-2">
                <Bell className="w-6 h-6 text-discord-blurple/90" />
                <span className="text-xl font-bold bg-gradient-to-r from-discord-blurple/90 to-discord-fuchsia/80 bg-clip-text text-transparent">
                  speedrun.bot
                </span>
              </Link>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User menu">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-discord-dark border-discord-darker text-gray-200">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-discord-darker/70" />
                <DropdownMenuItem asChild className="focus:bg-discord-blurple/20 focus:text-white">
                  <Link to="/dashboard/user-settings">User Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-discord-blurple/20 focus:text-white">
                  <Link to="/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
          
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
