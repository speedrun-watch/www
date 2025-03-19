
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
  SidebarRail,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  Bell, 
  Gamepad, 
  Settings, 
  LogOut, 
  User,
  Server,
  Home,
  Shield,
  Users,
  X,
  Plus,
  Clock,
  Link as LinkIcon,
  MessageSquare,
  ArrowLeft,
  Trophy,
  Medal,
  Flag,
  Zap,
  FileCheck,
  ExternalLink,
  UserCheck,
  Copy,
  BookOpen,
  Heart,
  Lightbulb,
  BarChart,
  GitPullRequest,
  Github,
  FileText
} from "lucide-react";
import Footer from "@/components/Footer";

// Expanded mock data for guild listings
const mockGuilds = {
  owner: [
    { id: "1", name: "Half-Life Speedrunners", icon: "🔧", memberCount: 350, isOfficial: true },
    { id: "2", name: "Super Mario 64 Masters", icon: "🍄", memberCount: 1240, isOfficial: false },
    { id: "7", name: "Celeste Dash Club", icon: "🏔️", memberCount: 650, isOfficial: true },
    { id: "8", name: "Hades Speedrun Society", icon: "🔥", memberCount: 480, isOfficial: false }
  ],
  admin: [
    { id: "3", name: "GTA Speedrun Community", icon: "🚗", memberCount: 870, isOfficial: true },
    { id: "4", name: "Worms Armageddon Runners", icon: "🐛", memberCount: 230, isOfficial: false },
    { id: "9", name: "Hollow Knight Guild", icon: "🐞", memberCount: 1200, isOfficial: true },
    { id: "10", name: "Minecraft RTAs", icon: "⛏️", memberCount: 2500, isOfficial: false }
  ],
  member: [
    { id: "5", name: "Minecraft Any% Guild", icon: "⛏️", memberCount: 1850, isOfficial: false },
    { id: "6", name: "Portal Speedrun Hub", icon: "🔵", memberCount: 420, isOfficial: false },
    { id: "11", name: "Elden Ring Speedrunners", icon: "⚔️", memberCount: 980, isOfficial: true },
    { id: "12", name: "Legend of Zelda BOTW", icon: "🏹", memberCount: 1650, isOfficial: true },
    { id: "13", name: "Stardew Valley Runners", icon: "🌾", memberCount: 320, isOfficial: false },
    { id: "14", name: "Dark Souls Guild", icon: "🔥", memberCount: 890, isOfficial: true },
    { id: "15", name: "Cuphead Speedrun Club", icon: "☕", memberCount: 410, isOfficial: false },
    { id: "16", name: "Doom Eternal Slayers", icon: "👹", memberCount: 730, isOfficial: true }
  ]
};

