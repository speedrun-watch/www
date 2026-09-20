import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

interface ChannelListStatusProps {
  isFetchingChannels: boolean;
  /** HTTP status of the failed fetch, so the copy names the real cause. */
  channelFetchStatus: number | null;
  onRetry: () => void;
}

// The loading / error state that replaces the channel list while a fetch is in
// flight or has failed. Extracted from ChannelList so the retry + status-honest
// messaging can be unit-tested without rendering the whole (large) parent.
const ChannelListStatus = ({
  isFetchingChannels,
  channelFetchStatus,
  onRetry,
}: ChannelListStatusProps) => {
  if (isFetchingChannels) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-discord-blurple mx-auto mb-3 animate-spin" />
          <p className="text-gray-400">Loading channels from Discord...</p>
        </div>
      </div>
    );
  }

  const message =
    channelFetchStatus === 503 || channelFetchStatus === 429
      ? "Discord is briefly rate-limiting us. This usually clears in a moment."
      : channelFetchStatus === 403
      ? "You don't have Manage Channels permission in this server."
      : "Is the bot still installed in this server?";

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
        <p className="text-gray-300 font-medium">Couldn't fetch channels</p>
        <p className="text-gray-400 text-sm mt-1">{message}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </div>
  );
};

export default ChannelListStatus;
