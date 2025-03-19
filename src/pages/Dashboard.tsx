
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { User, Shield, Globe } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your speedrun.bot dashboard. Select a guild from the sidebar to manage its settings.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-discord-darker bg-discord-dark/50 text-gray-200 shadow-sm hover:bg-discord-dark/70 transition-colors">
            <div className="p-6 flex flex-col items-center text-center space-y-2">
              <div className="mb-4 p-3 bg-discord-blurple/20 rounded-full">
                <Globe className="h-8 w-8 text-discord-blurple" />
              </div>
              <h3 className="text-lg font-semibold text-white">Add a Guild</h3>
              <p className="text-sm text-gray-400">
                Add speedrun.bot to your Discord guild or share it with others.
              </p>
            </div>
          </div>
          
          <div className="rounded-lg border border-discord-darker bg-discord-dark/50 text-gray-200 shadow-sm hover:bg-discord-dark/70 transition-colors">
            <div className="p-6 flex flex-col items-center text-center space-y-2">
              <div className="mb-4 p-3 bg-discord-blurple/20 rounded-full">
                <Shield className="h-8 w-8 text-discord-blurple" />
              </div>
              <h3 className="text-lg font-semibold text-white">Manage Guilds</h3>
              <p className="text-sm text-gray-400">
                Configure notification preferences and manage tracked games.
              </p>
            </div>
          </div>
          
          <div className="rounded-lg border border-discord-darker bg-discord-dark/50 text-gray-200 shadow-sm hover:bg-discord-dark/70 transition-colors">
            <div className="p-6 flex flex-col items-center text-center space-y-2">
              <div className="mb-4 p-3 bg-discord-blurple/20 rounded-full">
                <User className="h-8 w-8 text-discord-blurple" />
              </div>
              <h3 className="text-lg font-semibold text-white">User Settings</h3>
              <p className="text-sm text-gray-400">
                Link your speedrun.com account and manage personal preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
