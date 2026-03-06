import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Copy,
    Link2,
    Plus,
    Server,
    Settings,
    Shield,
    ShieldAlert,
    Users,
} from "lucide-react";
import { getDiscordBotInviteUrl } from "@/lib/discord";

interface DashboardMenuProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    activeGuildCategory: string;
    setActiveGuildCategory: (category: string) => void;
    onNavigateToDashboard: () => void;
    guilds: {
        owner: unknown[];
        admin: unknown[];
        moderator: unknown[];
        superadmin: unknown[];
    };
}

const DashboardMenu = ({
    activeTab,
    setActiveTab,
    activeGuildCategory,
    setActiveGuildCategory,
    onNavigateToDashboard,
    guilds,
}: DashboardMenuProps) => {
    return (
        <TooltipProvider>
            <div className="w-full md:w-64 glass rounded-lg p-4">
                <nav className="space-y-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-400 hover:text-white hover:bg-discord-dark/50"
                                onClick={() => window.open(getDiscordBotInviteUrl(), "_blank")}
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Add Bot to Discord
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Opens discord.com</p>
                        </TooltipContent>
                    </Tooltip>

                    <div>
                        <Button
                            variant="ghost"
                            className={`w-full justify-start ${activeTab === "guilds"
                                ? "bg-discord-blurple text-white"
                                : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                                }`}
                            onClick={() => {
                                setActiveTab("guilds");
                                setActiveGuildCategory("all");
                                onNavigateToDashboard();
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
                                    onNavigateToDashboard();
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
                                    onNavigateToDashboard();
                                }}
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Admin ({guilds.admin.length})
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`w-full justify-start ${activeTab === "guilds" && activeGuildCategory === "moderator"
                                    ? "bg-discord-blurple/20 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                                    }`}
                                onClick={() => {
                                    setActiveTab("guilds");
                                    setActiveGuildCategory("moderator");
                                    onNavigateToDashboard();
                                }}
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Moderator ({guilds.moderator.length})
                            </Button>
                            {guilds.superadmin.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-full justify-start ${activeTab === "guilds" && activeGuildCategory === "superadmin"
                                        ? "bg-discord-blurple/20 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                                        }`}
                                    onClick={() => {
                                        setActiveTab("guilds");
                                        setActiveGuildCategory("superadmin");
                                        onNavigateToDashboard();
                                    }}
                                >
                                    <ShieldAlert className="mr-2 h-4 w-4" />
                                    Superadmin ({guilds.superadmin.length})
                                </Button>
                            )}
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeTab === "src-link"
                            ? "bg-discord-blurple text-white"
                            : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                            }`}
                        onClick={() => setActiveTab("src-link")}
                    >
                        <Link2 className="mr-2 h-5 w-5" />
                        Link SRC Account
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeTab === "settings"
                            ? "bg-discord-blurple text-white"
                            : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                            }`}
                        onClick={() => setActiveTab("settings")}
                    >
                        <Copy className="mr-2 h-5 w-5" />
                        Share bot
                    </Button>
                </nav>
            </div>
        </TooltipProvider>
    );
};

export default DashboardMenu; 