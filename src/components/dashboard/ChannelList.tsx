import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Twemoji } from "@/lib/twemoji";
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
  ChevronRight,
  Hash,
  HelpCircle,
  Megaphone,
  AlertTriangle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GameSearch from "./GameSearch";
import type { DiscordChannel, Game, GameCategory, SubcategoryVariable, GamePlatform, Guilds } from "@/types/dashboard";

interface ChannelListProps {
  channels: DiscordChannel[];
  guilds: Guilds;
  selectedGuildId: string;
  isFetchingChannels: boolean;
  channelFetchError: boolean;
  activeChannelId: string | null;
  gameSearchTerm: string;
  searchResults: Game[];
  isSearching: boolean;
  linkingGameIds: Set<string>;
  isUnlinkingGame: string | null;
  expandedCategoryGame: string | null;
  isFetchingCategories: string | null;
  categoryData: Record<string, GameCategory[]>;
  variableData: Record<string, SubcategoryVariable[]>;
  platformData: Record<string, GamePlatform[]>;
  onBackToGuilds: () => void;
  onSetActiveChannelId: (channelId: string | null) => void;
  onSearchTermChange: (term: string) => void;
  onLinkGame: (channelId: string, gameId: string) => void;
  onUnlinkGame: (channelId: string, gameId: string) => void;
  onUpdateNotification: (channelId: string, gameId: string, setting: string) => void;
  onToggleCategoryPicker: (channelId: string, gameId: string) => void;
  onUpdateCategoryFilter: (channelId: string, gameId: string, categoryIds: string[]) => void;
  onUpdateCategoryValueFilters: (channelId: string, gameId: string, categoryValueFilters: Record<string, Record<string, string[]>>) => void;
  onUpdateGlobalValueFilters: (channelId: string, gameId: string, globalValueFilters: Record<string, string[]>) => void;
  onUpdatePlatformFilter: (channelId: string, gameId: string, platformIds: string[]) => void;
  getCurrentNotificationSetting: (channelId: string, gameId: string) => string;
  getFilterLabel: (channelId: string, gameId: string) => string;
  flagsEnabled: boolean;
  onToggleFlags: (next: boolean) => void;
  isUpdatingFlags: boolean;
}

