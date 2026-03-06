import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Gamepad,
  Server,
  Copy,
} from "lucide-react";
import Footer from "@/components/Footer";
import AuthStatus from "@/components/AuthStatus";
import DashboardMenu from "@/components/DashboardMenu";
import GuildSelector from "@/components/dashboard/GuildSelector";
import ChannelList from "@/components/dashboard/ChannelList";
import AddBotTab from "@/components/dashboard/AddBotTab";
import SrcLinkTab from "@/components/dashboard/SrcLinkTab";
import api from "@/lib/api";
import { isTokenValid, logout } from "@/lib/auth";
import { useGameSettings } from "@/hooks/useGameSettings";
import type { DiscordGuild, Guilds, DiscordChannel, Game, GameCategory, GuildChannelsResponse } from "@/types/dashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { guildId: selectedGuildId } = useParams<{ guildId: string }>();

  const getTabFromPath = () => {
    if (location.pathname === '/dashboard/src-link') return 'src-link';
    if (location.pathname === '/dashboard/share') return 'settings';
    return 'guilds';
  };
  const [activeTab, setActiveTab] = useState(getTabFromPath);
  const [activeGuildCategory, setActiveGuildCategory] = useState("all");
  const [gameSearchTerm, setGameSearchTerm] = useState("");
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [notificationCopied, setNotificationCopied] = useState(false);
  const [guilds, setGuilds] = useState<Guilds>({
    owner: [],
    admin: [],
    moderator: [],
    superadmin: [],
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
  const selectedGuildIdRef = useRef(selectedGuildId);
  selectedGuildIdRef.current = selectedGuildId;

  const {
    handleUpdateNotificationSettings,
    handleUpdateCategoryFilter,
    cleanup: cleanupGameSettings,
  } = useGameSettings(selectedGuildIdRef, setChannels, channels);

  useEffect(() => {
    document.title = "Dashboard - speedrun.watch";
  }, []);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  useEffect(() => {
    return cleanupGameSettings;
  }, [cleanupGameSettings]);

  useEffect(() => {
    if (!isTokenValid()) {
      logout();
      navigate("/login", { replace: true });
      return;
    }
    const fetchGuilds = async () => {
      setIsFetchingGuilds(true);
      try {
        const response = await api.get(`/api/user/guilds`);
        const ownedGuilds: DiscordGuild[] = response.data.ownedGuilds || [];
        const processedGuilds: Guilds = {
          owner: ownedGuilds.filter(guild => !guild.superadmin && guild.owner),
          admin: ownedGuilds.filter(guild => !guild.superadmin && !guild.owner && (guild.permissions & 0x8) === 0x8),
          moderator: ownedGuilds.filter(guild => !guild.superadmin && !guild.owner && (guild.permissions & 0x8) !== 0x8 && (guild.permissions & 0x10) === 0x10),
          superadmin: ownedGuilds.filter(guild => guild.superadmin),
        };
        setGuilds(processedGuilds);
      } catch (error) {
        console.error("Error fetching guilds:", error);
      } finally {
        setIsFetchingGuilds(false);
      }
    };

    fetchGuilds();
  }, [navigate]);

  useEffect(() => {
    const fetchGuildChannels = async () => {
      if (!selectedGuildId) return;
      setChannels([]);
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

  const handleBackToGuilds = () => {
    navigate('/dashboard');
    setActiveChannelId(null);
  };

  const handleLinkGame = async (channelId: string, gameId: string) => {
    setIsLinkingGame(gameId);
    try {
      const selectedGame = searchResults.find(g => g.id === gameId);
      if (!selectedGame) return;

      await api.post(
        `/api/guilds/${selectedGuildId}/channels/${channelId}/games/${selectedGame.id}`,
        {}
      );

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

      setGameSearchTerm("");
      setActiveChannelId(null);
      setSearchResults([]);
    } catch (error) {
      console.error("Error linking game:", error);
    } finally {
      setIsLinkingGame(null);
    }
  };

  const handleUnlinkGame = async (channelId: string, gameId: string) => {
    const unlinkKey = `${channelId}-${gameId}`;
    setIsUnlinkingGame(unlinkKey);
    try {
      await api.delete(
        `/api/guilds/${selectedGuildId}/channels/${channelId}/games/${gameId}`
      );
      setChannels(prevChannels =>
        prevChannels.map(channel => {
          if (channel.id === channelId) {
            return {
              ...channel,
              games: channel.games?.filter(game => game.id !== gameId) || []
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

  const getCurrentNotificationSetting = (channelId: string, gameId: string) => {
    const channel = channels.find(c => c.id === channelId);
    const game = channel?.games?.find(g => g.id === gameId);
    return game?.notificationType || 'world-records';
  };

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

  const fetchCategories = async (gameId: string) => {
    if (categoryData[gameId]) return;
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

  const handleToggleCategoryPicker = (channelId: string, gameId: string) => {
    const key = `${channelId}-${gameId}`;
    if (expandedCategoryGame === key) {
      setExpandedCategoryGame(null);
    } else {
      setExpandedCategoryGame(key);
      fetchCategories(gameId);
    }
  };

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
              onNavigateToDashboard={() => navigate('/dashboard')}
              guilds={guilds}
            />

            {/* Main Content Area */}
            <div className="flex-1 glass rounded-lg p-6">
              {activeTab === "add-bot" && (
                <AddBotTab onGoToDashboard={() => setActiveTab("guilds")} />
              )}

              {activeTab === "guilds" && !selectedGuildId && (
                <GuildSelector
                  activeGuildCategory={activeGuildCategory}
                  guilds={guilds}
                  isFetchingGuilds={isFetchingGuilds}
                  isFetchingChannels={isFetchingChannels}
                  selectedGuildId={selectedGuildId}
                  onSelectGuild={(guildId) => navigate(`/dashboard/${guildId}`)}
                />
              )}

              {activeTab === "guilds" && selectedGuildId && (
                <ChannelList
                  channels={channels}
                  guilds={guilds}
                  selectedGuildId={selectedGuildId}
                  isFetchingChannels={isFetchingChannels}
                  activeChannelId={activeChannelId}
                  gameSearchTerm={gameSearchTerm}
                  searchResults={searchResults}
                  isSearching={isSearching}
                  isLinkingGame={isLinkingGame}
                  isUnlinkingGame={isUnlinkingGame}
                  expandedCategoryGame={expandedCategoryGame}
                  isFetchingCategories={isFetchingCategories}
                  categoryData={categoryData}
                  onBackToGuilds={handleBackToGuilds}
                  onSetActiveChannelId={setActiveChannelId}
                  onSearchTermChange={setGameSearchTerm}
                  onLinkGame={handleLinkGame}
                  onUnlinkGame={handleUnlinkGame}
                  onUpdateNotification={handleUpdateNotificationSettings}
                  onToggleCategoryPicker={handleToggleCategoryPicker}
                  onUpdateCategoryFilter={handleUpdateCategoryFilter}
                  getCurrentNotificationSetting={getCurrentNotificationSetting}
                  getCategoryLabel={getCategoryLabel}
                />
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

              {activeTab === "src-link" && (
                <SrcLinkTab />
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
