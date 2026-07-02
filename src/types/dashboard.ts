export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  banner: string | null;
  owner: boolean;
  permissions: number;
  permissions_new: string;
  features: string[];
  superadmin?: boolean;
}

export interface Guilds {
  owner: DiscordGuild[];
  admin: DiscordGuild[];
  moderator: DiscordGuild[];
  superadmin: DiscordGuild[];
}

export interface Game {
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
  notificationType?: string;
  categoryIds?: string[];
  // Per-branch subcategory filter: { categoryId: { variableId: [valueId, ...] } }.
  // Enforced only against a run's own category → selecting multiple branches
  // is OR across them; AND across variables, OR within a variable.
  categoryValueFilters?: Record<string, Record<string, string[]>>;
  // Global subcategory filter for variables that apply to every category:
  // { variableId: [valueId, ...] }.
  globalValueFilters?: Record<string, string[]>;
  platformIds?: string[];
  notificationCount?: number;
  lastNotifiedAt?: string;
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

export interface DiscordChannel {
  id: string;
  type: number;
  flags: number;
  guild_id: string;
  name: string;
  parent_id: string | null;
  position: number;
  permission_overwrites: unknown[];
  games?: Game[];
  last_message_id?: string | null;
  rate_limit_per_user?: number;
  topic?: string | null;
  nsfw?: boolean;
  bitrate?: number;
  user_limit?: number;
  rtc_region?: string | null;
}

export interface GuildChannelsResponse {
  message: string;
  guildChannels: DiscordChannel[];
}

export interface GameCategory {
  id: string;
  name: string;
  type: string;
}

export interface SubcategoryValue {
  id: string;
  label: string;
}

// A speedrun.com subcategory variable (e.g. "Difficulty") and its selectable
// values (e.g. "Platinum", "Cronos% Easy"). Only is-subcategory variables are
// surfaced as notification filters.
export interface SubcategoryVariable {
  id: string;
  name: string;
  categoryId: string | null;
  values: SubcategoryValue[];
}

export interface GamePlatform {
  id: string;
  name: string;
}
