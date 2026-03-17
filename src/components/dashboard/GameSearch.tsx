import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import type { Game, DiscordChannel } from "@/types/dashboard";

interface GameSearchProps {
  channel: DiscordChannel;
  gameSearchTerm: string;
  onSearchTermChange: (term: string) => void;
  searchResults: Game[];
  isSearching: boolean;
  linkingGameIds: Set<string>;
  onLinkGame: (channelId: string, gameId: string) => void;
  onClose: () => void;
}

const GameSearch = ({
  channel,
  gameSearchTerm,
  onSearchTermChange,
  searchResults,
  isSearching,
  linkingGameIds,
  onLinkGame,
  onClose,
}: GameSearchProps) => {
  return (
    <div className="mb-4 bg-discord-dark/50 p-3 rounded-md">
      <div className="flex items-center mb-2">
        <input
          type="text"
          placeholder="Search speedrun.com games..."
          className="bg-discord-darker flex-1 border border-gray-700 rounded-md py-1 px-3 text-white focus:border-discord-blurple focus:outline-none"
          value={gameSearchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
        <Button
          size="sm"
          variant="ghost"
          className="ml-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      {gameSearchTerm && (
        <div className="max-h-40 overflow-y-auto bg-discord-darker rounded-md mt-2">
          {isSearching ? (
            <div className="p-2 text-gray-400">Searching on speedrun.com...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map(game => {
              const alreadyLinked = (channel.games || []).some(g => g.id === game.id);
              return (
                <div
                  key={game.id}
                  className={alreadyLinked
                    ? "p-2 text-gray-600 flex items-center justify-between cursor-default"
                    : "p-2 hover:bg-discord-dark/70 cursor-pointer text-gray-300 hover:text-white flex items-center justify-between"
                  }
                  onClick={() => {
                    if (!alreadyLinked && !linkingGameIds.has(game.id)) {
                      onLinkGame(channel.id, game.id);
                    }
                  }}
                >
                  <span>{game.names.international}</span>
                  {alreadyLinked ? (
                    <span className="text-xs text-gray-600">Already added</span>
                  ) : linkingGameIds.has(game.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin text-discord-blurple" />
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="p-2 text-gray-400">No games found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameSearch;
