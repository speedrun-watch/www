
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// Mock data for guild listings
const mockGuilds = {
  owner: [
    { id: "1", name: "Half-Life Speedrunners", icon: "🔧", memberCount: 350, isOfficial: true },
    { id: "2", name: "Super Mario 64 Masters", icon: "🍄", memberCount: 1240 }
  ],
  admin: [
    { id: "3", name: "GTA Speedrun Community", icon: "🚗", memberCount: 870, isOfficial: true },
    { id: "4", name: "Worms Armageddon Runners", icon: "🐛", memberCount: 230 }
  ],
  member: [
    { id: "5", name: "Minecraft Any% Guild", icon: "⛏️", memberCount: 1850 },
    { id: "6", name: "Portal Speedrun Hub", icon: "🔵", memberCount: 420 }
  ]
};

// Mock data for channels
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
  ]
};

// Mock data for games that can be linked
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
  { id: "g14", name: "The Legend of Zelda: Breath of the Wild" }
];

// Mock data for moderators
const mockModerators = {
  "1": [
    { id: "mod1", type: "user", name: "SpeedyMcRunner", avatar: null },
    { id: "mod2", type: "role", name: "Half-Life Moderators", color: "#8a2be2" }
  ],
  "2": [
    { id: "mod3", type: "user", name: "Mario64Expert", avatar: null }
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
  { name: "Celeste", icon: "🏔️" }
];

// This is a placeholder Dashboard, you'll expand this with actual functionality later
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [activeGuildCategory, setActiveGuildCategory] = useState("all");
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [gameSearchTerm, setGameSearchTerm] = useState("");
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [editingGameSettings, setEditingGameSettings] = useState<{channelId: string, gameId: string} | null>(null);
  const [showAddModerator, setShowAddModerator] = useState(false);
  const [notificationCopied, setNotificationCopied] = useState(false);

  // Combine all guilds for the "all" category
  const allGuilds = [
    ...mockGuilds.owner,
    ...mockGuilds.admin,
    ...mockGuilds.member
  ];

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

  return (
    <div className="min-h-screen bg-discord-darker text-white">
      {/* Header */}
      <header className="bg-discord-dark py-4 border-b border-gray-800">
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
      
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 glass rounded-lg p-4">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "home" 
                    ? "bg-discord-blurple text-white" 
                    : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                }`}
                onClick={() => setActiveTab("home")}
              >
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "guilds" 
                    ? "bg-discord-blurple text-white" 
                    : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                }`}
                onClick={() => setActiveTab("guilds")}
              >
                <Server className="mr-2 h-5 w-5" />
                Discord Guilds
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "games" 
                    ? "bg-discord-blurple text-white" 
                    : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                }`}
                onClick={() => setActiveTab("games")}
              >
                <Gamepad className="mr-2 h-5 w-5" />
                Games
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "settings" 
                    ? "bg-discord-blurple text-white" 
                    : "text-gray-400 hover:text-white hover:bg-discord-dark/50"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </nav>

            {/* Resources Section */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Resources</h3>
              <div className="space-y-2">
                <a href="https://speedrun.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-300 hover:text-white">
                  <ExternalLink className="mr-2 h-4 w-4 text-gray-400" />
                  speedrun.com
                </a>
                <a href="#" className="flex items-center text-sm text-gray-300 hover:text-white">
                  <MessageSquare className="mr-2 h-4 w-4 text-gray-400" />
                  Support Server
                </a>
                <a href="https://github.com/speedrunbot/docs" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-300 hover:text-white">
                  <Github className="mr-2 h-4 w-4 text-gray-400" />
                  Documentation
                </a>
                <a href="#" className="flex items-center text-sm text-gray-300 hover:text-white">
                  <BookOpen className="mr-2 h-4 w-4 text-gray-400" />
                  Guides
                </a>
              </div>
            </div>

            {/* Ideas & Suggestions */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Ideas & Suggestions</h3>
              <div className="space-y-2">
                <a href="#" className="flex items-center text-sm text-gray-300 hover:text-white">
                  <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
                  Feature Requests
                </a>
                <a href="#" className="flex items-center text-sm text-gray-300 hover:text-white">
                  <BarChart className="mr-2 h-4 w-4 text-blue-400" />
                  Upcoming Features
                </a>
                <a href="#" className="flex items-center text-sm text-gray-300 hover:text-white">
                  <GitPullRequest className="mr-2 h-4 w-4 text-purple-400" />
                  Contribute
                </a>
                <a href="#" className="flex items-center text-sm text-gray-300 hover:text-white">
                  <Heart className="mr-2 h-4 w-4 text-red-400" />
                  Support Development
                </a>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 glass rounded-lg p-6">
            {activeTab === "home" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                <div className="glass border-0 p-12 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Gamepad className="w-16 h-16 text-discord-blurple mx-auto mb-4 opacity-40" />
                    <h3 className="text-xl font-semibold mb-2">Welcome to speedrun.bot</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Manage your Discord guilds and configure speedrun notifications here.
                    </p>
                    <Button 
                      className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                      onClick={() => setActiveTab("guilds")}
                    >
                      <Server className="mr-2 h-4 w-4" />
                      Manage Guilds
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "guilds" && !selectedGuildId && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Discord Guilds</h1>
                
                <Tabs defaultValue={activeGuildCategory} onValueChange={setActiveGuildCategory} className="mb-6">
                  <TabsList className="bg-discord-dark">
                    <TabsTrigger value="all" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">
                      All Guilds ({allGuilds.length})
                    </TabsTrigger>
                    <TabsTrigger value="owner" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">
                      <Shield className="mr-2 h-4 w-4" />
                      Owner ({mockGuilds.owner.length})
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin ({mockGuilds.admin.length})
                    </TabsTrigger>
                    <TabsTrigger value="member" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">
                      <Users className="mr-2 h-4 w-4" />
                      Member ({mockGuilds.member.length})
                    </TabsTrigger>
                  </TabsList>
                
                  <TabsContent value="all" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allGuilds.map(guild => (
                        <div key={guild.id} className="bg-discord-dark rounded-lg p-4 hover:bg-discord-dark/80 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-discord-blurple/20 flex items-center justify-center text-2xl">
                              {guild.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <h3 className="text-white font-medium truncate">{guild.name}</h3>
                                {guild.isOfficial && (
                                  <Badge className="ml-2 bg-green-600 hover:bg-green-700">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Official
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">{guild.memberCount} members</p>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                              onClick={() => setSelectedGuildId(guild.id)}
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                
                  <TabsContent value="owner" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockGuilds.owner.map(guild => (
                        <div key={guild.id} className="bg-discord-dark rounded-lg p-4 hover:bg-discord-dark/80 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-discord-blurple/20 flex items-center justify-center text-2xl">
                              {guild.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <h3 className="text-white font-medium truncate">{guild.name}</h3>
                                {guild.isOfficial && (
                                  <Badge className="ml-2 bg-green-600 hover:bg-green-700">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Official
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">{guild.memberCount} members</p>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                              onClick={() => setSelectedGuildId(guild.id)}
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                
                  {/* Admin and Member tabs - same pattern as the other tabs but with different data */}
                  <TabsContent value="admin" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockGuilds.admin.map(guild => (
                        <div key={guild.id} className="bg-discord-dark rounded-lg p-4 hover:bg-discord-dark/80 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-discord-blurple/20 flex items-center justify-center text-2xl">
                              {guild.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">{guild.name}</h3>
                              <p className="text-gray-400 text-sm">{guild.memberCount} members</p>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                              onClick={() => setSelectedGuildId(guild.id)}
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                
                  <TabsContent value="member" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockGuilds.member.map(guild => (
                        <div key={guild.id} className="bg-discord-dark rounded-lg p-4 hover:bg-discord-dark/80 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-discord-blurple/20 flex items-center justify-center text-2xl">
                              {guild.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">{guild.name}</h3>
                              <p className="text-gray-400 text-sm">{guild.memberCount} members</p>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                              onClick={() => setSelectedGuildId(guild.id)}
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {activeTab === "guilds" && selectedGuildId && (
              <div>
                <div className="flex items-center mb-6">
                  <Button 
                    variant="ghost" 
                    className="mr-4 hover:bg-discord-dark/50"
                    onClick={handleBackToGuilds}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  
                  <h1 className="text-2xl font-bold flex items-center">
                    {allGuilds.find(g => g.id === selectedGuildId)?.name}
                    {allGuilds.find(g => g.id === selectedGuildId)?.isOfficial && (
                      <Badge className="ml-3 bg-green-600 hover:bg-green-700 py-1">
                        <Shield className="w-3 h-3 mr-1" />
                        Official Guild
                      </Badge>
                    )}
                  </h1>
                </div>
                
                {/* Moderators Section */}
                <div className="bg-discord-dark rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Moderators</h2>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-discord-blurple text-discord-blurple hover:bg-discord-blurple hover:text-white"
                      onClick={() => setShowAddModerator(!showAddModerator)}
                    >
                      {showAddModerator ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                      {showAddModerator ? "Cancel" : "Add Moderator"}
                    </Button>
                  </div>
                  
                  {showAddModerator && (
                    <div className="bg-discord-darker p-4 rounded-md mb-4">
                      <div className="mb-4">
                        <p className="text-sm text-gray-300 mb-2">
                          Moderators have the same abilities as you for managing game notifications, 
                          but cannot remove you (the owner) or remove the bot entirely from the guild.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="flex-1">
                          <select className="w-full bg-discord-dark border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none">
                            <option value="">Select type...</option>
                            <option value="user">Discord User</option>
                            <option value="role">Discord Role</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="Search users or roles..."
                            className="w-full bg-discord-dark border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none"
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
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-500">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(!mockModerators[selectedGuildId as keyof typeof mockModerators] || 
                     mockModerators[selectedGuildId as keyof typeof mockModerators].length === 0) && (
                      <p className="text-gray-400 text-sm italic">No moderators added yet</p>
                    )}
                  </div>
                </div>
                
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
                          {activeChannelId !== channel.id && (
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
                        
                        {activeChannelId === channel.id && (
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
                                  </div>
                                </div>
                                
                                {editingGameSettings && editingGameSettings.channelId === channel.id && editingGameSettings.gameId === game.id && (
                                  <div className="mt-2 p-2 bg-discord-dark/50 rounded-md">
                                    <h4 className="text-sm font-medium mb-2">Notification Settings</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="flex items-center justify-between text-sm bg-discord-darker p-2 rounded">
                                        <div className="flex items-center">
                                          <Trophy className="w-3 h-3 text-yellow-500 mr-1" />
                                          <span>World Records</span>
                                        </div>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className={game.notificationSettings.worldRecords 
                                            ? "border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2" 
                                            : "border-gray-700 text-gray-400 hover:bg-gray-700/20 h-6 py-0 px-2"}
                                          onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'worldRecords')}
                                        >
                                          {game.notificationSettings.worldRecords ? "On" : "Off"}
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
                                          className={game.notificationSettings.top3 
                                            ? "border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2" 
                                            : "border-gray-700 text-gray-400 hover:bg-gray-700/20 h-6 py-0 px-2"}
                                          onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'top3')}
                                        >
                                          {game.notificationSettings.top3 ? "On" : "Off"}
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
                                          className={game.notificationSettings.newRuns 
                                            ? "border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2" 
                                            : "border-gray-700 text-gray-400 hover:bg-gray-700/20 h-6 py-0 px-2"}
                                          onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'newRuns')}
                                        >
                                          {game.notificationSettings.newRuns ? "On" : "Off"}
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
                                          className={game.notificationSettings.personalBests 
                                            ? "border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2" 
                                            : "border-gray-700 text-gray-400 hover:bg-gray-700/20 h-6 py-0 px-2"}
                                          onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'personalBests')}
                                        >
                                          {game.notificationSettings.personalBests ? "On" : "Off"}
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
                                          className={game.notificationSettings.approvedRuns 
                                            ? "border-green-500 text-green-400 hover:bg-green-500/20 h-6 py-0 px-2" 
                                            : "border-gray-700 text-gray-400 hover:bg-gray-700/20 h-6 py-0 px-2"}
                                          onClick={() => handleUpdateNotificationSettings(channel.id, game.id, 'approvedRuns')}
                                        >
                                          {game.notificationSettings.approvedRuns ? "On" : "Off"}
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
            
            {activeTab === "games" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Game Tracking</h1>
                <div className="glass border-0 p-12 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Gamepad className="w-16 h-16 text-discord-blurple mx-auto mb-4 opacity-40" />
                    <h3 className="text-xl font-semibold mb-2">Select a Guild First</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      To configure game tracking, first select a guild from the Discord Guilds section.
                    </p>
                    <Button 
                      className="bg-discord-blurple hover:bg-discord-blurple/90 text-white"
                      onClick={() => setActiveTab("guilds")}
                    >
                      <Server className="mr-2 h-4 w-4" />
                      Go to Guilds
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "settings" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Settings</h1>
                <div className="space-y-6">
                  <div className="glass p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">User Settings</h2>
                    <p className="text-gray-300 mb-4">
                      Connect your speedrun.com account to allow the bot to mention you on Discord when your runs are detected.
                    </p>
                    
                    <div className="bg-discord-dark/50 p-4 rounded-md border border-discord-blurple/30 mb-4">
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
                          className="w-full bg-discord-dark border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none"
                          placeholder="Your speedrun.com username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          speedrun.com API Key (temporary verification only)
                        </label>
                        <input 
                          type="password" 
                          className="w-full bg-discord-dark border border-gray-700 rounded-md py-2 px-3 text-white focus:border-discord-blurple focus:outline-none"
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
                  
                  {/* Share Section */}
                  <div className="glass p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">Share speedrun.bot</h2>
                    <p className="text-gray-300 mb-4">
                      Share speedrun.bot with your friends and communities to help spread the word about this free Discord bot.
                    </p>
                    
                    <div className="bg-discord-dark/50 p-4 rounded-md mb-4">
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
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