// Extended mock data for channels
const mockChannels = {
  "1": [
    { id: "101", name: "half-life", linkedGames: [
      { id: "g1", name: "Half-Life", lastNotification: "2023-10-12T14:30:00Z", notificationSettings: {
        newRuns: true,
        worldRecords: true,
        top3: true,
        personalBests: false,
        approvedRuns: true
      } },
      { id: "g2", name: "Half-Life 2", lastNotification: "2023-10-15T09:45:00Z", notificationSettings: {
        newRuns: true,
        worldRecords: true,
        top3: false,
        personalBests: true,
        approvedRuns: false
      } }
    ]},
    { id: "102", name: "half-life-alyx", linkedGames: [
      { id: "g3", name: "Half-Life: Alyx", lastNotification: "2023-10-14T18:20:00Z", notificationSettings: {
        newRuns: true,
        worldRecords: true,
        top3: true,
        personalBests: true,
        approvedRuns: true
      } }
    ]},
    { id: "103", name: "black-mesa", linkedGames: [] }
  ],
  "2": [
    { id: "201", name: "sm64-16star", linkedGames: [
      { id: "g4", name: "Super Mario 64", lastNotification: "2023-10-16T11:10:00Z" }
    ]},
    { id: "202", name: "sm64-70star", linkedGames: [
      { id: "g4", name: "Super Mario 64", lastNotification: "2023-10-13T16:40:00Z" }
    ]},
    { id: "203", name: "sm64-120star", linkedGames: [
      { id: "g4", name: "Super Mario 64", lastNotification: "2023-10-10T20:15:00Z" }
    ]}
  ],
  "3": [
    { id: "301", name: "gta-san-andreas", linkedGames: [
      { id: "g5", name: "Grand Theft Auto: San Andreas", lastNotification: "2023-10-11T13:25:00Z" }
    ]},
    { id: "302", name: "gta-vice-city", linkedGames: [
      { id: "g6", name: "Grand Theft Auto: Vice City", lastNotification: "2023-10-09T15:50:00Z" }
    ]}
  ],
  "4": [
    { id: "401", name: "worms-armageddon-strategies", linkedGames: [] },
    { id: "402", name: "worms-speedruns", linkedGames: [
      { id: "g7", name: "Worms Armageddon", lastNotification: "2023-10-08T10:30:00Z" }
    ]}
  ],
  "5": [
    { id: "501", name: "minecraft-any-percent", linkedGames: [
      { id: "g8", name: "Minecraft", lastNotification: "2023-10-17T12:00:00Z" }
    ]}
  ],
  "6": [
    { id: "601", name: "portal-inbounds", linkedGames: [
      { id: "g9", name: "Portal", lastNotification: "2023-10-14T09:20:00Z" }
    ]},
    { id: "602", name: "portal-oob", linkedGames: [
      { id: "g9", name: "Portal", lastNotification: "2023-10-16T17:45:00Z" }
    ]}
  ],
  "7": [
    { id: "701", name: "celeste-any-percent", linkedGames: [
      { id: "g15", name: "Celeste", lastNotification: "2023-10-16T15:30:00Z" }
    ]},
    { id: "702", name: "celeste-all-berries", linkedGames: [
      { id: "g15", name: "Celeste", lastNotification: "2023-10-15T20:45:00Z" }
    ]}
  ],
  "8": [
    { id: "801", name: "hades-fresh-file", linkedGames: [
      { id: "g16", name: "Hades", lastNotification: "2023-10-14T12:20:00Z" }
    ]},
    { id: "802", name: "hades-all-weapons", linkedGames: [
      { id: "g16", name: "Hades", lastNotification: "2023-10-13T18:15:00Z" }
    ]}
  ],
  "9": [
    { id: "901", name: "hollow-knight-any", linkedGames: [
      { id: "g17", name: "Hollow Knight", lastNotification: "2023-10-12T14:50:00Z" }
    ]},
    { id: "902", name: "hollow-knight-all-skills", linkedGames: [
      { id: "g17", name: "Hollow Knight", lastNotification: "2023-10-11T19:30:00Z" }
    ]}
  ],
  "10": [
    { id: "1001", name: "minecraft-glitchless", linkedGames: [
      { id: "g8", name: "Minecraft", lastNotification: "2023-10-10T16:25:00Z" }
    ]},
    { id: "1002", name: "minecraft-set-seed", linkedGames: [
      { id: "g8", name: "Minecraft", lastNotification: "2023-10-09T11:10:00Z" }
    ]}
  ],
  "11": [
    { id: "1101", name: "elden-ring-any", linkedGames: [
      { id: "g18", name: "Elden Ring", lastNotification: "2023-10-08T13:45:00Z" }
    ]},
    { id: "1102", name: "elden-ring-all-remembrances", linkedGames: [
      { id: "g18", name: "Elden Ring", lastNotification: "2023-10-07T20:30:00Z" }
    ]}
  ],
  "12": [
    { id: "1201", name: "botw-any-percent", linkedGames: [
      { id: "g14", name: "The Legend of Zelda: Breath of the Wild", lastNotification: "2023-10-06T15:20:00Z" }
    ]},
    { id: "1202", name: "botw-all-shrines", linkedGames: [
      { id: "g14", name: "The Legend of Zelda: Breath of the Wild", lastNotification: "2023-10-05T12:50:00Z" }
    ]},
    { id: "1203", name: "botw-all-main-quests", linkedGames: [
      { id: "g14", name: "The Legend of Zelda: Breath of the Wild", lastNotification: "2023-10-04T18:30:00Z" }
    ]}
  ]
};

