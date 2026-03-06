import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Unlink, Loader2, ExternalLink, ShieldCheck } from "lucide-react";
import api from "@/lib/api";

interface SrcLink {
  linked: boolean;
  srcUserId?: string;
  srcUsername?: string;
  linkedAt?: string;
}

const SrcLinkTab = () => {
  const [link, setLink] = useState<SrcLink | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLink();
  }, []);

  const fetchLink = async () => {
    try {
      const response = await api.get("/api/user/src-link");
      setLink(response.data);
    } catch {
      setLink({ linked: false });
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async () => {
    if (!apiKey.trim()) return;
    setLinking(true);
    setError(null);
    try {
      const response = await api.post("/api/user/src-link", { apiKey: apiKey.trim() });
      setLink({ linked: true, srcUserId: response.data.srcUserId, srcUsername: response.data.srcUsername });
      setApiKey("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify API key");
    } finally {
      setLinking(false);
    }
  };

  const handleUnlink = async () => {
    setUnlinking(true);
    try {
      await api.delete("/api/user/src-link");
      setLink({ linked: false });
    } catch {
      setError("Failed to unlink account");
    } finally {
      setUnlinking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Link speedrun.com Account</h1>

      {link?.linked ? (
        <div className="glass p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium">Linked to {link.srcUsername}</p>
              <p className="text-sm text-gray-400">
                Your Discord will be mentioned in run notifications
              </p>
            </div>
          </div>

          <a
            href={`https://www.speedrun.com/users/${link.srcUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-discord-blurple hover:underline inline-flex items-center gap-1 mb-4"
          >
            View profile on speedrun.com <ExternalLink className="w-3 h-3" />
          </a>

          <div className="mt-4 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              onClick={handleUnlink}
              disabled={unlinking}
            >
              {unlinking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Unlink className="w-4 h-4 mr-2" />}
              Unlink Account
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass p-6 rounded-lg">
          <p className="text-gray-300 mb-4">
            Link your speedrun.com account so your Discord username is mentioned
            in run notification embeds when you submit or approve a run.
          </p>

          <div className="bg-discord-dark/50 p-4 rounded-md mb-4">
            <div className="flex items-start gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                Your API key is used once to verify your identity and is <strong className="text-white">never stored</strong>.
                For extra safety, you can regenerate your API key on{" "}
                <a
                  href="https://www.speedrun.com/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-discord-blurple hover:underline"
                >
                  speedrun.com/settings/api
                </a>
                {" "}after linking.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Paste your speedrun.com API key"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setError(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleLink()}
              className="bg-discord-dark/50 border-gray-600 text-white placeholder:text-gray-500"
            />
            <Button
              onClick={handleLink}
              disabled={linking || !apiKey.trim()}
              className="bg-discord-blurple hover:bg-discord-blurple/90 text-white flex-shrink-0"
            >
              {linking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
              Link
            </Button>
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SrcLinkTab;
