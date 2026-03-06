import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Gamepad,
  X,
  Plus,
  ArrowLeft,
  Trophy,
  Medal,
  Zap,
  Loader2,
  Mail,
  Filter,
  ChevronDown,
  ChevronUp,
  Hash,
  HelpCircle,
  Megaphone,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GameSearch from "./GameSearch";
import type { DiscordChannel, Game, GameCategory, Guilds } from "@/types/dashboard";

interface ChannelListProps {
  channels: DiscordChannel[];
  guilds: Guilds;
  selectedGuildId: string;
  isFetchingChannels: boolean;
  activeChannelId: string | null;
  gameSearchTerm: string;
  searchResults: Game[];
  isSearching: boolean;
  isLinkingGame: string | null;
  isUnlinkingGame: string | null;
  expandedCategoryGame: string | null;
  isFetchingCategories: string | null;
  categoryData: Record<string, GameCategory[]>;
  onBackToGuilds: () => void;
  onSetActiveChannelId: (channelId: string | null) => void;
  onSearchTermChange: (term: string) => void;
  onLinkGame: (channelId: string, gameId: string) => void;
  onUnlinkGame: (channelId: string, gameId: string) => void;
  onUpdateNotification: (channelId: string, gameId: string, setting: string) => void;
  onToggleCategoryPicker: (channelId: string, gameId: string) => void;
  onUpdateCategoryFilter: (channelId: string, gameId: string, categoryIds: string[]) => void;
  getCurrentNotificationSetting: (channelId: string, gameId: string) => string;
  getCategoryLabel: (channelId: string, gameId: string) => string;
}

