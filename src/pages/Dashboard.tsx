import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Gamepad,
  Settings,
  Server,
  Shield,
  ShieldCheck,
  X,
  Plus,
  MessageSquare,
  ArrowLeft,
  Trophy,
  Medal,
  Zap,
  ExternalLink,
  Copy,
  Bot,
  Check,
  ShieldAlert,
  Loader2,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Footer from "@/components/Footer";
import AuthStatus from "@/components/AuthStatus";
import DashboardMenu from "@/components/DashboardMenu";
import api from "@/lib/api";
import { isTokenValid, logout } from "@/lib/auth";

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
  moderator: DiscordGuild[];
}

interface Game {
  id: string;
  gameName: string;
  names: {
    international: string;
  }
  srcGameId: string;
  abbreviation: string;
  weblink: string;
  discord: string;
  released: number;
  releaseDate: string;
  notificationType?: string; // Add notification setting field
  categoryIds?: string[];
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

interface GameCategory {
  id: string;
  name: string;
  type: string; // "per-game" or "per-level"
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("guilds");
  const [activeGuildCategory, setActiveGuildCategory] = useState("all");
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [gameSearchTerm, setGameSearchTerm] = useState("");
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [notificationCopied, setNotificationCopied] = useState(false);
  const [guilds, setGuilds] = useState<Guilds>({
    owner: [],
    admin: [],
    moderator: []
  });
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLinkingGame, setIsLinkingGame] = useState<string | null>(null);
  const [isUnlinkingGame, setIsUnlinkingGame] = useState<string | null>(null);
  const [isFetchingGuilds, setIsFetchingGuilds] = useState(false);
  const [isFetchingChannels, setIsFetchingChannels] = useState(false);
  const [categoryData, setCategoryData] = useState<Record<string, GameCategory[]>>({});
  const [expandedCategoryGame, setExpandedCategoryGame] = useState<string | null>(null);
  const [isFetchingCategories, setIsFetchingCategories] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced save infrastructure for game settings (notification type + category filter)
  const saveTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const pendingValuesRef = useRef<Record<string, { notificationType: string; categoryIds: string[] }>>({});
  const lastConfirmedRef = useRef<Record<string, { notificationType: string; categoryIds: string[] }>>({});
  const inFlightRef = useRef<Set<string>>(new Set());
  const selectedGuildIdRef = useRef(selectedGuildId);
  selectedGuildIdRef.current = selectedGuildId;

  // Cleanup pending timers on unmount
  useEffect(() => {
    return () => {
      Object.values(saveTimersRef.current).forEach(clearTimeout);
    };
  }, []);

  const scheduleGameSettingsSave = useCallback((channelId: string, gameId: string) => {
    const key = `${channelId}-${gameId}`;

    if (saveTimersRef.current[key]) {
      clearTimeout(saveTimersRef.current[key]);
    }

    saveTimersRef.current[key] = setTimeout(async () => {
      delete saveTimersRef.current[key];

      // If already saving for this key, skip — the finally block will re-trigger
      if (inFlightRef.current.has(key)) return;

      const values = pendingValuesRef.current[key];
      if (!values) return;

      inFlightRef.current.add(key);

      try {
        await api.patch(
          `/api/guilds/${selectedGuildIdRef.current}/channels/${channelId}/games/${gameId}/notifications`,
          values
        );
        lastConfirmedRef.current[key] = { ...values };
        // Only clear pending if no new change arrived while saving
        if (pendingValuesRef.current[key] === values) {
          delete pendingValuesRef.current[key];
        }
      } catch (error) {
        console.error("Error saving game settings:", error);
        // Only revert and toast if no new change is pending
        if (pendingValuesRef.current[key] === values) {
          const confirmed = lastConfirmedRef.current[key];
          if (confirmed) {
            setChannels(prev =>
              prev.map(ch => {
                if (ch.id === channelId && ch.games) {
                  return {
                    ...ch,
                    games: ch.games.map(g =>
                      g.id === gameId
                        ? { ...g, notificationType: confirmed.notificationType, categoryIds: confirmed.categoryIds }
                        : g
                    )
                  };
                }
                return ch;
              })
            );
          }
          delete pendingValuesRef.current[key];
          toast({
            title: "Failed to save settings",
            description: "Your changes couldn't be saved. They have been reverted.",
            variant: "destructive",
          });
        }
      } finally {
        inFlightRef.current.delete(key);
        // If new changes arrived during the save, trigger another save
        if (pendingValuesRef.current[key]) {
          scheduleGameSettingsSave(channelId, gameId);
        }
      }
    }, 600);
  }, []);

