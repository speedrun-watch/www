import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Gamepad,
  Settings,
  LogOut,
  User,
  Server,
  Home,
  Shield,
  Users,
  X,
  Plus,
  Clock,
  Link as LinkIcon,
  MessageSquare,
  ArrowLeft,
  Trophy,
  Medal,
  Flag,
  Zap,
  FileCheck,
  ExternalLink,
  UserCheck,
  Copy,
  Bot,
  Check,
  ShieldAlert
} from "lucide-react";
import Footer from "@/components/Footer";
import AuthStatus from "@/components/AuthStatus";
import DashboardMenu from "@/components/DashboardMenu";
import axios from "axios";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  banner: string | null;
  owner: boolean;
  permissions: number;
  permissions_new: string;
  features: string[];
}

interface Guilds {
  owner: DiscordGuild[];
  admin: DiscordGuild[];
  member: DiscordGuild[];
}

interface Game {
  id: string;
  gameName: string;
  srcGameId: string;
  abbreviation: string;
  weblink: string;
  discord: string;
  released: number;
  releaseDate: string;
  ruleset: {
    showMilliseconds: boolean;
    requireVerification: boolean;
    requireVideo: boolean;
    runTimes: string[];
    emulatorsAllowed: boolean;
    defaultTime: string;
  };
  assets: {
    coverSmall: { uri: string };
    coverMedium: { uri: string };
    coverLarge: { uri: string };
    coverTiny: { uri: string };
    icon: { uri: string };
    logo: { uri: string | null };
    background: { uri: string | null };
    foreground: { uri: string | null };
    trophy1st: { uri: string | null };
    trophy2nd: { uri: string | null };
    trophy3rd: { uri: string | null };
    trophy4th: { uri: string | null };
  };
}

interface DiscordChannel {
  id: string;
  type: number;
  flags: number;
  guild_id: string;
  name: string;
  parent_id: string | null;
  position: number;
  permission_overwrites: any[];
  games?: Game[];
  last_message_id?: string | null;
  rate_limit_per_user?: number;
  topic?: string | null;
  nsfw?: boolean;
  bitrate?: number;
  user_limit?: number;
  rtc_region?: string | null;
}

interface GuildChannelsResponse {
  message: string;
  guildChannels: DiscordChannel[];
}

// Mock data for games that can be linked
const mockAvailableGames = [
  { id: "g1", name: "Half-Life" },
  { id: "g2", name: "Half-Life 2" },
  { id: "g3", name: "Half-Life: Alyx" },
  { id: "g4", name: "Super Mario 64" },
  { id: "g5", name: "Grand Theft Auto: San Andreas" },
  { id: "g6", name: "Grand Theft Auto: Vice City" },
  { id: "g7", name: "Worms Armageddon" },
  { id: "g8", name: "Minecraft" },
  { id: "g9", name: "Portal" },
  { id: "g10", name: "Portal 2" },
  { id: "g11", name: "Doom" },
  { id: "g12", name: "Doom Eternal" },
  { id: "g13", name: "The Legend of Zelda: Ocarina of Time" },
  { id: "g14", name: "The Legend of Zelda: Breath of the Wild" }
];

// Mock data for moderators
const mockModerators = {
  "1": [
    { id: "mod1", type: "user", name: "SpeedyMcRunner", avatar: null },
    { id: "mod2", type: "role", name: "Half-Life Moderators", color: "#8a2be2" }
  ],
  "2": [
    { id: "mod3", type: "user", name: "Mario64Expert", avatar: null }
  ]
};

// Mock data for popular games using the bot
const popularGames = [
  { name: "Half-Life 2", icon: "🔫" },
  { name: "Minecraft", icon: "⛏️" },
  { name: "Super Mario 64", icon: "🍄" },
  { name: "Portal", icon: "🔵" },
  { name: "GTA: San Andreas", icon: "🚗" },
  { name: "Doom Eternal", icon: "👹" },
  { name: "The Legend of Zelda: BotW", icon: "🏹" },
  { name: "Celeste", icon: "🏔️" }
];

