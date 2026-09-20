import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Loader2, ExternalLink, Plus, Sparkles } from "lucide-react";
import api from "@/lib/api";
import { withRetry } from "@/lib/retry";
import { getDiscordBotInviteUrl } from "@/lib/discord";

interface GuildRole {
  id: string;
  name: string;
  position: number;
  color: number;
}

interface RunnerRoleCardProps {
  selectedGuildId: string;
}

const roleDot = (color: number) => ({
  backgroundColor: color ? `#${color.toString(16).padStart(6, "0")}` : "#99aab5",
});

// Self-contained guild-settings card for the Runner-role auto-assign feature.
// Fetches the guild's current setting + assignable roles, then lets an admin
// choose the role linked speedrunners are granted. Three ways to set it: create
// a fresh role in one click (bot makes it, positioned correctly), use an
// existing "Runner" role if one is detected, or pick any role from the dropdown.
// Warns about the two ways assignment can fail: a role above the bot in the
// hierarchy, and a missing Manage Roles permission (from the recorded failure).
const RunnerRoleCard = ({ selectedGuildId }: RunnerRoleCardProps) => {
  const [roles, setRoles] = useState<GuildRole[]>([]);
  const [botRolePosition, setBotRolePosition] = useState<number | null>(null);
  const [runnerRoleId, setRunnerRoleId] = useState<string | null>(null);
  const [runnerRoleErrorAt, setRunnerRoleErrorAt] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rolesError, setRolesError] = useState(false);
  const [rolesErrorStatus, setRolesErrorStatus] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  // Bumped each load; a slow (retried) request whose token is stale on return
  // is discarded, so switching guilds mid-fetch can't overwrite newer state.
  const reqIdRef = useRef(0);

  // Load the guild setting + assignable roles, retrying transient rate-limits
  // (429/503) so a brief Discord throttle self-heals. Roles and settings are
  // fetched independently: a roles failure surfaces a retryable error (rather
  // than silently showing "no roles"), while settings still load.
  const load = useCallback(async () => {
    if (!selectedGuildId) return;
    const reqId = ++reqIdRef.current;
    const isStale = () => reqId !== reqIdRef.current;
    setIsLoading(true);
    setRolesError(false);
    setRolesErrorStatus(null);
    try {
      const [settings, rolesResp] = await Promise.all([
        withRetry(() =>
          api.get<{
            runnerRoleId: string | null;
            runnerRoleErrorAt: string | null;
          }>(`/api/guilds/${selectedGuildId}/settings`),
        ),
        withRetry(() =>
          api.get<{ roles: GuildRole[]; botRolePosition: number | null }>(
            `/api/guilds/${selectedGuildId}/roles`,
          ),
        ).catch((error) => {
          if (!isStale()) {
            setRolesErrorStatus(
              (error as { response?: { status?: number } })?.response?.status ?? null,
            );
          }
          return null;
        }),
      ]);
      if (isStale()) return;
      setRunnerRoleId(settings.data.runnerRoleId);
      setEnabled(!!settings.data.runnerRoleId);
      setRunnerRoleErrorAt(settings.data.runnerRoleErrorAt);
      if (rolesResp) {
        setRoles(rolesResp.data.roles || []);
        setBotRolePosition(rolesResp.data.botRolePosition);
      } else {
        setRolesError(true);
      }
    } catch (error) {
      console.error("Error loading runner-role settings:", error);
    } finally {
      if (!isStale()) setIsLoading(false);
    }
  }, [selectedGuildId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (nextRoleId: string | null) => {
    const prevRoleId = runnerRoleId;
    setRunnerRoleId(nextRoleId); // optimistic
    setIsSaving(true);
    try {
      await api.patch(`/api/guilds/${selectedGuildId}/settings`, {
        runnerRoleId: nextRoleId,
      });
      setRunnerRoleErrorAt(null); // a successful save clears the stale failure signal
    } catch (error) {
      console.error("Error saving runner role:", error);
      setRunnerRoleId(prevRoleId); // revert
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRole = async () => {
    setIsCreating(true);
    try {
      const resp = await api.post<{ role: GuildRole }>(
        `/api/guilds/${selectedGuildId}/runner-role/create`,
      );
      const role = resp.data.role;
      setRoles((prev) => [role, ...prev.filter((r) => r.id !== role.id)]);
      setRunnerRoleId(role.id); // the endpoint already selected it server-side
      setRunnerRoleErrorAt(null);
    } catch (error) {
      console.error("Error creating Runner role:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggle = (next: boolean) => {
    setEnabled(next);
    if (!next) save(null); // opt-out clears the role immediately
  };

  const selectedRole = roles.find((r) => r.id === runnerRoleId);
  const existingRunnerRole = roles.find((r) => r.name.trim().toLowerCase() === "runner");
  const hierarchyWarning =
    selectedRole != null &&
    botRolePosition != null &&
    selectedRole.position >= botRolePosition;
  const busy = isSaving || isCreating;

  return (
    <div className="bg-discord-dark/50 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-3 pt-0.5">
          <Switch
            id="runner-role-enabled"
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isLoading || busy}
          />
          <Label
            htmlFor="runner-role-enabled"
            className="text-sm font-medium text-gray-200 cursor-pointer whitespace-nowrap"
          >
            Runner role
          </Label>
        </div>
        <div className="text-xs text-gray-400 flex-1 leading-relaxed">
          Give a role to members who link their speedrun.com account and run a
          game this server tracks. It is granted the moment they link, and
          whenever their runs are posted here.{" "}
          <Link
            to="/guides/runner-role"
            className="text-blue-400 hover:text-blue-300 hover:underline whitespace-nowrap"
          >
            Learn how it works
          </Link>
        </div>
      </div>

      {enabled && (
        <div className="mt-4 pl-1">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading roles…
            </div>
          ) : rolesError ? (
            <div className="flex items-start gap-2 text-sm text-yellow-500">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="flex flex-col items-start gap-2">
                <span>
                  {rolesErrorStatus === 503 || rolesErrorStatus === 429
                    ? "Discord is briefly rate-limiting us. This usually clears in a moment."
                    : "Couldn’t load this server’s roles. Make sure the bot is still in the server."}
                </span>
                <Button variant="outline" size="sm" onClick={load} disabled={isLoading}>
                  Try again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Select
                  value={runnerRoleId ?? undefined}
                  onValueChange={(value) => save(value)}
                  disabled={busy}
                >
                  <SelectTrigger className="w-full sm:w-[260px] bg-discord-dark border-gray-600 text-gray-200">
                    <SelectValue placeholder="Pick an existing role…" />
                  </SelectTrigger>
                  <SelectContent className="bg-discord-dark border-gray-600">
                    {roles.map((role) => (
                      <SelectItem
                        key={role.id}
                        value={role.id}
                        className="text-gray-200 focus:bg-discord-darker focus:text-white"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                            style={roleDot(role.color)}
                          />
                          {role.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-xs text-gray-500">or</span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCreateRole}
                  disabled={busy}
                  className="bg-transparent text-gray-100 border-gray-600 hover:bg-discord-darker hover:text-white"
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-1" />
                  )}
                  Create a Runner role
                </Button>
              </div>

              {existingRunnerRole && runnerRoleId !== existingRunnerRole.id && (
                <button
                  type="button"
                  onClick={() => save(existingRunnerRole.id)}
                  disabled={busy}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:underline disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  Use your existing “{existingRunnerRole.name}” role
                </button>
              )}

              {hierarchyWarning && (
                <div className="mt-3 flex items-start gap-2 text-xs text-yellow-500">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    This role sits above speedrun.watch in the role list, so
                    Discord won’t let the bot assign it. In{" "}
                    <span className="text-gray-200">Server Settings → Roles</span>,
                    drag the <span className="text-gray-200">speedrun.watch</span>{" "}
                    role above <span className="text-gray-200">{selectedRole?.name}</span>.
                  </span>
                </div>
              )}

              {runnerRoleErrorAt && (
                <div className="mt-3 flex items-start gap-2 text-xs text-yellow-500">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    A recent role assignment failed — speedrun.watch is likely
                    missing the <span className="text-gray-200">Manage Roles</span>{" "}
                    permission. Re-invite the bot to grant it, or enable it on the
                    bot’s role in Server Settings.{" "}
                    <a
                      href={getDiscordBotInviteUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      Re-invite <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RunnerRoleCard;
