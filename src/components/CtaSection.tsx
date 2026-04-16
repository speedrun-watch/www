
import { useState, useEffect } from "react";
import api from "@/lib/api";

const featuredCommunities = [
  { name: "Worms Speedrunning", icon: "https://cdn.discordapp.com/icons/886742237982113843/f337cdeffb998e2727fbb6ef6349845a.png" },
  { name: "CS Speedrunning", icon: "https://cdn.discordapp.com/icons/331766263019995137/fae09fd8a402892b6f957bf605388ed4.png" },
  { name: "F1 Game Speedrunning", icon: "https://cdn.discordapp.com/icons/796696691968573451/146e88b3a6ba7a13f9004f670e12bc70.png" },
  { name: "Tomb Runner", icon: "https://cdn.discordapp.com/icons/183942718630658048/2c2c58150f220dda97bb4f6133ef4205.png" },
  { name: "Splatoon Speedrunning", icon: "https://cdn.discordapp.com/icons/128071543531110400/724419a2d69ac68afa53ff49564e039a.png" },
];

const CtaSection = () => {
  const [stats, setStats] = useState<{ guildCount: number; gameCount: number; totalEmbedsSent: number } | null>(null);

  useEffect(() => {
    api.get("/api/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  if (!stats) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-discord-blurple/10 to-discord-fuchsia/10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-discord-blurple/20 to-discord-fuchsia/20"></div>
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-discord-blurple/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-discord-fuchsia/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-medium text-white mb-2">
            Watching{" "}
            <span className="text-discord-blurple font-bold">{stats.gameCount} games</span>
            {" "}across{" "}
            <span className="text-discord-blurple font-bold">{stats.guildCount} communities</span>
          </h2>
          <p className="text-gray-400 mb-6">including</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-6">
            {featuredCommunities.map((community, index) => (
              <div
                key={index}
                className="flex items-center bg-discord-dark/60 px-3 py-1.5 rounded-full"
              >
                <img
                  src={community.icon}
                  alt={community.name}
                  className="w-4 h-4 rounded-full mr-1.5"
                />
                <span className="text-sm text-gray-200">{community.name}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-400">{stats.totalEmbedsSent.toLocaleString()} runs shared so far</p>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