// This is a placeholder Dashboard, you'll expand this with actual functionality later
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("guilds");
  const [activeGuildCategory, setActiveGuildCategory] = useState("all");
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [gameSearchTerm, setGameSearchTerm] = useState("");
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [editingGameSettings, setEditingGameSettings] = useState<{ channelId: string, gameId: string } | null>(null);
  const [showAddModerator, setShowAddModerator] = useState(false);
  const [notificationCopied, setNotificationCopied] = useState(false);
  const [guilds, setGuilds] = useState<Guilds>({
    owner: [],
    admin: [],
    member: []
  });
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [searchResults, setSearchResults] = useState<{ id: string, name: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}/api/user/guilds`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        // Process the guilds into the correct categories
        const ownedGuilds = response.data.ownedGuilds || [];
        const processedGuilds: Guilds = {
          owner: ownedGuilds.filter(guild => guild.owner),
          admin: ownedGuilds.filter(guild => !guild.owner && (guild.permissions & 0x8) === 0x8), // Check for ADMINISTRATOR permission
          member: ownedGuilds.filter(guild => !guild.owner && (guild.permissions & 0x8) !== 0x8)
        };

        setGuilds(processedGuilds);
      } catch (error) {
        console.error("Error fetching guilds:", error);
      }
    };

    fetchGuilds();
  }, []);

  useEffect(() => {
    const fetchGuildChannels = async () => {
      if (!selectedGuildId) return;

      try {
        const response = await axios.get<GuildChannelsResponse>(
          `${API_ENDPOINT}/api/guilds/${selectedGuildId}/channels`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          },
        );
        setChannels(response.data.guildChannels);
      } catch (error) {
        console.error("Error fetching guild channels:", error);
      }
    };

    fetchGuildChannels();
  }, [selectedGuildId]);

  // Combine all guilds for the "all" category
  const allGuilds = [
    ...guilds.owner,
    ...guilds.admin,
    ...guilds.member
  ];

  // Format guild icon URL
  const getGuildIconUrl = (guild: DiscordGuild) => {
    if (!guild.icon) return null;
    return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
  };

  // Filter games based on search term
  const filteredGames = mockAvailableGames.filter(game =>
    game.name.toLowerCase().includes(gameSearchTerm.toLowerCase())
  );

  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return "Yesterday at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return diffInDays + " days ago";
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Back to guild selection
  const handleBackToGuilds = () => {
    setSelectedGuildId(null);
    setActiveChannelId(null);
    setEditingGameSettings(null);
  };

  // Link a game to a channel
  const handleLinkGame = async (channelId: string, gameId: string) => {
    try {
      const selectedGame = searchResults.find(g => g.id === gameId);
      if (!selectedGame) return;

      await axios.post(
        `${API_ENDPOINT}/api/guilds/${selectedGuildId}/channels/${channelId}/games/${selectedGame.name}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      // Update the channels state with the new game
      setChannels(prevChannels =>
        prevChannels.map(channel => {
          if (channel.id === channelId) {
            const newGame: Game = {
              id: gameId,
              gameName: selectedGame.name,
              srcGameId: gameId,
              abbreviation: "",
              weblink: "",
              discord: "",
              released: 0,
              releaseDate: new Date().toISOString(),
              ruleset: {
                showMilliseconds: false,
                requireVerification: false,
                requireVideo: false,
                runTimes: [],
                emulatorsAllowed: false,
                defaultTime: ""
              },
              assets: {
                coverSmall: { uri: "" },
                coverMedium: { uri: "" },
                coverLarge: { uri: "" },
                coverTiny: { uri: "" },
                icon: { uri: "" },
                logo: { uri: null },
                background: { uri: null },
                foreground: { uri: null },
                trophy1st: { uri: null },
                trophy2nd: { uri: null },
                trophy3rd: { uri: null },
                trophy4th: { uri: null }
              }
            };
            return {
              ...channel,
              games: [...(channel.games || []), newGame]
            };
          }
          return channel;
        })
      );

      // Clear the search and close the search box
      setGameSearchTerm("");
      setActiveChannelId(null);
      setSearchResults([]);
    } catch (error) {
      console.error("Error linking game:", error);
    }
  };

  // Unlink a game from a channel
  const handleUnlinkGame = async (channelId: string, gameName: string) => {
    try {
      await axios.delete(
        `${API_ENDPOINT}/api/guilds/${selectedGuildId}/channels/${channelId}/games/${gameName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      // Update the channels state to remove the unlinked game
      setChannels(prevChannels =>
        prevChannels.map(channel => {
          if (channel.id === channelId) {
            return {
              ...channel,
              games: channel.games?.filter(game => game.gameName !== gameName) || []
            };
          }
          return channel;
        })
      );
    } catch (error) {
      console.error("Error unlinking game:", error);
    }
  };

  // Update game notification settings
  const handleUpdateNotificationSettings = (channelId: string, gameId: string, setting: string) => {
    console.log(`Updating ${setting} for game ${gameId} in channel ${channelId}`);
    // In a real app, you would update the database here
  };

  // Copy share text
  const handleCopyShareText = () => {
    const shareText = "Check out speedrun.bot! It's a great Discord bot for tracking speedruns from speedrun.com. Add it to your server: https://speedrun.bot/invite";
    navigator.clipboard.writeText(shareText)
      .then(() => {
        setNotificationCopied(true);
        setTimeout(() => setNotificationCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Handle game search with debounce
  useEffect(() => {
    if (!gameSearchTerm) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}/api/search/games/${gameSearchTerm}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        setSearchResults(response.data.games.data.map((game: any) => ({
          id: game.id,
          name: game.names.international
        })));
      } catch (error) {
        console.error("Error searching games:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [gameSearchTerm]);

  return (
    <div className="min-h-screen bg-discord-darker text-white">
      {/* Header */}
      <header className="bg-discord-dark py-4 border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Bell className="w-6 h-6 text-discord-blurple" />
              <span className="text-xl font-bold bg-gradient-to-r from-discord-blurple to-discord-fuchsia bg-clip-text text-transparent">
                speedrun.bot
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <AuthStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <DashboardMenu
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeGuildCategory={activeGuildCategory}
            setActiveGuildCategory={setActiveGuildCategory}
            setSelectedGuildId={setSelectedGuildId}
            guilds={guilds}
          />

          {/* Main Content Area */}
          <div className="flex-1 glass rounded-lg p-6">
            {activeTab === "add-bot" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Add speedrun.bot to Discord</h1>

                <div className="space-y-10">
                  {/* Step 1 */}
                  <div className="glass rounded-lg p-6 relative">
                    <div className="absolute -left-3 -top-3 bg-discord-blurple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                    <h2 className="text-2xl font-bold mb-4">Authorize the Bot</h2>
                    <p className="mb-5 text-gray-300">
                      Click the button below to authorize speedrun.bot with your Discord account. You'll be redirected to Discord's authorization page.
                    </p>
                    <div className="flex justify-center">
                      <Button size="lg" className="bg-discord-blurple hover:bg-discord-blurple/90">
                        <Bot className="mr-2 h-5 w-5" />
                        Add to Discord
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="glass rounded-lg p-6 relative">
                    <div className="absolute -left-3 -top-3 bg-discord-blurple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                    <h2 className="text-2xl font-bold mb-4">Select Your Server</h2>
                    <p className="mb-5 text-gray-300">
                      Choose which Discord server you want to add the bot to. You need to have <Badge variant="outline" className="ml-1 font-mono">Manage Server</Badge> permissions to add bots.
                    </p>
                    <div className="bg-discord-dark/50 rounded-lg p-4 mb-5">
                      <div className="flex items-center text-sm text-yellow-300">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        <p>Only add bots to servers you trust. This bot will have the permissions listed below.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-discord-dark/30 p-3 rounded-md flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        <span>Read Messages</span>
                      </div>
                      <div className="bg-discord-dark/30 p-3 rounded-md flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        <span>Send Messages</span>
                      </div>
                      <div className="bg-discord-dark/30 p-3 rounded-md flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        <span>Embed Links</span>
                      </div>
                      <div className="bg-discord-dark/30 p-3 rounded-md flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        <span>Read Message History</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="glass rounded-lg p-6 relative">
                    <div className="absolute -left-3 -top-3 bg-discord-blurple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                    <h2 className="text-2xl font-bold mb-4">Set Up Notifications</h2>
                    <p className="mb-5 text-gray-300">
                      After adding the bot, return to the dashboard to configure which speedrunning events you want to track.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="glass p-4 flex-1 flex flex-col items-center">
                        <Server className="h-8 w-8 text-discord-blurple mb-2" />
                        <h3 className="font-medium">Link Channels</h3>
                        <p className="text-sm text-center text-gray-400">Connect channels to specific games</p>
                      </div>
                      <div className="glass p-4 flex-1 flex flex-col items-center">
                        <MessageSquare className="h-8 w-8 text-discord-green mb-2" />
                        <h3 className="font-medium">Configure Events</h3>
                        <p className="text-sm text-center text-gray-400">Choose which events trigger notifications</p>
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <Button
                        className="bg-discord-blurple hover:bg-discord-blurple/90"
                        onClick={() => setActiveTab("guilds")}
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <p className="text-gray-400">
                    Need help? Join our <a href="#" className="text-discord-blurple hover:underline">support server</a> or check the <a href="#" className="text-discord-blurple hover:underline">documentation</a>.
                  </p>
                </div>
              </div>
            )}

            {/* Original guilds tab content */}
            {activeTab === "guilds" && !selectedGuildId && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Discord Guilds</h1>

                <Tabs value={activeGuildCategory} onValueChange={(value) => {
                  setActiveGuildCategory(value);
                  setActiveTab("guilds");
                }} className="mb-6">
                  <TabsList className="bg-discord-dark">
                    <TabsTrigger value="all" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">
                      All Guilds ({allGuilds.length})
                    </TabsTrigger>
                    <TabsTrigger value="owner" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">
                      <Shield className="mr-2 h-4 w-4" />
                      Owner ({guilds.owner.length})
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin ({guilds.admin.length})
                    </TabsTrigger>
                    <TabsTrigger value="member" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">
                      <Users className="mr-2 h-4 w-4" />
                      Member ({guilds.member.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allGuilds.map(guild => (
                        <div key={guild.id} className="bg-discord-dark rounded-lg p-4 hover:bg-discord-dark/80 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-discord-blurple/20 flex items-center justify-center">
                              {guild.icon ? (
                                <img
                                  src={getGuildIconUrl(guild)}
                                  alt={guild.name}
                                  className="w-full h-full rounded-full"
                                />
                              ) : (
                                <span className="text-2xl">{guild.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <h3 className="text-white font-medium truncate">{guild.name}</h3>
                                {guild.owner && (
                                  <Badge className="ml-2 bg-green-600 hover:bg-green-700">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Owner
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">{guild.owner ? "Owner" : "Admin"}</p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                              onClick={() => setSelectedGuildId(guild.id)}
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="owner" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {guilds.owner.map(guild => (
                        <div key={guild.id} className="bg-discord-dark rounded-lg p-4 hover:bg-discord-dark/80 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-discord-blurple/20 flex items-center justify-center">
                              {guild.icon ? (
                                <img
                                  src={getGuildIconUrl(guild)}
                                  alt={guild.name}
                                  className="w-full h-full rounded-full"
                                />
                              ) : (
                                <span className="text-2xl">{guild.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <h3 className="text-white font-medium truncate">{guild.name}</h3>
                                {guild.owner && (
                                  <Badge className="ml-2 bg-green-600 hover:bg-green-700">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Owner
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">{guild.owner ? "Owner" : "Admin"}</p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                              onClick={() => setSelectedGuildId(guild.id)}
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Admin and Member tabs - same pattern as the other tabs but with different data */}
                  <TabsContent value="admin" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {guilds.admin.map(guild => (
                        <div key={guild.id} className="bg-discord-dark rounded-lg p-4 hover:bg-discord-dark/80 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-discord-blurple/20 flex items-center justify-center">
                              {guild.icon ? (
                                <img
                                  src={getGuildIconUrl(guild)}
                                  alt={guild.name}
                                  className="w-full h-full rounded-full"
                                />
                              ) : (
                                <span className="text-2xl">{guild.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">{guild.name}</h3>
                              <p className="text-gray-400 text-sm">{guild.owner ? "Owner" : "Admin"}</p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                              onClick={() => setSelectedGuildId(guild.id)}
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="member" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {guilds.member.map(guild => (
                        <div key={guild.id} className="bg-discord-dark rounded-lg p-4 hover:bg-discord-dark/80 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-discord-blurple/20 flex items-center justify-center">
                              {guild.icon ? (
                                <img
                                  src={getGuildIconUrl(guild)}
                                  alt={guild.name}
                                  className="w-full h-full rounded-full"
                                />
                              ) : (
                                <span className="text-2xl">{guild.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">{guild.name}</h3>
                              <p className="text-gray-400 text-sm">{guild.owner ? "Owner" : "Admin"}</p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                              onClick={() => setSelectedGuildId(guild.id)}
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeTab === "guilds" && selectedGuildId && (
              <div>
                <div className="flex items-center mb-6">
                  <Button
                    variant="ghost"
                    className="mr-4 hover:bg-discord-dark/50"
                    onClick={handleBackToGuilds}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>

                  <h1 className="text-2xl font-bold flex items-center">
                    {allGuilds.find(g => g.id === selectedGuildId)?.name}
                  </h1>
                </div>

                {/* Moderators Section */}
                <div className="bg-discord-dark rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Moderators</h2>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-discord-blurple text-discord-blurple hover:bg-discord-blurple hover:text-white"
                      onClick={() => setShowAddModerator(!showAddModerator)}
                    >
                      {showAddModerator ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                      {showAddModerator ? "Cancel" : "Add Moderator"}
                    </Button>
                  </div>

                  {showAddModerator && (
                    <div className="bg-discord-darker p-4 rounded-md mb-4">
                      <div className="mb-4">
                        <p className="text-sm text-gray-300 mb-2">
                          Moderators have the same abilities as you for managing game notifications,
                          but cannot remove you (the owner) or remove the bot entirely from the guild.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="flex-1">
                          <select className="w-full bg-discord-dark border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none">
                            <option value="">Select type...</option>
                            <option value="user">Discord User</option>
                            <option value="role">Discord Role</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Search users or roles..."
                            className="w-full bg-discord-dark border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none"
                          />
                        </div>
                        <Button className="bg-discord-blurple hover:bg-discord-blurple/90 text-white">
                          Add
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {mockModerators[selectedGuildId as keyof typeof mockModerators]?.map(mod => (
                      <div key={mod.id} className="flex items-center justify-between bg-discord-darker p-2 rounded-md">
                        <div className="flex items-center">
                          {mod.type === "user" ? (
                            <>
                              <Avatar className="w-6 h-6 mr-2">
                                <AvatarFallback className="bg-discord-blurple/60 text-xs">
                                  {mod.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{mod.name}</span>
                            </>
                          ) : (
                            <>
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: mod.color }}></div>
                              <span className="font-medium">@{mod.name}</span>
                            </>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(!mockModerators[selectedGuildId as keyof typeof mockModerators] ||
                      mockModerators[selectedGuildId as keyof typeof mockModerators].length === 0) && (
                        <p className="text-gray-400 text-sm italic">No moderators added yet</p>
                      )}
                  </div>
                </div>

                <div className="bg-discord-dark rounded-lg p-4 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Notification Channels</h2>
                  <div className="space-y-4">
                    {channels
                      .filter(channel => channel.type === 0) // Only show text channels
                      .map(channel => (
                        <div key={channel.id} className="bg-discord-darker rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-medium flex items-center">
                              <MessageSquare className="w-5 h-5 mr-2 text-discord-blurple" />
                              #{channel.name}
                            </h3>
                            {activeChannelId !== channel.id && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-discord-blurple text-discord-blurple hover:bg-discord-blurple hover:text-white"
                                onClick={() => setActiveChannelId(channel.id)}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Link Game
                              </Button>
                            )}
                          </div>

                          {activeChannelId === channel.id && (
                            <div className="mb-4 bg-discord-dark/50 p-3 rounded-md">
                              <div className="flex items-center mb-2">
                                <input
                                  type="text"
                                  placeholder="Search speedrun.com games..."
                                  className="bg-discord-darker flex-1 border border-gray-700 rounded-md py-1 px-3 text-white focus:border-discord-blurple focus:outline-none"
                                  value={gameSearchTerm}
                                  onChange={(e) => setGameSearchTerm(e.target.value)}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="ml-2 text-gray-400 hover:text-white"
                                  onClick={() => setActiveChannelId(null)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              {gameSearchTerm && (
                                <div className="max-h-40 overflow-y-auto bg-discord-darker rounded-md mt-2">
                                  {isSearching ? (
                                    <div className="p-2 text-gray-400">Searching...</div>
                                  ) : searchResults.length > 0 ? (
                                    searchResults.map(game => (
                                      <div
                                        key={game.id}
                                        className="p-2 hover:bg-discord-dark/70 cursor-pointer text-gray-300 hover:text-white"
                                        onClick={() => {
                                          handleLinkGame(channel.id, game.id);
                                        }}
                                      >
                                        {game.name}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-2 text-gray-400">No games found</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {(!channel.games || channel.games.length === 0) ? (
                            <p className="text-gray-400 text-sm italic">No games linked to this channel</p>
                          ) : (
                            <div className="space-y-2">
                              {channel.games.map(game => (
                                <div key={game.id} className="flex flex-col p-2 bg-discord-dark/30 rounded-md">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                      <Gamepad className="w-4 h-4 text-discord-green mr-2" />
                                      <span>{game.gameName}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="flex items-center text-xs text-gray-400">
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>Last: {formatDate(game.releaseDate)}</span>
                                      </div>

                                      {editingGameSettings && editingGameSettings.channelId === channel.id && editingGameSettings.gameId === game.id ? (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="text-gray-400 hover:text-white h-8 p-0 w-8"
                                          onClick={() => setEditingGameSettings(null)}
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      ) : (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="text-gray-400 hover:text-white h-8 p-0 w-8"
                                          onClick={() => setEditingGameSettings({ channelId: channel.id, gameId: game.id })}
                                        >
                                          <Settings className="w-4 h-4" />
                                        </Button>
                                      )}

                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-gray-400 hover:text-red-500 h-8 p-0 w-8"
                                        onClick={() => handleUnlinkGame(channel.id, game.gameName)}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {editingGameSettings && editingGameSettings.channelId === channel.id && editingGameSettings.gameId === game.id && (
                                    <div className="mt-2 p-2 bg-discord-dark/50 rounded-md">
                                      <h4 className="text-sm font-medium mb-2">Notification Settings</h4>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center justify-between text-sm bg-discord-darker p-2 rounded">
                                          <div className="flex items-center">
                                            <Trophy className="w-3 h-3 text-yellow-500 mr-1" />
                                            <span>World Records</span>
                                          </div>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2"
                                            onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'worldRecords')}
                                          >
                                            On
                                          </Button>
                                        </div>

                                        <div className="flex items-center justify-between text-sm bg-discord-darker p-2 rounded">
                                          <div className="flex items-center">
                                            <Medal className="w-3 h-3 text-blue-400 mr-1" />
                                            <span>Top 3</span>
                                          </div>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2"
                                            onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'top3')}
                                          >
                                            On
                                          </Button>
                                        </div>

                                        <div className="flex items-center justify-between text-sm bg-discord-darker p-2 rounded">
                                          <div className="flex items-center">
                                            <Zap className="w-3 h-3 text-purple-400 mr-1" />
                                            <span>New Runs</span>
                                          </div>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2"
                                            onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'newRuns')}
                                          >
                                            On
                                          </Button>
                                        </div>

                                        <div className="flex items-center justify-between text-sm bg-discord-darker p-2 rounded">
                                          <div className="flex items-center">
                                            <Flag className="w-3 h-3 text-red-400 mr-1" />
                                            <span>Personal Bests</span>
                                          </div>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2"
                                            onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'personalBests')}
                                          >
                                            On
                                          </Button>
                                        </div>

                                        <div className="flex items-center justify-between text-sm bg-discord-darker p-2 rounded">
                                          <div className="flex items-center">
                                            <FileCheck className="w-3 h-3 text-green-400 mr-1" />
                                            <span>Approved Runs</span>
                                          </div>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2"
                                            onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'approvedRuns')}
                                          >
                                            On
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "games" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Game Tracking</h1>
                <div className="glass border-0 p-12 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Gamepad className="w-16 h-16 text-discord-blurple mx-auto mb-4 opacity-40" />
                    <h3 className="text-xl font-semibold mb-2">Select a Guild First</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      To configure game tracking, first select a guild from the Discord Guilds section.
                    </p>
                    <Button
                      className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                      onClick={() => setActiveTab("guilds")}
                    >
                      <Server className="mr-2 h-4 w-4" />
                      Go to Guilds
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Settings</h1>
                <div className="space-y-6">
                  <div className="glass p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">User Settings</h2>
                    <p className="text-gray-300 mb-4">
                      Connect your speedrun.com account to allow the bot to mention you on Discord when your runs are detected.
                    </p>

                    <div className="bg-discord-dark/50 p-4 rounded-md border border-discord-blurple/30 mb-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-yellow-500/20 rounded p-2">
                          <Bell className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-300 text-sm">
                            <strong>Privacy Note:</strong> Temporarily pasting your speedrun.com API key will allow the bot to verify your identity and @-mention you on Discord when your runs are detected. Your API key is only used for verification and is not stored on our servers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          speedrun.com Username
                        </label>
                        <input
                          type="text"
                          className="w-full bg-discord-dark border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none"
                          placeholder="Your speedrun.com username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          speedrun.com API Key (temporary verification only)
                        </label>
                        <input
                          type="password"
                          className="w-full bg-discord-dark border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none"
                          placeholder="Paste your API key for verification"
                        />
                        <p className="mt-1 text-sm text-gray-400">
                          Find your API key in your speedrun.com account settings.
                        </p>
                      </div>

                      <Button className="bg-discord-blurple hover:bg-discord-blurple/90 text-white">
                        <UserCheck className="mr-2 w-4 h-4" />
                        Verify Identity
                      </Button>
                    </div>
                  </div>

                  {/* Share Section */}
                  <div className="glass p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">Share speedrun.bot</h2>
                    <p className="text-gray-300 mb-4">
                      Share speedrun.bot with your friends and communities to help spread the word about this free Discord bot.
                    </p>

                    <div className="bg-discord-dark/50 p-4 rounded-md mb-4">
                      <p className="text-sm text-gray-300 mb-3">
                        Check out speedrun.bot! It's a great Discord bot for tracking speedruns from speedrun.com. Add it to your server: https://speedrun.bot/invite
                      </p>
                      <Button
                        onClick={handleCopyShareText}
                        className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                      >
                        <Copy className="mr-2 w-4 h-4" />
                        {notificationCopied ? "Copied!" : "Copy to Clipboard"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
