const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
const DISCORD_SCOPES = import.meta.env.VITE_DISCORD_SCOPES;

export function getDiscordBotInviteUrl(): string {
  return `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=19456&integration_type=0&scope=bot+applications.commands`;
}

export function getDiscordOAuthUrl(): string {
  const REDIRECT_URI = encodeURIComponent(FRONTEND_URL + "/login/callback");
  const SCOPES = encodeURIComponent(DISCORD_SCOPES);
  return `https://discord.com/oauth2/authorize?response_type=code&client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
}
