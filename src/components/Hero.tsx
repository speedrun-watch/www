
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  MessageSquare,
  ChevronDown,
  Trophy,
} from "lucide-react";
import { getDiscordBotInviteUrl } from "@/lib/discord";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

interface LatestRun {
  type: string;
  players: string;
  time: string;
  timePrimaryT: number;
  game: string;
  gameAbbreviation: string;
  category: string;
  categoryType: string;
  level?: string;
  place: number;
  subcategories?: { name: string; value: string }[];
  thumbnailUrl: string;
  videoUrl?: string;
  videoPlatform?: string;
  weblink: string;
  verifyDate: string;
  gameIconUrl?: string;
  trophyIconUrl?: string;
  moderatorName?: string;
  title: string;
  embedTitle: string;
  updatedAt: number;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (diffDays === 0) return `Today at ${timeStr}`;
  if (diffDays === 1) return `Yesterday at ${timeStr}`;
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

// Static fallback data matching the original Half-Life 2 embed
const FALLBACK: LatestRun = {
  type: "full-game",
  players: "Buster12",
  time: "37m 20s 55ms",
  timePrimaryT: 2240.055,
  game: "Half-Life 2",
  gameAbbreviation: "hl2",
  category: "Any%",
  categoryType: "per-game",
  place: 1,
  subcategories: [{ name: "Version", value: "No Voidclip" }],
  thumbnailUrl: "https://img.youtube.com/vi/CBgo4WVG_3I/0.jpg",
  videoUrl: "https://www.youtube.com/watch?v=CBgo4WVG_3I",
  videoPlatform: "YouTube",
  weblink: "https://www.speedrun.com/hl2/runs/ylpx8grm",
  verifyDate: new Date().toISOString(),
  trophyIconUrl: "https://www.speedrun.com/images/1st.png",
  moderatorName: undefined,
  title: "Any% No Voidclip - 37m 20s 55ms",
  embedTitle: "Buster12 set a new WR in Any%!",
  updatedAt: Date.now(),
};

const EMOJI_POOL = ["🔥", "⚡", "🏆", "🎮", "💨", "🚀", "👏", "🤯", "💪", "⏱️", "🥇", "🎯", "✨", "💯", "😤", "🫡"];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function getRunEmojis(run: LatestRun): string[] {
  const seed = hashStr(run.weblink || run.game + run.category);
  const count = 3 + (seed % 2); // 3 or 4 emojis
  const picked: string[] = [];
  const used = new Set<number>();
  for (let i = 0; i < count; i++) {
    let idx = (seed * (i + 7) + i * 31) % EMOJI_POOL.length;
    while (used.has(idx)) idx = (idx + 1) % EMOJI_POOL.length;
    used.add(idx);
    picked.push(EMOJI_POOL[idx]);
  }
  return picked;
}

function getVisitorId(): string {
  const key = "sw_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function getReactionStorageKey(run: LatestRun, emoji: string): string {
  return `reaction:${run.weblink || run.game}:${emoji}`;
}

const Hero = () => {
  const [runs, setRuns] = useState<LatestRun[]>([]);
  const [selectedType, setSelectedType] = useState<"full-game" | "individual-level">("full-game");
  const [clickedReactions, setClickedReactions] = useState<Set<string>>(new Set());
  const [reactionCounts, setReactionCounts] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    fetch(`${API_ENDPOINT}/api/latest-runs`)
      .then(res => res.json())
      .then(data => {
        if (data.runs && data.runs.length > 0) {
          setRuns(data.runs);
          const hasFullGame = data.runs.some((r: LatestRun) => r.type === "full-game");
          if (!hasFullGame) setSelectedType("individual-level");
        }
        if (data.reactions) {
          setReactionCounts(data.reactions);
        }
      })
      .catch(() => {});
  }, []);

  const handleReaction = useCallback((run: LatestRun, emoji: string) => {
    const key = getReactionStorageKey(run, emoji);
    if (clickedReactions.has(key)) return;

    // Optimistic update
    localStorage.setItem(key, "1");
    setClickedReactions(prev => new Set(prev).add(key));
    setReactionCounts(prev => ({
      ...prev,
      [run.type]: { ...prev[run.type], [emoji]: (prev[run.type]?.[emoji] || 0) + 1 },
    }));

    // POST to backend
    fetch(`${API_ENDPOINT}/api/latest-runs/${run.type}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji, visitorId: getVisitorId() }),
    }).catch(() => {});
  }, [clickedReactions]);

  const currentRun = runs.find(r => r.type === selectedType) || FALLBACK;
  const emojis = getRunEmojis(currentRun);

  // Load persisted reactions for current run
  useEffect(() => {
    const persisted = new Set<string>();
    for (const emoji of emojis) {
      const key = getReactionStorageKey(currentRun, emoji);
      if (localStorage.getItem(key)) persisted.add(key);
    }
    setClickedReactions(persisted);
  }, [currentRun.weblink]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasFullGame = runs.some(r => r.type === "full-game");
  const hasIL = runs.some(r => r.type === "individual-level");
  const hasToggle = hasFullGame && hasIL;

  // Build fields matching the bot's embed order: Type, Category, Place, [Level], [Subcategories...], [Watch]
  const fields: { name: string; value: string; isLink?: boolean; url?: string }[] = [
    {
      name: "Type",
      value: currentRun.categoryType === "per-level" ? "Individual Level" : "Full Game",
    },
    { name: "Category", value: currentRun.category },
    { name: "Place", value: "1st" },
  ];

  if (currentRun.level) {
    fields.push({ name: "Level", value: currentRun.level });
  }

  if (currentRun.subcategories) {
    for (const sub of currentRun.subcategories) {
      fields.push({ name: sub.name, value: sub.value });
    }
  }

  if (currentRun.videoUrl && currentRun.videoPlatform) {
    fields.push({
      name: "\u200B",
      value: `Watch on ${currentRun.videoPlatform}`,
      isLink: true,
      url: currentRun.videoUrl,
    });
  }

  return (
    <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[#23272A]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiM1ODY1RjIiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-discord-blurple/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-discord-fuchsia/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center space-y-8 mb-12">
          <div className="inline-block animate-float">
            <div className="flex items-center space-x-2 bg-discord-dark/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <div className="relative flex items-center justify-center">
                <Bell className="w-5 h-5 text-discord-blurple/80 absolute animate-ping opacity-60" />
                <Bell className="w-5 h-5 text-discord-blurple/80 relative" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-discord-blurple/90 to-discord-fuchsia/80 bg-clip-text text-transparent">
                  Speedrun Notifications
                </span>{" "}
                for Discord Servers
              </h1>
            </div>
          </div>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Keep your Discord community updated about new speedruns as they happen.
            Get notifications when runners share their achievements on <a href="https://speedrun.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">speedrun.com</a>.
          </p>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <Button
              className="bg-discord-blurple/90 hover:bg-discord-blurple/80 text-white w-full sm:w-auto px-6 py-5"
              size="lg"
              onClick={() => window.open(getDiscordBotInviteUrl(), '_blank')}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Add to Discord
            </Button>
          </div>
        </div>

        {/* Bot Preview - Dynamic WR Notification */}
        <div className="mt-12 max-w-3xl mx-auto glass rounded-lg overflow-hidden animate-scale-in border border-white/5 shadow-md">
          <div className="bg-discord-dark/80 p-2 flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="ml-4 text-gray-400 text-xs">Discord</div>
            {hasToggle && (
              <div className="ml-auto flex bg-discord-darker/60 rounded-full p-0.5">
                <button
                  className={`px-2.5 py-0.5 rounded-full text-[11px] transition-colors ${selectedType === "full-game" ? "bg-discord-blurple/80 text-white" : "text-gray-500 hover:text-gray-300"}`}
                  onClick={() => setSelectedType("full-game")}
                >
                  Full Game WR
                </button>
                <button
                  className={`px-2.5 py-0.5 rounded-full text-[11px] transition-colors ${selectedType === "individual-level" ? "bg-discord-blurple/80 text-white" : "text-gray-500 hover:text-gray-300"}`}
                  onClick={() => setSelectedType("individual-level")}
                >
                  IL WR
                </button>
              </div>
            )}
          </div>
          <div className="p-4 bg-discord-darker/90 text-white">
            <div className="flex items-start mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <img
                  src="/favicon-96x96.png"
                  alt="speedrun.watch bot avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="w-full border-l-4 border-green-500/70 pl-3">
                <div className="flex items-center mb-1">
                  <a href="https://discord.com/discovery/applications/1311698143733354537" target="_blank" rel="noopener noreferrer" className="font-medium text-white mr-2 hover:underline">speedrun.watch</a>
                  <span className="bg-blue-600/90 text-xs font-medium px-2 py-0.5 rounded text-white inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    APP
                  </span>
                  <span className="text-gray-400 text-xs ml-2">{formatTimestamp(currentRun.verifyDate)}</span>
                </div>
                <div className="mb-2">
                  <span className="flex items-center">
                    <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="font-medium">{currentRun.embedTitle}</span>
                  </span>
                </div>
                <a href={currentRun.weblink} target="_blank" rel="noopener noreferrer" className="mb-2 font-bold text-blue-400 hover:underline flex items-center">
                  {currentRun.title}
                </a>
                <div className="font-medium text-white mb-2">
                  <a href={`https://www.speedrun.com/${currentRun.gameAbbreviation}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {currentRun.game}
                  </a>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  {fields.map((field, i) => (
                    <div key={i}>
                      <div className="text-gray-400">{field.name}</div>
                      {field.isLink && field.url ? (
                        <a href={field.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {field.value}
                        </a>
                      ) : (
                        <div>{field.value}</div>
                      )}
                    </div>
                  ))}
                </div>
                <a href={currentRun.weblink} target="_blank" rel="noopener noreferrer" className="mb-3 block relative rounded overflow-hidden">
                  <div className="aspect-video bg-black">
                    <img
                      src={currentRun.thumbnailUrl}
                      alt={`${currentRun.game} speedrun thumbnail`}
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </a>

                {/* Footer */}
                <div className="flex items-center mt-3 pt-2 border-t border-white/5">
                  <img src="/favicon-96x96.png" alt="" className="w-4 h-4 rounded-full mr-1.5" />
                  <span className="text-[11px] text-gray-300">
                    {currentRun.moderatorName ? `Approved by ${currentRun.moderatorName} · ` : ""}www.speedrun.watch
                  </span>
                </div>
              </div>
            </div>

            {/* Reactions — below the message, aligned with embed content */}
            <div className="flex items-center flex-wrap gap-1.5 ml-[52px]">
              {emojis.map((emoji) => {
                const key = getReactionStorageKey(currentRun, emoji);
                const clicked = clickedReactions.has(key);
                const count = reactionCounts[currentRun.type]?.[emoji] || 0;
                return (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(currentRun, emoji)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm transition-colors cursor-pointer ${
                      clicked
                        ? "bg-discord-blurple/20 border border-discord-blurple/50 text-white"
                        : "bg-discord-dark/50 border border-white/10 text-gray-300 hover:border-white/25"
                    }`}
                  >
                    <span className="text-base leading-none">{emoji}</span>
                    {count > 0 && <span className="text-xs">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