const ChannelList = ({
  channels,
  guilds,
  selectedGuildId,
  isFetchingChannels,
  activeChannelId,
  gameSearchTerm,
  searchResults,
  isSearching,
  isLinkingGame,
  isUnlinkingGame,
  expandedCategoryGame,
  isFetchingCategories,
  categoryData,
  onBackToGuilds,
  onSetActiveChannelId,
  onSearchTermChange,
  onLinkGame,
  onUnlinkGame,
  onUpdateNotification,
  onToggleCategoryPicker,
  onUpdateCategoryFilter,
  getCurrentNotificationSetting,
  getCategoryLabel,
}: ChannelListProps) => {
  const allGuilds = [
    ...guilds.owner,
    ...guilds.admin,
    ...guilds.moderator,
    ...guilds.superadmin,
  ];

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4 hover:bg-discord-dark/50"
          onClick={onBackToGuilds}
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
            <p className="text-gray-400">Loading channels from Discord...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {channels
            .filter(channel => channel.type === 0 || channel.type === 5)
            .sort((a, b) => a.position - b.position)
            .map(channel => (
              <div key={channel.id} className="bg-discord-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium flex items-center">
                    {channel.type === 5 ? (
                      <Megaphone className="w-5 h-5 mr-2 text-discord-blurple" />
                    ) : (
                      <Hash className="w-5 h-5 mr-2 text-discord-blurple" />
                    )}
                    {channel.name}
                    {/^\d+$/.test(channel.name) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 ml-1.5 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Maybe deleted or private</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </h3>
                  {activeChannelId !== channel.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-white/10 text-white hover:bg-white/5"
                      onClick={() => onSetActiveChannelId(channel.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Link Game
                    </Button>
                  )}
                </div>

                {activeChannelId === channel.id && (
                  <GameSearch
                    channel={channel}
                    gameSearchTerm={gameSearchTerm}
                    onSearchTermChange={onSearchTermChange}
                    searchResults={searchResults}
                    isSearching={isSearching}
                    isLinkingGame={isLinkingGame}
                    onLinkGame={onLinkGame}
                    onClose={() => onSetActiveChannelId(null)}
                  />
                )}

                {(!channel.games || channel.games.length === 0) ? (
                  <p className="text-gray-400 text-sm italic">No games linked to this channel</p>
                ) : (
                  <div className="space-y-1">
                    {channel.games.map(game => (
                      <div key={game.id} className="px-3 py-1.5 bg-discord-dark/30 rounded-md">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
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
                            <div>
                              {game.weblink ? (
                                <a
                                  href={game.weblink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-200 no-underline hover:underline"
                                >
                                  {game.gameName}
                                </a>
                              ) : (
                                <span className="text-gray-200">{game.gameName}</span>
                              )}
                              {game.notificationCount != null && game.notificationCount > 0 && (
                                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {game.notificationCount}
                                  {game.lastNotifiedAt && ` · last ${new Date(game.lastNotifiedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Select
                              value={getCurrentNotificationSetting(channel.id, game.id)}
                              onValueChange={(value) => onUpdateNotification(channel.id, game.id, value)}
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
                              className="flex h-10 min-w-[145px] items-center gap-1.5 rounded-md border border-gray-600 bg-discord-dark px-2.5 text-xs text-gray-200 hover:bg-discord-dark/80 transition-colors"
                              onClick={() => onToggleCategoryPicker(channel.id, game.id)}
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
                              onClick={() => onUnlinkGame(channel.id, game.id)}
                              disabled={isUnlinkingGame === `${channel.id}-${game.id}`}
                            >
                              {isUnlinkingGame === `${channel.id}-${game.id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Category filter picker */}
                        {expandedCategoryGame === `${channel.id}-${game.id}` && (
                          <CategoryPicker
                            game={game}
                            channelId={channel.id}
                            categoryData={categoryData[game.id]}
                            isFetching={isFetchingCategories === game.id}
                            onUpdateCategoryFilter={onUpdateCategoryFilter}
                          />
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
  );
};

interface CategoryPickerProps {
  game: Game;
  channelId: string;
  categoryData: GameCategory[] | undefined;
  isFetching: boolean;
  onUpdateCategoryFilter: (channelId: string, gameId: string, categoryIds: string[]) => void;
}

const CategoryPicker = ({
  game,
  channelId,
  categoryData,
  isFetching,
  onUpdateCategoryFilter,
}: CategoryPickerProps) => {
  const handleCategoryToggle = (catId: string) => {
    if (!categoryData) return;
    const currentIds = game.categoryIds || [];
    const isSelected = currentIds.length === 0 || currentIds.includes(catId);
    let newIds: string[];

    if (currentIds.length === 0) {
      newIds = categoryData.map(c => c.id).filter(id => id !== catId);
    } else if (isSelected) {
      newIds = currentIds.filter(id => id !== catId);
    } else {
      newIds = [...currentIds, catId];
    }
    if (newIds.length >= categoryData.length) {
      newIds = [];
    }
    onUpdateCategoryFilter(channelId, game.id, newIds);
  };

  return (
    <div className="mt-3 p-3 rounded-md">
      {isFetching ? (
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading categories from speedrun.com...</span>
        </div>
      ) : categoryData ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Filter by category</span>
            {(game.categoryIds || []).length > 0 && (
              <button
                className="text-xs text-discord-blurple hover:underline"
                onClick={() => onUpdateCategoryFilter(channelId, game.id, [])}
              >
                Clear filter
              </button>
            )}
          </div>
          <CategoryGroup
            label="Full Game"
            categories={categoryData.filter(c => c.type === "per-game")}
            currentIds={game.categoryIds || []}
            allCategories={categoryData}
            onToggle={handleCategoryToggle}
          />
          <CategoryGroup
            label="Individual Level"
            categories={categoryData.filter(c => c.type === "per-level")}
            currentIds={game.categoryIds || []}
            allCategories={categoryData}
            onToggle={handleCategoryToggle}
          />
        </div>
      ) : (
        <span className="text-sm text-gray-400">Failed to load categories</span>
      )}
    </div>
  );
};

interface CategoryGroupProps {
  label: string;
  categories: GameCategory[];
  currentIds: string[];
  allCategories: GameCategory[];
  onToggle: (catId: string) => void;
}

const CategoryGroup = ({ label, categories, currentIds, onToggle }: CategoryGroupProps) => {
  if (categories.length === 0) return null;

  return (
    <div className="mb-2">
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      <div className="mt-1 space-y-1">
        {categories.map(cat => {
          const isSelected = currentIds.length === 0 || currentIds.includes(cat.id);
          return (
            <label key={cat.id} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(cat.id)}
                className="rounded border-gray-600 bg-discord-dark text-discord-blurple focus:ring-discord-blurple"
              />
              <span>{cat.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelList;