const ChannelList = ({
  channels,
  guilds,
  selectedGuildId,
  isFetchingChannels,
  channelFetchError,
  activeChannelId,
  gameSearchTerm,
  searchResults,
  isSearching,
  linkingGameIds,
  isUnlinkingGame,
  expandedCategoryGame,
  isFetchingCategories,
  categoryData,
  variableData,
  platformData,
  onBackToGuilds,
  onSetActiveChannelId,
  onSearchTermChange,
  onLinkGame,
  onUnlinkGame,
  onUpdateNotification,
  onToggleCategoryPicker,
  onUpdateCategoryFilter,
  onUpdateCategoryValueFilters,
  onUpdateGlobalValueFilters,
  onUpdatePlatformFilter,
  getCurrentNotificationSetting,
  getFilterLabel,
  flagsEnabled,
  onToggleFlags,
  isUpdatingFlags,
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

      <div className="bg-discord-dark/50 rounded-lg p-4 mb-6 flex items-start gap-4">
        <div className="flex items-center gap-3 pt-0.5">
          <Switch
            id="flags-enabled"
            checked={flagsEnabled}
            onCheckedChange={onToggleFlags}
            disabled={isUpdatingFlags}
          />
          <Label htmlFor="flags-enabled" className="text-sm font-medium text-gray-200 cursor-pointer">
            Show country flags
          </Label>
        </div>
        <div className="text-xs text-gray-400 flex-1 leading-relaxed">
          When on, player names appear as <span className="text-gray-200"><Twemoji text="Runner·🇺🇸" /></span>.
          When off, just <span className="text-gray-200">Runner</span>.
          {" "}
          <span className="block mt-1">
            Note: flag emojis render as country codes (e.g. <span className="text-gray-300"><Twemoji text="🇺🇸 → US" /></span>) on Windows, which lacks native flag glyphs.
            macOS, iOS, and Android display them as proper flags. Turn this off if most of your members are on Windows.
          </span>
        </div>
      </div>

      {isFetchingChannels ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-discord-blurple mx-auto mb-3 animate-spin" />
            <p className="text-gray-400">Loading channels from Discord...</p>
          </div>
        </div>
      ) : channelFetchError ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <p className="text-gray-300 font-medium">Couldn't fetch channels</p>
            <p className="text-gray-400 text-sm mt-1">Is the bot still installed in this server?</p>
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
                    linkingGameIds={linkingGameIds}
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
                          </div>

                          <div className="flex items-center space-x-2">
                            {game.notificationCount != null && game.notificationCount > 0 && (
                              <span className="text-[11px] text-gray-500 flex items-center gap-1 mr-1">
                                <Mail className="w-3 h-3" />
                                {game.notificationCount}
                                {game.lastNotifiedAt && ` · last ${new Date(game.lastNotifiedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                              </span>
                            )}
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
                              <span>Filters: {getFilterLabel(channel.id, game.id)}</span>
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

                        {/* Category / subcategory / platform filter picker */}
                        {expandedCategoryGame === `${channel.id}-${game.id}` && (
                          <FilterPicker
                            game={game}
                            channelId={channel.id}
                            categoryData={categoryData[game.id]}
                            variableData={variableData[game.id]}
                            platformData={platformData[game.id]}
                            isFetching={isFetchingCategories === game.id}
                            onUpdateCategoryFilter={onUpdateCategoryFilter}
                            onUpdateCategoryValueFilters={onUpdateCategoryValueFilters}
                            onUpdateGlobalValueFilters={onUpdateGlobalValueFilters}
                            onUpdatePlatformFilter={onUpdatePlatformFilter}
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

// Positive-selection toggle: an id in the array means "selected". An empty
// array means no filter (everything passes) — the explicit, un-inverted model.
function toggleId(currentIds: string[], id: string): string[] {
  return currentIds.includes(id)
    ? currentIds.filter(x => x !== id)
    : [...currentIds, id];
}

// --- Live "how many runs match this filter?" sample -------------------------
// A recent verified-run sample fetched straight from speedrun.com (public API,
// CORS-open) lets us tell the user when their selections match nothing — e.g.
// "GoW Ragnarök on PSP", an impossible combination the AND-ed axes allow.

interface SrcRunSample {
  category: string | null;
  values: Record<string, string>;
  platform: string | null;
}

const runSampleCache = new Map<string, SrcRunSample[]>();
const RUN_SAMPLE_SIZE = 200;

async function fetchRunSample(gameId: string): Promise<SrcRunSample[]> {
  const cached = runSampleCache.get(gameId);
  if (cached) return cached;
  const res = await fetch(
    `https://www.speedrun.com/api/v1/runs?game=${gameId}&status=verified&orderby=verify-date&direction=desc&max=${RUN_SAMPLE_SIZE}`,
  );
  if (!res.ok) throw new Error(`runs fetch failed: ${res.status}`);
  const json = await res.json();
  const runs: SrcRunSample[] = (json.data || []).map((r: {
    category?: string | null;
    values?: Record<string, string>;
    system?: { platform?: string | null };
  }) => ({
    category: r.category ?? null,
    values: r.values || {},
    platform: r.system?.platform ?? null,
  }));
  runSampleCache.set(gameId, runs);
  return runs;
}

// AND across constrained variables; a run must carry an allowed value for each.
// Mirrors the bot's matchesVariableConstraints so the count is honest.
function runMatchesVariables(
  runValues: Record<string, string>,
  constraints: Record<string, string[]>,
): boolean {
  for (const [variableId, allowed] of Object.entries(constraints || {})) {
    if (!allowed || allowed.length === 0) continue;
    const value = runValues?.[variableId];
    if (!value || !allowed.includes(value)) return false;
  }
  return true;
}

interface RunFilter {
  categoryIds: string[];
  categoryValueFilters: Record<string, Record<string, string[]>>;
  globalValueFilters: Record<string, string[]>;
  platformIds: string[];
}

// Mirror of the bot's fan-out gates (category → per-branch → global → platform),
// so the preview count matches what would actually be posted.
function runMatchesFilter(run: SrcRunSample, f: RunFilter): boolean {
  if (f.categoryIds.length > 0 && (!run.category || !f.categoryIds.includes(run.category))) {
    return false;
  }
  if (run.category) {
    const branch = f.categoryValueFilters[run.category];
    if (branch && !runMatchesVariables(run.values, branch)) return false;
  }
  if (!runMatchesVariables(run.values, f.globalValueFilters)) return false;
  if (f.platformIds.length > 0 && (!run.platform || !f.platformIds.includes(run.platform))) {
    return false;
  }
  return true;
}

interface FilterPickerProps {
  game: Game;
  channelId: string;
  categoryData: GameCategory[] | undefined;
  variableData: SubcategoryVariable[] | undefined;
  platformData: GamePlatform[] | undefined;
  isFetching: boolean;
  onUpdateCategoryFilter: (channelId: string, gameId: string, categoryIds: string[]) => void;
  onUpdateCategoryValueFilters: (channelId: string, gameId: string, categoryValueFilters: Record<string, Record<string, string[]>>) => void;
  onUpdateGlobalValueFilters: (channelId: string, gameId: string, globalValueFilters: Record<string, string[]>) => void;
  onUpdatePlatformFilter: (channelId: string, gameId: string, platformIds: string[]) => void;
}

const FilterPicker = ({
  game,
  channelId,
  categoryData,
  variableData,
  platformData,
  isFetching,
  onUpdateCategoryFilter,
  onUpdateCategoryValueFilters,
  onUpdateGlobalValueFilters,
  onUpdatePlatformFilter,
}: FilterPickerProps) => {
  const currentCategoryIds = game.categoryIds || [];
  const currentCategoryValueFilters = game.categoryValueFilters || {};
  const currentGlobalValueFilters = game.globalValueFilters || {};
  const currentPlatformIds = game.platformIds || [];

  const categories = categoryData || [];
  const variables = variableData || [];
  const platforms = platformData || [];

  const perGameCategories = categories.filter(c => c.type === "per-game");
  const perLevelCategories = categories.filter(c => c.type === "per-level");
  // Subcategory variables scoped to one category vs. applying to all (null).
  const globalVariables = variables.filter(v => v.categoryId === null);
  const variablesByCategory = new Map<string, SubcategoryVariable[]>();
  for (const v of variables) {
    if (v.categoryId) {
      const arr = variablesByCategory.get(v.categoryId) || [];
      arr.push(v);
      variablesByCategory.set(v.categoryId, arr);
    }
  }

  // A "simple" game has a single branch category (no branch to OR over) — skip
  // the category accordion entirely and show that category's subcategories flat.
  const branchCategories = [...perGameCategories, ...perLevelCategories];
  const isMultiBranch = branchCategories.length > 1;
  const singleCategory = !isMultiBranch ? branchCategories[0] : undefined;

  // Branches whose per-branch constraints already exist start expanded so the
  // user sees their active filters.
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(Object.keys(currentCategoryValueFilters)),
  );
  const toggleExpand = (catId: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });

  // Recent verified-run sample, used to preview how many runs the current
  // selections would actually match (catches impossible combinations).
  const [runSample, setRunSample] = useState<SrcRunSample[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetchRunSample(game.id)
      .then(runs => { if (alive) setRunSample(runs); })
      .catch(() => { if (alive) setRunSample(null); });
    return () => { alive = false; };
  }, [game.id]);

  const branchConstraintCount = (catId: string) =>
    Object.values(currentCategoryValueFilters[catId] || {}).reduce((n, ids) => n + ids.length, 0);

  const handleCategoryToggle = (catId: string) => {
    const next = toggleId(currentCategoryIds, catId);
    onUpdateCategoryFilter(channelId, game.id, next);
    // Deselecting a branch drops its per-branch subcategory constraints so a
    // hidden constraint can't keep excluding runs of a branch you unchecked.
    if (!next.includes(catId) && currentCategoryValueFilters[catId]) {
      const rest = { ...currentCategoryValueFilters };
      delete rest[catId];
      onUpdateCategoryValueFilters(channelId, game.id, rest);
    }
  };

  // Toggle a subcategory value within one branch. Selecting a value also
  // includes that branch (categoryIds), so "GoW1 → Platinum" means "only GoW1,
  // and only Platinum" rather than a stray constraint on an unselected branch.
  const handleCategoryValueToggle = (catId: string, variableId: string, valueId: string) => {
    const branch = currentCategoryValueFilters[catId] || {};
    const nextForVar = toggleId(branch[variableId] || [], valueId);
    const nextBranch = { ...branch };
    if (nextForVar.length === 0) delete nextBranch[variableId];
    else nextBranch[variableId] = nextForVar;

    const next = { ...currentCategoryValueFilters };
    if (Object.keys(nextBranch).length === 0) delete next[catId];
    else next[catId] = nextBranch;
    onUpdateCategoryValueFilters(channelId, game.id, next);

    // Auto-select the branch when it gains a constraint (multi-branch only; a
    // single-category game has no branch checkbox).
    if (isMultiBranch && next[catId] && !currentCategoryIds.includes(catId)) {
      onUpdateCategoryFilter(channelId, game.id, [...currentCategoryIds, catId]);
    }
  };

  const handleGlobalValueToggle = (variableId: string, valueId: string) => {
    const nextForVar = toggleId(currentGlobalValueFilters[variableId] || [], valueId);
    const next = { ...currentGlobalValueFilters };
    if (nextForVar.length === 0) delete next[variableId];
    else next[variableId] = nextForVar;
    onUpdateGlobalValueFilters(channelId, game.id, next);
  };

  const handlePlatformToggle = (platformId: string) =>
    onUpdatePlatformFilter(channelId, game.id, toggleId(currentPlatformIds, platformId));

  const hasAnyFilter =
    currentCategoryIds.length > 0 ||
    Object.keys(currentCategoryValueFilters).length > 0 ||
    Object.keys(currentGlobalValueFilters).length > 0 ||
    currentPlatformIds.length > 0;
  const clearAllFilters = () => {
    if (currentCategoryIds.length > 0) onUpdateCategoryFilter(channelId, game.id, []);
    if (Object.keys(currentCategoryValueFilters).length > 0) onUpdateCategoryValueFilters(channelId, game.id, {});
    if (Object.keys(currentGlobalValueFilters).length > 0) onUpdateGlobalValueFilters(channelId, game.id, {});
    if (currentPlatformIds.length > 0) onUpdatePlatformFilter(channelId, game.id, []);
  };

  const matchCount = runSample
    ? runSample.filter(run =>
        runMatchesFilter(run, {
          categoryIds: currentCategoryIds,
          categoryValueFilters: currentCategoryValueFilters,
          globalValueFilters: currentGlobalValueFilters,
          platformIds: currentPlatformIds,
        }),
      ).length
    : null;

  const renderBranchVariables = (catId: string, catVars: SubcategoryVariable[]) => (
    <div className="ml-6 pl-3 border-l border-gray-700 space-y-3 mt-1 mb-2">
      {catVars.map(v => (
        <OptionGroup
          key={v.id}
          label={v.name}
          options={v.values.map(val => ({ id: val.id, label: val.label }))}
          currentIds={(currentCategoryValueFilters[catId] || {})[v.id] || []}
          onToggle={(valueId) => handleCategoryValueToggle(catId, v.id, valueId)}
        />
      ))}
    </div>
  );

  const renderBranchRow = (cat: GameCategory) => {
    const catVars = variablesByCategory.get(cat.id) || [];
    const isChecked = currentCategoryIds.includes(cat.id);
    const isOpen = expanded.has(cat.id);
    const count = branchConstraintCount(cat.id);
    return (
      <div key={cat.id}>
        <div className="flex items-center gap-2 py-0.5">
          <label className="flex items-center gap-2 flex-1 min-w-0 text-sm text-gray-300 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleCategoryToggle(cat.id)}
              className="rounded border-gray-600 bg-discord-dark text-discord-blurple focus:ring-discord-blurple"
            />
            <span className="truncate">{cat.name}</span>
          </label>
          {count > 0 && (
            <span className="text-xs text-discord-blurple whitespace-nowrap">{count} selected</span>
          )}
          {catVars.length > 0 && (
            <button
              type="button"
              onClick={() => toggleExpand(cat.id)}
              className="text-gray-400 hover:text-white shrink-0"
              aria-label={isOpen ? "Collapse subcategories" : "Expand subcategories"}
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>
        {isOpen && catVars.length > 0 && renderBranchVariables(cat.id, catVars)}
      </div>
    );
  };

  const hasContent = categories.length > 0 || variables.length > 0 || platforms.length > 0;

  return (
    <div className="mt-3 p-3 rounded-md bg-black/10">
      {isFetching ? (
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading filters from speedrun.com...</span>
        </div>
      ) : hasContent ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Filter notifications</span>
            {hasAnyFilter ? (
              <button
                className="text-xs text-discord-blurple hover:underline"
                onClick={clearAllFilters}
              >
                Clear filters
              </button>
            ) : (
              <span className="text-xs text-gray-500">Notifying for all runs</span>
            )}
          </div>

          {/* Live preview: how many recent verified runs this filter matches. */}
          {hasAnyFilter && matchCount !== null && runSample !== null && (
            matchCount === 0 ? (
              <div className="flex items-start gap-1.5 text-xs text-amber-400 bg-amber-400/10 rounded px-2 py-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  None of the last {runSample.length} verified runs match this filter — double-check the
                  combination (e.g. a category paired with a platform it never ran on).
                </span>
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                {matchCount} of the last {runSample.length} verified runs match this filter.
              </div>
            )
          )}

          {/* Categories (branches) — only when there's more than one to choose. */}
          {isMultiBranch && (
            <FilterSection
              title="Categories"
              hint="Tick the categories to notify about — none ticked means all of them. Expand a category to also filter its subcategories."
            >
              {perGameCategories.map(renderBranchRow)}
              {perLevelCategories.length > 0 && (
                <>
                  <div className="text-[11px] uppercase tracking-wider text-gray-600 mt-2">Individual levels</div>
                  {perLevelCategories.map(renderBranchRow)}
                </>
              )}
            </FilterSection>
          )}

          {/* Simple game: the single category's subcategories, shown flat. */}
          {singleCategory && (variablesByCategory.get(singleCategory.id) || []).length > 0 && (
            <FilterSection title="Subcategories">
              {(variablesByCategory.get(singleCategory.id) || []).map(v => (
                <OptionGroup
                  key={v.id}
                  label={v.name}
                  options={v.values.map(val => ({ id: val.id, label: val.label }))}
                  currentIds={(currentCategoryValueFilters[singleCategory.id] || {})[v.id] || []}
                  onToggle={(valueId) => handleCategoryValueToggle(singleCategory.id, v.id, valueId)}
                />
              ))}
            </FilterSection>
          )}

          {/* Global subcategory variables (apply to every category). */}
          {globalVariables.length > 0 && (
            <FilterSection title="Applies to all categories">
              {globalVariables.map(v => (
                <OptionGroup
                  key={v.id}
                  label={v.name}
                  options={v.values.map(val => ({ id: val.id, label: val.label }))}
                  currentIds={currentGlobalValueFilters[v.id] || []}
                  onToggle={(valueId) => handleGlobalValueToggle(v.id, valueId)}
                />
              ))}
            </FilterSection>
          )}

          {/* Platform (the run's console/system) — a flat checklist. */}
          {platforms.length > 0 && (
            <FilterSection title="Platform">
              <OptionGroup
                options={platforms.map(p => ({ id: p.id, label: p.name }))}
                currentIds={currentPlatformIds}
                onToggle={handlePlatformToggle}
              />
            </FilterSection>
          )}
        </div>
      ) : (
        <span className="text-sm text-gray-400">Failed to load filters</span>
      )}
    </div>
  );
};

// A labelled band that visually separates one filter axis from the next.
const FilterSection = ({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) => (
  <div>
    <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-700 pb-1 mb-2">
      {title}
    </div>
    {hint && <p className="text-xs text-gray-500 mb-2 leading-snug">{hint}</p>}
    <div className="space-y-3">{children}</div>
  </div>
);

interface OptionGroupProps {
  label?: string;
  options: { id: string; label: string }[];
  currentIds: string[];
  onToggle: (id: string) => void;
}

// A checkbox group using positive selection: a box is checked iff its id is in
// currentIds. An empty currentIds means "no constraint" (every option passes),
// shown as all-unchecked — no inverted "empty = all checked" magic.
const OptionGroup = ({ label, options, currentIds, onToggle }: OptionGroupProps) => {
  if (options.length === 0) return null;

  return (
    <div>
      {label && <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>}
      <div className="mt-1 space-y-1">
        {options.map(option => {
          const isSelected = currentIds.includes(option.id);
          return (
            <label key={option.id} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(option.id)}
                className="rounded border-gray-600 bg-discord-dark text-discord-blurple focus:ring-discord-blurple"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelList;