// Expanded mock data for games that can be linked
const mockAvailableGames = [
  { id: "g1", name: "Half-Life" },
  { id: "g2", name: "Half-Life 2" },
  { id: "g3", name: "Half-Life: Alyx" },
  { id: "g4", name: "Super Mario 64" },
  { id: "g5", name: "Grand Theft Auto: San Andreas" },
  { id: "g6", name: "Grand Theft Auto: Vice City" },
  { id: "g7", name: "Worms Armageddon" },
  { id: "g8", name: "Minecraft" },
  { id: "g9", name: "Portal" },
  { id: "g10", name: "Portal 2" },
  { id: "g11", name: "Doom" },
  { id: "g12", name: "Doom Eternal" },
  { id: "g13", name: "The Legend of Zelda: Ocarina of Time" },
  { id: "g14", name: "The Legend of Zelda: Breath of the Wild" },
  { id: "g15", name: "Celeste" },
  { id: "g16", name: "Hades" },
  { id: "g17", name: "Hollow Knight" },
  { id: "g18", name: "Elden Ring" },
  { id: "g19", name: "Dark Souls" },
  { id: "g20", name: "Dark Souls II" },
  { id: "g21", name: "Dark Souls III" },
  { id: "g22", name: "Bloodborne" },
  { id: "g23", name: "Sekiro: Shadows Die Twice" },
  { id: "g24", name: "Demon's Souls" },
  { id: "g25", name: "Cuphead" },
  { id: "g26", name: "Stardew Valley" },
  { id: "g27", name: "Undertale" },
  { id: "g28", name: "Deltarune" },
  { id: "g29", name: "Ori and the Blind Forest" },
  { id: "g30", name: "Ori and the Will of the Wisps" },
  { id: "g31", name: "Resident Evil 2 Remake" },
  { id: "g32", name: "Resident Evil 3 Remake" },
  { id: "g33", name: "Resident Evil 4 Remake" },
  { id: "g34", name: "Resident Evil 7" },
  { id: "g35", name: "Resident Evil Village" },
  { id: "g36", name: "Final Fantasy VII" },
  { id: "g37", name: "Final Fantasy VII Remake" },
  { id: "g38", name: "Final Fantasy XVI" },
  { id: "g39", name: "Metroid Dread" },
  { id: "g40", name: "Super Metroid" }
];

// Expanded mock data for moderators
const mockModerators = {
  "1": [
    { id: "mod1", type: "user", name: "SpeedyMcRunner", avatar: null },
    { id: "mod2", type: "role", name: "Half-Life Moderators", color: "#8a2be2" }
  ],
  "2": [
    { id: "mod3", type: "user", name: "Mario64Expert", avatar: null },
    { id: "mod4", type: "role", name: "Mario Mods", color: "#e52b50" }
  ],
  "3": [
    { id: "mod5", type: "user", name: "GTAmaster", avatar: null },
    { id: "mod6", type: "role", name: "GTA Moderators", color: "#4682b4" }
  ],
  "7": [
    { id: "mod7", type: "user", name: "MountainClimber", avatar: null }
  ],
  "8": [
    { id: "mod8", type: "user", name: "EscapeHades", avatar: null }
  ],
  "9": [
    { id: "mod9", type: "user", name: "VoidWalker", avatar: null },
    { id: "mod10", type: "role", name: "Knight Moderators", color: "#20b2aa" }
  ]
};

// Mock data for popular games using the bot
const popularGames = [
  { name: "Half-Life 2", icon: "🔫" },
  { name: "Minecraft", icon: "⛏️" },
  { name: "Super Mario 64", icon: "🍄" },
  { name: "Portal", icon: "🔵" },
  { name: "GTA: San Andreas", icon: "🚗" },
  { name: "Doom Eternal", icon: "👹" },
  { name: "The Legend of Zelda: BotW", icon: "🏹" },
  { name: "Celeste", icon: "🏔️" },
  { name: "Elden Ring", icon: "⚔️" },
  { name: "Hollow Knight", icon: "🐞" },
  { name: "Hades", icon: "🔥" },
  { name: "Dark Souls", icon: "🗡️" },
  { name: "Cuphead", icon: "☕" },
  { name: "Stardew Valley", icon: "🌾" },
  { name: "Resident Evil", icon: "🧟" },
  { name: "Metroid", icon: "👾" }
];