  useEffect(() => {
    // Redirect to login if not signed in or token expired
    if (!isTokenValid()) {
      logout();
      navigate("/login", { replace: true });
      return;
    }
    const fetchGuilds = async () => {
      setIsFetchingGuilds(true);
      try {
        const response = await api.get(`/api/user/guilds`);

        // Process the guilds into the correct categories
        const ownedGuilds = response.data.ownedGuilds || [];
        const processedGuilds: Guilds = {
          owner: ownedGuilds.filter(guild => guild.owner),
          admin: ownedGuilds.filter(guild => !guild.owner && (guild.permissions & 0x8) === 0x8), // Check for ADMINISTRATOR permission
          moderator: ownedGuilds.filter(guild => !guild.owner && (guild.permissions & 0x8) !== 0x8 && (guild.permissions & 0x10) === 0x10) // Check for MANAGE_CHANNELS permission
        };

        setGuilds(processedGuilds);
      } catch (error) {
        console.error("Error fetching guilds:", error);
      } finally {
        setIsFetchingGuilds(false);
      }
    };

    fetchGuilds();
  }, []);

  useEffect(() => {
    const fetchGuildChannels = async () => {
      if (!selectedGuildId) return;

      setIsFetchingChannels(true);
      try {
        const response = await api.get<GuildChannelsResponse>(
          `/api/guilds/${selectedGuildId}/channels`
        );
        setChannels(response.data.guildChannels);
      } catch (error) {
        console.error("Error fetching guild channels:", error);
      } finally {
        setIsFetchingChannels(false);
      }
    };

    fetchGuildChannels();
  }, [selectedGuildId]);

  // Combine all guilds for the "all" category
  const allGuilds = [
    ...guilds.owner,
    ...guilds.admin,
    ...guilds.moderator
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
  };

