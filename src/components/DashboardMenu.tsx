import { Button } from "@/components/ui/button";
import {
    Plus,
    Server,
    Settings,
    Shield,
    Users,
} from "lucide-react";

interface DashboardMenuProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    activeGuildCategory: string;
    setActiveGuildCategory: (category: string) => void;
    setSelectedGuildId: (guildId: string | null) => void;
    guilds: {
        owner: any[];
        admin: any[];
        member: any[];
    };
}

const DashboardMenu = ({
    activeTab,
    setActiveTab,
    activeGuildCategory,
    setActiveGuildCategory,
    setSelectedGuildId,
    guilds,
}: DashboardMenuProps) => {
    return (
        <div className="w-full md:w-64 glass rounded-lg p-4">
            <nav className="space-y-2">
                <Button
                    variant="ghost"
                    className={`w-full justify-start text-gray-400 hover:text-white hover:bg-discord-dark/50 ${activeTab === "add-bot" ? "bg-discord-blurple text-white" : ""
                        }`}
                    onClick={() => setActiveTab("add-bot")}
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Bot to Discord
                </Button>

                <div>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeTab === "guilds"
                            ? "bg-discord-blurple text-white"
                            : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                            }`}
                        onClick={() => {
                            setActiveTab("guilds");
                            setSelectedGuildId(null);
                        }}
                    >
                        <Server className="mr-2 h-5 w-5" />
                        Discord Guilds
                    </Button>

                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-discord-blurple/30 pl-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start ${activeTab === "guilds" && activeGuildCategory === "owner"
                                ? "bg-discord-blurple/20 text-white"
                                : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                                }`}
                            onClick={() => {
                                setActiveTab("guilds");
                                setActiveGuildCategory("owner");
                                setSelectedGuildId(null);
                            }}
                        >
                            <Shield className="mr-2 h-4 w-4" />
                            Owner ({guilds.owner.length})
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start ${activeTab === "guilds" && activeGuildCategory === "admin"
                                ? "bg-discord-blurple/20 text-white"
                                : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                                }`}
                            onClick={() => {
                                setActiveTab("guilds");
                                setActiveGuildCategory("admin");
                                setSelectedGuildId(null);
                            }}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Admin ({guilds.admin.length})
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start ${activeTab === "guilds" && activeGuildCategory === "member"
                                ? "bg-discord-blurple/20 text-white"
                                : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                                }`}
                            onClick={() => {
                                setActiveTab("guilds");
                                setActiveGuildCategory("member");
                                setSelectedGuildId(null);
                            }}
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Member ({guilds.member.length})
                        </Button>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === "settings"
                        ? "bg-discord-blurple text-white"
                        : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                        }`}
                    onClick={() => setActiveTab("settings")}
                >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                </Button>
            </nav>
        </div>
    );
};

export default DashboardMenu; 