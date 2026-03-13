import { useRef, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import type { DiscordChannel } from "@/types/dashboard";

interface GameSettingsValues {
  notificationType: string;
  categoryIds: string[];
}

export function useGameSettings(
  selectedGuildIdRef: React.MutableRefObject<string | undefined>,
  setChannels: React.Dispatch<React.SetStateAction<DiscordChannel[]>>,
  channels: DiscordChannel[],
) {
  const saveTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const pendingValuesRef = useRef<Record<string, GameSettingsValues>>({});
  const lastConfirmedRef = useRef<Record<string, GameSettingsValues>>({});
  const inFlightRef = useRef<Set<string>>(new Set());

  const scheduleGameSettingsSave = useCallback((channelId: string, gameId: string) => {
    const key = `${channelId}-${gameId}`;

    if (saveTimersRef.current[key]) {
      clearTimeout(saveTimersRef.current[key]);
    }

    saveTimersRef.current[key] = setTimeout(async () => {
      delete saveTimersRef.current[key];

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
        if (pendingValuesRef.current[key] === values) {
          delete pendingValuesRef.current[key];
        }
      } catch (error) {
        console.error("Error saving game settings:", error);
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
        if (pendingValuesRef.current[key]) {
          scheduleGameSettingsSave(channelId, gameId);
        }
      }
    }, 600);
  }, [setChannels, selectedGuildIdRef]);

  const initConfirmedState = (channelId: string, gameId: string) => {
    const key = `${channelId}-${gameId}`;
    if (!lastConfirmedRef.current[key]) {
      const channel = channels.find(c => c.id === channelId);
      const game = channel?.games?.find(g => g.id === gameId);
      lastConfirmedRef.current[key] = {
        notificationType: game?.notificationType || 'any',
        categoryIds: game?.categoryIds || [],
      };
    }
  };

  const handleUpdateNotificationSettings = (channelId: string, gameId: string, setting: string) => {
    const key = `${channelId}-${gameId}`;
    initConfirmedState(channelId, gameId);

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

    const existing = pendingValuesRef.current[key] || lastConfirmedRef.current[key];
    pendingValuesRef.current[key] = { ...existing, notificationType: setting };
    scheduleGameSettingsSave(channelId, gameId);
  };

  const handleUpdateCategoryFilter = (channelId: string, gameId: string, newCategoryIds: string[]) => {
    const key = `${channelId}-${gameId}`;
    initConfirmedState(channelId, gameId);

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

    const existing = pendingValuesRef.current[key] || lastConfirmedRef.current[key];
    pendingValuesRef.current[key] = { ...existing, categoryIds: newCategoryIds };
    scheduleGameSettingsSave(channelId, gameId);
  };

  const cleanup = useCallback(() => {
    Object.values(saveTimersRef.current).forEach(clearTimeout);
  }, []);

  return {
    handleUpdateNotificationSettings,
    handleUpdateCategoryFilter,
    cleanup,
  };
}