  // Link a game to a channel
  const handleLinkGame = async (channelId: string, gameId: string) => {
    setIsLinkingGame(gameId);
    try {
      const selectedGame = searchResults.find(g => g.id === gameId);
      if (!selectedGame) return;

      await api.post(
        `/api/guilds/${selectedGuildId}/channels/${channelId}/games/${selectedGame.id}`,
        {}
      );

      // Update the channels state with the new game
      setChannels(prevChannels =>
        prevChannels.map(channel => {
          if (channel.id === channelId) {
            selectedGame.gameName = selectedGame.names.international;
            return {
              ...channel,
              games: [...(channel.games || []), selectedGame]
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
    } finally {
      setIsLinkingGame(null);
    }
  };

  // Unlink a game from a channel
  const handleUnlinkGame = async (channelId: string, gameName: string) => {
    const unlinkKey = `${channelId}-${gameName}`;
    setIsUnlinkingGame(unlinkKey);
    try {
      await api.delete(
        `/api/guilds/${selectedGuildId}/channels/${channelId}/games/${gameName}`
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
    } finally {
      setIsUnlinkingGame(null);
    }
  };

  // Update game notification settings (debounced)
  const handleUpdateNotificationSettings = (channelId: string, gameId: string, setting: string) => {
    const key = `${channelId}-${gameId}`;

    // Initialize confirmed state on first change
    if (!lastConfirmedRef.current[key]) {
      const channel = channels.find(c => c.id === channelId);
      const game = channel?.games?.find(g => g.id === gameId);
      lastConfirmedRef.current[key] = {
        notificationType: game?.notificationType || 'world-records',
        categoryIds: game?.categoryIds || [],
      };
    }

    // Optimistic UI update
    setChannels(prevChannels =>
      prevChannels.map(channel => {
        if (channel.id === channelId && channel.games) {
          return {
            ...channel,
            games: channel.games.map(game =>
              game.id === gameId
                ? { ...game, notificationType: setting }
                : game
            )
          };
        }
        return channel;
      })
    );

    // Merge into pending values and schedule debounced save
    const existing = pendingValuesRef.current[key] || lastConfirmedRef.current[key];
    pendingValuesRef.current[key] = { ...existing, notificationType: setting };
    scheduleGameSettingsSave(channelId, gameId);
  };

  // Get current notification setting for a game
  const getCurrentNotificationSetting = (channelId: string, gameId: string) => {
    // Find the game in the channels data
    const channel = channels.find(c => c.id === channelId);
    const game = channel?.games?.find(g => g.id === gameId);

    // Return the notification type from the game data, or default to 'world-records'
    const setting = game?.notificationType || 'world-records';

    console.log(`Getting notification setting for channel ${channelId}, game ${gameId}:`, setting);
    console.log("Game data:", game);

    return setting;
  };

  // Get display name for notification types
  const getNotificationDisplayName = (type: string) => {
    switch (type) {
      case 'any':
        return 'Any New Run';
      case 'top-3':
        return 'Top 3 Placements';
      case 'world-records':
        return 'World Records Only';
      default:
        return 'World Records Only';
    }
  };

  // Get icon for notification types
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'any':
        return <Zap className="w-4 h-4 text-purple-400" />;
      case 'top-3':
        return <Medal className="w-4 h-4 text-blue-400" />;
      case 'world-records':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      default:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
    }
  };

  // Copy share text
  const handleCopyShareText = () => {
    const shareText = "Check out speedrun.watch! It's a great Discord bot for tracking speedruns from speedrun.com. Add it to your server: https://speedrun.watch/invite";
    navigator.clipboard.writeText(shareText)
      .then(() => {
        setNotificationCopied(true);
        setTimeout(() => setNotificationCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Fetch categories for a game (cached in state)
  const fetchCategories = async (gameId: string) => {
    if (categoryData[gameId]) return; // already cached
    setIsFetchingCategories(gameId);
    try {
      const response = await api.get(`/api/games/${gameId}/categories`);
      setCategoryData(prev => ({ ...prev, [gameId]: response.data.categories }));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsFetchingCategories(null);
    }
  };

  // Toggle category picker expand/collapse
  const handleToggleCategoryPicker = (channelId: string, gameId: string) => {
    const key = `${channelId}-${gameId}`;
    if (expandedCategoryGame === key) {
      setExpandedCategoryGame(null);
    } else {
      setExpandedCategoryGame(key);
      fetchCategories(gameId);
    }
  };

  // Update category filter for a game (debounced)
  const handleUpdateCategoryFilter = (channelId: string, gameId: string, newCategoryIds: string[]) => {
    const key = `${channelId}-${gameId}`;

    // Initialize confirmed state on first change
    if (!lastConfirmedRef.current[key]) {
      const channel = channels.find(c => c.id === channelId);
      const game = channel?.games?.find(g => g.id === gameId);
      lastConfirmedRef.current[key] = {
        notificationType: game?.notificationType || 'world-records',
        categoryIds: game?.categoryIds || [],
      };
    }

    // Optimistic UI update
    setChannels(prevChannels =>
      prevChannels.map(channel => {
        if (channel.id === channelId && channel.games) {
          return {
            ...channel,
            games: channel.games.map(game =>
              game.id === gameId
                ? { ...game, categoryIds: newCategoryIds }
                : game
            )
          };
        }
        return channel;
      })
    );

    // Merge into pending values and schedule debounced save
    const existing = pendingValuesRef.current[key] || lastConfirmedRef.current[key];
    pendingValuesRef.current[key] = { ...existing, categoryIds: newCategoryIds };
    scheduleGameSettingsSave(channelId, gameId);
  };

  // Get category label for display
  const getCategoryLabel = (channelId: string, gameId: string) => {
    const channel = channels.find(c => c.id === channelId);
    const game = channel?.games?.find(g => g.id === gameId);
    const ids = game?.categoryIds || [];
    if (ids.length === 0) return "All";
    return `${ids.length}`;
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
        const response = await api.get(`/api/search/games/${gameSearchTerm}`);

        setSearchResults(response.data.games.data);
      } catch (error) {
        console.error("Error searching games:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  }, [gameSearchTerm]);

  return (
    <div className="min-h-screen bg-discord-darker text-white flex flex-col overflow-x-hidden max-w-full">
      {/* Header */}
      <header className="bg-discord-dark py-4 border-b border-gray-800 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Bell className="w-6 h-6 text-discord-blurple" />
              <span className="text-xl font-bold bg-gradient-to-r from-discord-blurple to-discord-fuchsia bg-clip-text text-transparent">
                speedrun.watch
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <AuthStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full">
        <div className="container mx-auto py-8 w-full">
          <div className="flex flex-col md:flex-row gap-8 w-full">
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
                  <h1 className="text-2xl font-bold mb-6">Add speedrun.watch to Discord</h1>

                  <div className="space-y-10">
                    {/* Step 1 */}
                    <div className="glass rounded-lg p-6 relative">
                      <div className="absolute -left-3 -top-3 bg-discord-blurple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                      <h2 className="text-2xl font-bold mb-4">Authorize the Bot</h2>
                      <p className="mb-5 text-gray-300">
                        Click the button below to authorize speedrun.watch with your Discord account. You'll be redirected to Discord's authorization page.
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
                  <h1 className="text-2xl font-bold mb-2">
                    {activeGuildCategory === "all" && "All Discord Guilds"}
                    {activeGuildCategory === "owner" && "Owner Discord Guilds"}
                    {activeGuildCategory === "admin" && "Admin Discord Guilds"}
                    {activeGuildCategory === "moderator" && "Moderator Discord Guilds"}
                  </h1>
                  <p className="text-gray-400 text-sm mb-6">
                    {activeGuildCategory === "all" && "Servers where the bot is installed"}
                    {activeGuildCategory === "owner" && "Servers where the bot is installed and you are the owner"}
                    {activeGuildCategory === "admin" && "Servers where the bot is installed and you have administrator permissions"}
                    {activeGuildCategory === "moderator" && "Servers where the bot is installed and you have manage channels permissions"}
                  </p>

                  {isFetchingGuilds ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 text-discord-blurple mx-auto mb-3 animate-spin" />
                        <p className="text-gray-400">Loading guilds...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {(activeGuildCategory === "all" ? allGuilds :
                        activeGuildCategory === "owner" ? guilds.owner :
                          activeGuildCategory === "admin" ? guilds.admin :
                            guilds.moderator
                      ).map(guild => (
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
                            </div>
                            <div className="flex items-center space-x-2">
                              {guild.owner ? (
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
                                onClick={() => setSelectedGuildId(guild.id)}
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
                      {allGuilds.find(g => g.id === selectedGuildId)?.name}'s Notification Channels
                    </h1>
                  </div>

                  {isFetchingChannels ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 text-discord-blurple mx-auto mb-3 animate-spin" />
                        <p className="text-gray-400">Loading channels...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {channels
                        .filter(channel => channel.type === 0) // Only show text channels
                        .map(channel => (
                          <div key={channel.id} className="bg-discord-dark rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-medium flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2 text-discord-blurple" />
                                #{channel.name}
                              </h3>
                              {activeChannelId !== channel.id && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-transparent border-white/10 text-white hover:bg-white/5"
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
                                          className="p-2 hover:bg-discord-dark/70 cursor-pointer text-gray-300 hover:text-white flex items-center justify-between"
                                          onClick={() => {
                                            if (!isLinkingGame) {
                                              handleLinkGame(channel.id, game.id);
                                            }
                                          }}
                                        >
                                          <span>{game.names.international}</span>
                                          {isLinkingGame === game.id && (
                                            <Loader2 className="h-4 w-4 animate-spin text-discord-blurple" />
                                          )}
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
                                  <div key={game.id} className="p-3 bg-discord-dark/30 rounded-md">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                      <div className="flex items-center space-x-3">
                                        {game.assets && game.assets.icon && game.assets.icon.uri ? (
                                          <img
                                            src={game.assets.icon.uri}
                                            alt={game.gameName + ' icon'}
                                            className="w-5 h-5 rounded object-contain flex-shrink-0 bg-gray-800"
                                          />
                                        ) : (
                                          <Gamepad className="w-4 h-4 text-discord-green flex-shrink-0" />
                                        )}
                                        {game.weblink ? (
                                          <a
                                            href={game.weblink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-200 no-underline hover:underline"
                                            style={{ textDecoration: 'none' }}
                                          >
                                            {game.gameName}
                                          </a>
                                        ) : (
                                          <span className="text-gray-200">{game.gameName}</span>
                                        )}
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        <Select
                                          value={getCurrentNotificationSetting(channel.id, game.id)}
                                          onValueChange={(value) => handleUpdateNotificationSettings(channel.id, game.id, value)}
                                        >
                                          <SelectTrigger className="w-full lg:w-[220px] bg-discord-dark border-gray-600 text-gray-200">
                                            <SelectValue placeholder="Select notification type" />
                                          </SelectTrigger>
                                          <SelectContent className="bg-discord-dark border-gray-600">
                                            <SelectItem value="any" className="text-gray-200 focus:bg-discord-darker focus:text-white">
                                              <div className="flex items-center space-x-2">
                                                <Zap className="w-4 h-4 text-purple-400" />
                                                <span>Any New Run</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="top-3" className="text-gray-200 focus:bg-discord-darker focus:text-white">
                                              <div className="flex items-center space-x-2">
                                                <Medal className="w-4 h-4 text-blue-400" />
                                                <span>Top 3 Placements</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="world-records" className="text-gray-200 focus:bg-discord-darker focus:text-white">
                                              <div className="flex items-center space-x-2">
                                                <Trophy className="w-4 h-4 text-yellow-500" />
                                                <span>World Records Only</span>
                                              </div>
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>

                                        <button
                                          className="flex h-8 items-center gap-1.5 rounded-md border border-gray-600 bg-discord-dark px-2.5 text-xs text-gray-200 hover:bg-discord-dark/80 transition-colors"
                                          onClick={() => handleToggleCategoryPicker(channel.id, game.id)}
                                        >
                                          <Filter className="w-3.5 h-3.5 text-gray-400" />
                                          <span>Categories: {getCategoryLabel(channel.id, game.id)}</span>
                                          {expandedCategoryGame === `${channel.id}-${game.id}` ? (
                                            <ChevronUp className="h-3.5 w-3.5 opacity-50" />
                                          ) : (
                                            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                                          )}
                                        </button>

                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="text-gray-400 hover:text-red-500 h-8 w-8 p-0 flex-shrink-0"
                                          onClick={() => handleUnlinkGame(channel.id, game.gameName)}
                                          disabled={isUnlinkingGame === `${channel.id}-${game.gameName}`}
                                        >
                                          {isUnlinkingGame === `${channel.id}-${game.gameName}` ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                          ) : (
                                            <X className="w-4 h-4" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Category filter picker */}
                                    {expandedCategoryGame === `${channel.id}-${game.id}` && (
                                      <div className="mt-3 p-3 rounded-md">
                                        {isFetchingCategories === game.id ? (
                                          <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Loading categories...</span>
                                          </div>
                                        ) : categoryData[game.id] ? (
                                          <div>
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="text-xs text-gray-400 font-medium">Filter by category</span>
                                              {(game.categoryIds || []).length > 0 && (
                                                <button
                                                  className="text-xs text-discord-blurple hover:underline"
                                                  onClick={() => handleUpdateCategoryFilter(channel.id, game.id, [])}
                                                >
                                                  Clear filter
                                                </button>
                                              )}
                                            </div>
                                            {/* Full Game categories */}
                                            {categoryData[game.id].filter(c => c.type === "per-game").length > 0 && (
                                              <div className="mb-2">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider">Full Game</span>
                                                <div className="mt-1 space-y-1">
                                                  {categoryData[game.id].filter(c => c.type === "per-game").map(cat => {
                                                    const currentIds = game.categoryIds || [];
                                                    const isSelected = currentIds.length === 0 || currentIds.includes(cat.id);
                                                    return (
                                                      <label key={cat.id} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer py-0.5">
                                                        <input
                                                          type="checkbox"
                                                          checked={isSelected}
                                                          onChange={() => {
                                                            let newIds: string[];
                                                            if (currentIds.length === 0) {
                                                              // "All" mode: unchecking one means select all except this one
                                                              newIds = categoryData[game.id].map(c => c.id).filter(id => id !== cat.id);
                                                            } else if (isSelected) {
                                                              newIds = currentIds.filter(id => id !== cat.id);
                                                              // If removing makes it match all categories, clear to empty (= all)
                                                            } else {
                                                              newIds = [...currentIds, cat.id];
                                                            }
                                                            // If all categories are now selected, clear to empty array (= all)
                                                            if (newIds.length >= categoryData[game.id].length) {
                                                              newIds = [];
                                                            }
                                                            handleUpdateCategoryFilter(channel.id, game.id, newIds);
                                                          }}
                                                          className="rounded border-gray-600 bg-discord-dark text-discord-blurple focus:ring-discord-blurple"
                                                        />
                                                        <span>{cat.name}</span>
                                                      </label>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            )}
                                            {/* Individual Level categories */}
                                            {categoryData[game.id].filter(c => c.type === "per-level").length > 0 && (
                                              <div>
                                                <span className="text-xs text-gray-500 uppercase tracking-wider">Individual Level</span>
                                                <div className="mt-1 space-y-1">
                                                  {categoryData[game.id].filter(c => c.type === "per-level").map(cat => {
                                                    const currentIds = game.categoryIds || [];
                                                    const isSelected = currentIds.length === 0 || currentIds.includes(cat.id);
                                                    return (
                                                      <label key={cat.id} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer py-0.5">
                                                        <input
                                                          type="checkbox"
                                                          checked={isSelected}
                                                          onChange={() => {
                                                            let newIds: string[];
                                                            if (currentIds.length === 0) {
                                                              newIds = categoryData[game.id].map(c => c.id).filter(id => id !== cat.id);
                                                            } else if (isSelected) {
                                                              newIds = currentIds.filter(id => id !== cat.id);
                                                            } else {
                                                              newIds = [...currentIds, cat.id];
                                                            }
                                                            if (newIds.length >= categoryData[game.id].length) {
                                                              newIds = [];
                                                            }
                                                            handleUpdateCategoryFilter(channel.id, game.id, newIds);
                                                          }}
                                                          className="rounded border-gray-600 bg-discord-dark text-discord-blurple focus:ring-discord-blurple"
                                                        />
                                                        <span>{cat.name}</span>
                                                      </label>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <span className="text-sm text-gray-400">Failed to load categories</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
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
                  <h1 className="text-2xl font-bold mb-6">Share speedrun.watch</h1>
                  <div className="glass p-6 rounded-lg">
                    <p className="text-gray-300 mb-4">
                      Here's a quick way for you to share the bot on Discord!
                    </p>

                    <div className="bg-discord-dark/50 p-4 rounded-md mb-4">
                      <p className="text-sm text-gray-300 mb-3">
                        Check out speedrun.watch - get Discord notifications when new speedruns are submitted or WRs are set on speedrun.com. Add it to your server: https://speedrun.watch
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
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
