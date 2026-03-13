import { Button } from "@/components/ui/button";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Settings,
  Loader2,
} from "lucide-react";
import type { DiscordGuild, Guilds } from "@/types/dashboard";

interface GuildSelectorProps {
  activeGuildCategory: string;
  guilds: Guilds;
  isFetchingGuilds: boolean;
  isFetchingChannels: boolean;
  selectedGuildId?: string;
  onSelectGuild: (guildId: string) => void;
}

const getGuildIconUrl = (guild: DiscordGuild) => {
  if (!guild.icon) return null;
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
};

const GuildSelector = ({
  activeGuildCategory,
  guilds,
  isFetchingGuilds,
  isFetchingChannels,
  selectedGuildId,
  onSelectGuild,
}: GuildSelectorProps) => {
  const sortByCreation = <T extends { id: string }>(list: T[]) =>
    [...list].sort((a, b) => a.id.localeCompare(b.id));

  const allGuilds = [
    ...sortByCreation(guilds.owner),
    ...sortByCreation(guilds.admin),
    ...sortByCreation(guilds.moderator),
    ...sortByCreation(guilds.superadmin),
  ];

  const displayedGuilds =
    activeGuildCategory === "all" ? allGuilds :
    activeGuildCategory === "owner" ? sortByCreation(guilds.owner) :
    activeGuildCategory === "admin" ? sortByCreation(guilds.admin) :
    activeGuildCategory === "superadmin" ? sortByCreation(guilds.superadmin) :
    sortByCreation(guilds.moderator);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        {activeGuildCategory === "all" && "All Discord Guilds"}
        {activeGuildCategory === "owner" && "Owner Discord Guilds"}
        {activeGuildCategory === "admin" && "Admin Discord Guilds"}
        {activeGuildCategory === "moderator" && "Moderator Discord Guilds"}
        {activeGuildCategory === "superadmin" && "Superadmin Discord Guilds"}
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        {activeGuildCategory === "all" && "Servers where the bot is installed"}
        {activeGuildCategory === "owner" && "Servers where the bot is installed and you are the owner"}
        {activeGuildCategory === "admin" && "Servers where the bot is installed and you have administrator permissions"}
        {activeGuildCategory === "moderator" && "Servers where the bot is installed and you have manage channels permissions"}
        {activeGuildCategory === "superadmin" && "All registered servers (bot admin access)"}
      </p>

      {isFetchingGuilds ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-discord-blurple mx-auto mb-3 animate-spin" />
            <p className="text-gray-400">Loading guilds from Discord...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {displayedGuilds.map(guild => (
            <div key={guild.id} className="bg-discord-dark rounded-lg p-4 hover:bg-discord-dark/80 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-discord-blurple/20 flex items-center justify-center">
                  {guild.icon ? (
                    <img
                      src={getGuildIconUrl(guild)!}
                      alt={guild.name}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="text-2xl">{guild.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{guild.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {guild.superadmin ? (
                    <div className="flex items-center bg-red-400/10 border border-red-400/20 rounded-full px-2 py-1">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <span className="hidden xl:ml-1 xl:block text-sm text-red-400">Superadmin</span>
                    </div>
                  ) : guild.owner ? (
                    <div className="flex items-center bg-green-400/10 border border-green-400/20 rounded-full px-2 py-1">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="hidden xl:ml-1 xl:block text-sm text-green-400">Owner</span>
                    </div>
                  ) : (guild.permissions & 0x8) === 0x8 ? (
                    <div className="flex items-center bg-blue-400/10 border border-blue-400/20 rounded-full px-2 py-1">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span className="hidden xl:ml-1 xl:block text-sm text-blue-400">Admin</span>
                    </div>
                  ) : (
                    <div className="flex items-center bg-purple-400/10 border border-purple-400/20 rounded-full px-2 py-1">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span className="hidden xl:ml-1 xl:block text-sm text-purple-400">Moderator</span>
                    </div>
                  )}
                  <Button
                    size="sm"
                    className="bg-discord-blurple hover:bg-discord-blurple/90 text-white flex-shrink-0"
                    onClick={() => onSelectGuild(guild.id)}
                    disabled={isFetchingChannels && selectedGuildId === guild.id}
                  >
                    {isFetchingChannels && selectedGuildId === guild.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Settings className="w-4 h-4" />
                        <span className="hidden xl:ml-1 xl:block">Manage</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuildSelector;