// This is a placeholder Dashboard, you'll expand this with actual functionality later
const Dashboard = () => {
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [gameSearchTerm, setGameSearchTerm] = useState("");
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [editingGameSettings, setEditingGameSettings] = useState<{channelId: string, gameId: string} | null>(null);
  const [showAddModerator, setShowAddModerator] = useState(false);
  const [notificationCopied, setNotificationCopied] = useState(false);
  const [showAddGuild, setShowAddGuild] = useState(false);

  // Combine all guilds for displaying in sidebar
  const allGuilds = {
    owner: mockGuilds.owner,
    admin: mockGuilds.admin,
    member: mockGuilds.member
  };

  // Filter games based on search term
  const filteredGames = mockAvailableGames.filter(game => 
    game.name.toLowerCase().includes(gameSearchTerm.toLowerCase())
  );

  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return "Today at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return "Yesterday at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return diffInDays + " days ago";
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Back to guild selection
  const handleBackToGuilds = () => {
    setSelectedGuildId(null);
    setActiveChannelId(null);
    setEditingGameSettings(null);
  };

  // Link a game to a channel
  const handleLinkGame = (channelId: string, gameId: string) => {
    console.log(`Linking game ${gameId} to channel ${channelId}`);
    // In a real app, you would update the database here
    setGameSearchTerm("");
    setActiveChannelId(null);
  };

  // Unlink a game from a channel
  const handleUnlinkGame = (channelId: string, gameId: string) => {
    console.log(`Unlinking game ${gameId} from channel ${channelId}`);
    // In a real app, you would update the database here
  };

  // Update game notification settings
  const handleUpdateNotificationSettings = (channelId: string, gameId: string, setting: string) => {
    console.log(`Updating ${setting} for game ${gameId} in channel ${channelId}`);
    // In a real app, you would update the database here
  };

  // Copy share text
  const handleCopyShareText = () => {
    const shareText = "Check out speedrun.bot! It's a great Discord bot for tracking speedruns from speedrun.com. Add it to your server: https://speedrun.bot/invite";
    navigator.clipboard.writeText(shareText)
      .then(() => {
        setNotificationCopied(true);
        setTimeout(() => setNotificationCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Check if user is owner or admin of selected guild
  const isOwnerOrAdmin = (guildId: string) => {
    return mockGuilds.owner.some(g => g.id === guildId) || mockGuilds.admin.some(g => g.id === guildId);
  };

  // Check if user is owner of selected guild
  const isOwner = (guildId: string) => {
    return mockGuilds.owner.some(g => g.id === guildId);
  };

  // Get the current guild type (owner, admin, member)
  const getGuildType = (guildId: string) => {
    if (mockGuilds.owner.some(g => g.id === guildId)) return "owner";
    if (mockGuilds.admin.some(g => g.id === guildId)) return "admin";
    return "member";
  };

  // Get guild details by ID
  const getGuildById = (guildId: string) => {
    const owner = mockGuilds.owner.find(g => g.id === guildId);
    if (owner) return owner;
    
    const admin = mockGuilds.admin.find(g => g.id === guildId);
    if (admin) return admin;
    
    return mockGuilds.member.find(g => g.id === guildId);
  };

  return (
    <div className="min-h-screen bg-discord-darker text-white relative">
      {/* Header */}
      <header className="bg-discord-dark py-4 border-b border-gray-800 sticky top-0 z-20">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Bell className="w-6 h-6 text-discord-blurple" />
              <span className="text-xl font-bold bg-gradient-to-r from-discord-blurple to-discord-fuchsia bg-clip-text text-transparent">
                speedrun.bot
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" alt="User avatar" />
                <AvatarFallback className="bg-discord-blurple">
                  <User className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-300 text-sm hidden md:inline-block">User#1234</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content with Sidebar */}
      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        <SidebarProvider>
          <Sidebar collapsible="icon" side="left" className="bg-discord-dark border-discord-dark">
            <SidebarHeader>
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-discord-blurple mr-2" />
                  <span className="font-medium">speedrun.bot</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-full p-0 w-8 h-8 hover:bg-discord-dark/50" 
                  onClick={() => setShowAddGuild(!showAddGuild)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              {/* User Settings Section */}
              <SidebarGroup>
                <SidebarGroupLabel>Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="User Settings">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>User Settings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              {/* Owner Guilds */}
              {allGuilds.owner.length > 0 && (
                <SidebarGroup>
                  <SidebarGroupLabel>
                    <Shield className="w-3 h-3 mr-1" />
                    Owner Guilds
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {allGuilds.owner.map(guild => (
                        <SidebarMenuItem key={guild.id}>
                          <SidebarMenuButton 
                            isActive={selectedGuildId === guild.id}
                            onClick={() => setSelectedGuildId(guild.id)}
                            tooltip={guild.name}
                          >
                            <div className="flex items-center justify-center text-lg w-4 h-4">
                              {guild.icon}
                            </div>
                            <span>{guild.name}</span>
                            {guild.isOfficial && (
                              <Badge className="ml-auto bg-green-600 hover:bg-green-700 text-xs py-0 h-5">
                                <Shield className="w-3 h-3 mr-1" />
                                Official
                              </Badge>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
              
              {/* Admin Guilds */}
              {allGuilds.admin.length > 0 && (
                <SidebarGroup>
                  <SidebarGroupLabel>
                    <Settings className="w-3 h-3 mr-1" />
                    Admin Guilds
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {allGuilds.admin.map(guild => (
                        <SidebarMenuItem key={guild.id}>
                          <SidebarMenuButton 
                            isActive={selectedGuildId === guild.id}
                            onClick={() => setSelectedGuildId(guild.id)}
                            tooltip={guild.name}
                          >
                            <div className="flex items-center justify-center text-lg w-4 h-4">
                              {guild.icon}
                            </div>
                            <span>{guild.name}</span>
                            {guild.isOfficial && (
                              <Badge className="ml-auto bg-green-600 hover:bg-green-700 text-xs py-0 h-5">
                                <Shield className="w-3 h-3 mr-1" />
                                Official
                              </Badge>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
              
              {/* Member Guilds */}
              {allGuilds.member.length > 0 && (
                <SidebarGroup>
                  <SidebarGroupLabel>
                    <Users className="w-3 h-3 mr-1" />
                    Member Guilds
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {allGuilds.member.map(guild => (
                        <SidebarMenuItem key={guild.id}>
                          <SidebarMenuButton 
                            isActive={selectedGuildId === guild.id}
                            onClick={() => setSelectedGuildId(guild.id)}
                            tooltip={guild.name}
                          >
                            <div className="flex items-center justify-center text-lg w-4 h-4">
                              {guild.icon}
                            </div>
                            <span>{guild.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </SidebarContent>
            
            <SidebarFooter>
              <div className="p-2 text-center text-xs text-gray-400">
                <a href="https://speedrun.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:text-gray-300">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  speedrun.com
                </a>
              </div>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
          
          {/* Main Content Area */}
          <div className="flex-1 p-4 md:p-6">
            {/* Add Guild View */}
            {showAddGuild && (
              <div>
                <div className="flex items-center mb-6">
                  <Button 
                    variant="ghost" 
                    className="mr-4 hover:bg-discord-dark/50"
                    onClick={() => setShowAddGuild(false)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <h1 className="text-2xl font-bold">Add speedrun.bot to a Guild</h1>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-discord-dark p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">Invite the Bot</h2>
                    <p className="text-gray-300 mb-4">
                      To add speedrun.bot to your Discord guild, you need to have "Manage Server" permissions.
                    </p>
                    
                    <div className="space-y-4">
                      <Button 
                        size="lg" 
                        className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                      >
                        <Plus className="mr-2 w-4 h-4" />
                        Add to Discord Guild
                      </Button>
                    </div>
                  </div>
                  
                  {/* Share Section */}
                  <div className="bg-discord-dark p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">Share speedrun.bot</h2>
                    <p className="text-gray-300 mb-4">
                      Share speedrun.bot with your friends and communities to help spread the word about this free Discord bot.
                    </p>
                    
                    <div className="bg-discord-darker/50 p-4 rounded-md mb-4">
                      <p className="text-sm text-gray-300 mb-3">
                        Check out speedrun.bot! It's a great Discord bot for tracking speedruns from speedrun.com. Add it to your server: https://speedrun.bot/invite
                      </p>
                      <Button 
                        onClick={handleCopyShareText}
                        className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                      >
                        <Copy className="mr-2 w-4 h-4" />
                        {notificationCopied ? "Copied!" : "Copy to Clipboard"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* User Settings View */}
            {!selectedGuildId && !showAddGuild && (
              <div>
                <h1 className="text-2xl font-bold mb-6">User Settings</h1>
                <div className="bg-discord-dark p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-3">Connect Your Account</h2>
                  <p className="text-gray-300 mb-4">
                    Connect your speedrun.com account to allow the bot to mention you on Discord when your runs are detected.
                  </p>
                  
                  <div className="bg-discord-darker/50 p-4 rounded-md border border-discord-blurple/30 mb-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-yellow-500/20 rounded p-2">
                        <Bell className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-300 text-sm">
                          <strong>Privacy Note:</strong> Temporarily pasting your speedrun.com API key will allow the bot to verify your identity and @-mention you on Discord when your runs are detected. Your API key is only used for verification and is not stored on our servers.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        speedrun.com Username
                      </label>
                      <input 
                        type="text" 
                        className="w-full bg-discord-darker border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none"
                        placeholder="Your speedrun.com username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        speedrun.com API Key (temporary verification only)
                      </label>
                      <input 
                        type="password" 
                        className="w-full bg-discord-darker border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none"
                        placeholder="Paste your API key for verification"
                      />
                      <p className="mt-1 text-sm text-gray-400">
                        Find your API key in your speedrun.com account settings.
                      </p>
                    </div>
                    
                    <Button className="bg-discord-blurple hover:bg-discord-blurple/90 text-white">
                      <UserCheck className="mr-2 w-4 h-4" />
                      Verify Identity
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Guild Management View */}
            {selectedGuildId && !showAddGuild && (
              <div>
                <div className="flex items-center mb-6">
                  <Button 
                    variant="ghost" 
                    className="mr-2 hover:bg-discord-dark/50 md:hidden"
                    onClick={handleBackToGuilds}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <h1 className="text-2xl font-bold flex items-center">
                    {getGuildById(selectedGuildId)?.name}
                    {getGuildById(selectedGuildId)?.isOfficial && (
                      <Badge className="ml-3 bg-green-600 hover:bg-green-700 py-1">
                        <Shield className="w-3 h-3 mr-1" />
                        Official Guild
                      </Badge>
                    )}
                  </h1>
                </div>
                
                {/* Moderators Section - Only visible to owners and admins */}
                {isOwnerOrAdmin(selectedGuildId) && (
                  <div className="bg-discord-dark rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Moderators</h2>
                      {isOwner(selectedGuildId) && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-discord-blurple text-discord-blurple hover:bg-discord-blurple hover:text-white"
                          onClick={() => setShowAddModerator(!showAddModerator)}
                        >
                          {showAddModerator ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                          {showAddModerator ? "Cancel" : "Add Moderator"}
                        </Button>
                      )}
                    </div>
                    
                    {showAddModerator && isOwner(selectedGuildId) && (
                      <div className="bg-discord-darker p-4 rounded-md mb-4">
                        <div className="mb-4">
                          <p className="text-sm text-gray-300 mb-2">
                            Moderators have the same abilities as you for managing game notifications, 
                            but cannot remove you (the owner) or remove the bot entirely from the guild.
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <div className="flex-1">
                            <select className="w-full bg-discord-darker border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none">
                              <option value="">Select type...</option>
                              <option value="user">Discord User</option>
                              <option value="role">Discord Role</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <input 
                              type="text" 
                              placeholder="Search users or roles..."
                              className="w-full bg-discord-darker border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none"
                            />
                          </div>
                          <Button className="bg-discord-blurple hover:bg-discord-blurple/90 text-white">
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {mockModerators[selectedGuildId as keyof typeof mockModerators]?.map(mod => (
                        <div key={mod.id} className="flex items-center justify-between bg-discord-darker p-2 rounded-md">
                          <div className="flex items-center">
                            {mod.type === "user" ? (
                              <>
                                <Avatar className="w-6 h-6 mr-2">
                                  <AvatarFallback className="bg-discord-blurple/60 text-xs">
                                    {mod.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{mod.name}</span>
                              </>
                            ) : (
                              <>
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: mod.color }}></div>
                                <span className="font-medium">@{mod.name}</span>
                              </>
                            )}
                          </div>
                          {isOwner(selectedGuildId) && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-500">
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {(!mockModerators[selectedGuildId as keyof typeof mockModerators] || 
                       mockModerators[selectedGuildId as keyof typeof mockModerators].length === 0) && (
                        <p className="text-gray-400 text-sm italic">No moderators added yet</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Notification Channels */}
                <div className="bg-discord-dark rounded-lg p-4 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Notification Channels</h2>
                  <div className="space-y-4">
                    {mockChannels[selectedGuildId as keyof typeof mockChannels]?.map(channel => (
                      <div key={channel.id} className="bg-discord-darker rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2 text-discord-blurple" />
                            #{channel.name}
                          </h3>
                          {activeChannelId !== channel.id && isOwnerOrAdmin(selectedGuildId) && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-discord-blurple text-discord-blurple hover:bg-discord-blurple hover:text-white"
                              onClick={() => setActiveChannelId(channel.id)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Link Game
                            </Button>
                          )}
                        </div>
                        
                        {activeChannelId === channel.id && isOwnerOrAdmin(selectedGuildId) && (
                          <div className="mb-4 bg-discord-dark/50 p-3 rounded-md">
                            <div className="flex items-center mb-2">
                              <input 
                                type="text" 
                                placeholder="Search speedrun.com games..." 
                                className="bg-discord-darker flex-1 border border-gray-700 rounded-md py-1 px-3 text-white focus:border-discord-blurple focus:outline-none"
                                value={gameSearchTerm}
                                onChange={(e) => setGameSearchTerm(e.target.value)}
                              />
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="ml-2 text-gray-400 hover:text-white"
                                onClick={() => setActiveChannelId(null)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            {gameSearchTerm && (
                              <div className="max-h-40 overflow-y-auto bg-discord-darker rounded-md mt-2">
                                {filteredGames.length > 0 ? (
                                  filteredGames.map(game => (
                                    <div 
                                      key={game.id} 
                                      className="p-2 hover:bg-discord-dark/70 cursor-pointer text-gray-300 hover:text-white"
                                      onClick={() => handleLinkGame(channel.id, game.id)}
                                    >
                                      {game.name}
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-2 text-gray-400">No games found</div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {channel.linkedGames.length === 0 ? (
                          <p className="text-gray-400 text-sm italic">No games linked to this channel</p>
                        ) : (
                          <div className="space-y-2">
                            {channel.linkedGames.map(game => (
                              <div key={game.id} className="flex flex-col p-2 bg-discord-dark/30 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <Gamepad className="w-4 h-4 text-discord-green mr-2" />
                                    <span>{game.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center text-xs text-gray-400">
                                      <Clock className="w-3 h-3 mr-1" />
                                      <span>Last: {formatDate(game.lastNotification)}</span>
                                    </div>
                                    
                                    {isOwnerOrAdmin(selectedGuildId) && (
                                      <>
                                        {editingGameSettings && editingGameSettings.channelId === channel.id && editingGameSettings.gameId === game.id ? (
                                          <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="text-gray-400 hover:text-white h-8 p-0 w-8" 
                                            onClick={() => setEditingGameSettings(null)}
                                          >
                                            <X className="w-4 h-4" />
                                          </Button>
                                        ) : (
                                          <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="text-gray-400 hover:text-white h-8 p-0 w-8" 
                                            onClick={() => setEditingGameSettings({channelId: channel.id, gameId: game.id})}
                                          >
                                            <Settings className="w-4 h-4" />
                                          </Button>
                                        )}
                                        
                                        <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          className="text-gray-400 hover:text-red-500 h-8 p-0 w-8" 
                                          onClick={() => handleUnlinkGame(channel.id, game.id)}
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                {editingGameSettings && editingGameSettings.channelId === channel.id && editingGameSettings.gameId === game.id && isOwnerOrAdmin(selectedGuildId) && (
                                  <div className="mt-2 p-2 bg-discord-dark/50 rounded-md">
                                    <h4 className="text-sm font-medium mb-2">Notification Settings</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div className="flex items-center justify-between text-sm bg-discord-darker p-2 rounded">
                                        <div className="flex items-center">
                                          <Trophy className="w-3 h-3 text-yellow-500 mr-1" />
                                          <span>World Records</span>
                                        </div>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className={game.notificationSettings?.worldRecords 
                                            ? "border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2" 
                                            : "border-gray-700 text-gray-400 hover:bg-gray-700/20 h-6 py-0 px-2"}
                                          onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'worldRecords')}
                                        >
                                          {game.notificationSettings?.worldRecords ? "On" : "Off"}
                                        </Button>
                                      </div>
                                      
                                      <div className="flex items-center justify-between text-sm bg-discord-darker p-2 rounded">
                                        <div className="flex items-center">
                                          <Medal className="w-3 h-3 text-blue-400 mr-1" />
                                          <span>Top 3</span>
                                        </div>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className={game.notificationSettings?.top3 
                                            ? "border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2" 
                                            : "border-gray-700 text-gray-400 hover:bg-gray-700/20 h-6 py-0 px-2"}
                                          onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'top3')}
                                        >
                                          {game.notificationSettings?.top3 ? "On" : "Off"}
                                        </Button>
                                      </div>
                                      
                                      <div className="flex items-center justify-between text-sm bg-discord-darker p-2 rounded">
                                        <div className="flex items-center">
                                          <Zap className="w-3 h-3 text-purple-400 mr-1" />
                                          <span>New Runs</span>
                                        </div>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className={game.notificationSettings?.newRuns 
                                            ? "border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2" 
                                            : "border-gray-700 text-gray-400 hover:bg-gray-700/20 h-6 py-0 px-2"}
                                          onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'newRuns')}
                                        >
                                          {game.notificationSettings?.newRuns ? "On" : "Off"}
                                        </Button>
                                      </div>
                                      
                                      <div className="flex items-center justify-between text-sm bg-discord-darker p-2 rounded">
                                        <div className="flex items-center">
                                          <Flag className="w-3 h-3 text-red-400 mr-1" />
                                          <span>Personal Bests</span>
                                        </div>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className={game.notificationSettings?.personalBests 
                                            ? "border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2" 
                                            : "border-gray-700 text-gray-400 hover:bg-gray-700/20 h-6 py-0 px-2"}
                                          onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'personalBests')}
                                        >
                                          {game.notificationSettings?.personalBests ? "On" : "Off"}
                                        </Button>
                                      </div>
                                      
                                      <div className="flex items-center justify-between text-sm bg-discord-darker p-2 rounded">
                                        <div className="flex items-center">
                                          <FileCheck className="w-3 h-3 text-green-400 mr-1" />
                                          <span>Approved Runs</span>
                                        </div>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className={game.notificationSettings?.approvedRuns 
                                            ? "border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2" 
                                            : "border-gray-700 text-gray-400 hover:bg-gray-700/20 h-6 py-0 px-2"}
                                          onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'approvedRuns')}
                                        >
                                          {game.notificationSettings?.approvedRuns ? "On" : "Off"}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </SidebarProvider>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
