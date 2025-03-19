
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  AlertCircle, 
  Plus, 
  Search, 
  Shield, 
  Trash2, 
  Globe, 
  Users, 
  GameController,
  AlertTriangle 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Mock game data
const gamesList = [
  { id: "1", name: "Half-Life 2", icon: "https://i.imgur.com/8b4zyOQ.png" },
  { id: "2", name: "Half-Life 2: Episode One", icon: "https://i.imgur.com/8b4zyOQ.png" },
  { id: "3", name: "Half-Life 2: Episode Two", icon: "https://i.imgur.com/8b4zyOQ.png" },
  { id: "4", name: "Portal", icon: "https://i.imgur.com/mQxxuD6.png" },
  { id: "5", name: "Portal 2", icon: "https://i.imgur.com/mQxxuD6.png" },
  { id: "6", name: "Minecraft", icon: "https://i.imgur.com/qgg0Z9i.png" },
  { id: "7", name: "Minecraft Dungeons", icon: "https://i.imgur.com/qgg0Z9i.png" },
  { id: "8", name: "Elden Ring", icon: "https://i.imgur.com/WX8AoGB.png" },
  { id: "9", name: "The Legend of Zelda: Breath of the Wild", icon: "https://i.imgur.com/OqEXQiE.png" },
  { id: "10", name: "The Legend of Zelda: Tears of the Kingdom", icon: "https://i.imgur.com/OqEXQiE.png" },
  { id: "11", name: "Dark Souls", icon: "https://i.imgur.com/1bXWyG8.png" },
  { id: "12", name: "Dark Souls II", icon: "https://i.imgur.com/1bXWyG8.png" },
  { id: "13", name: "Dark Souls III", icon: "https://i.imgur.com/1bXWyG8.png" },
  { id: "14", name: "Super Mario Odyssey", icon: "https://i.imgur.com/D7JhBVf.png" },
  { id: "15", name: "Hollow Knight", icon: "https://i.imgur.com/XUwP1ys.png" },
  { id: "16", name: "Celeste", icon: "https://i.imgur.com/l7JqgJ7.png" },
  { id: "17", name: "Hades", icon: "https://i.imgur.com/J1AxD5S.png" },
];

// Mock data for guilds and related information
const mockGuilds = [
  { 
    id: "1", 
    name: "Half-Life 2 Speedrunners", 
    icon: "https://i.imgur.com/8b4zyOQ.png", 
    memberCount: 2487, 
    role: "owner", 
    games: ["Half-Life 2", "Half-Life 2: Episode One", "Half-Life 2: Episode Two"],
    isOfficial: true,
    channels: [
      { id: "ch1", name: "general", type: "text", games: ["Half-Life 2"], settings: { worldRecords: true, top3: true, verified: true, submitted: false } },
      { id: "ch2", name: "announcements", type: "text", games: ["Half-Life 2: Episode One"], settings: { worldRecords: true, top3: false, verified: true, submitted: false } },
      { id: "ch3", name: "speedruns", type: "text", games: ["Half-Life 2: Episode Two"], settings: { worldRecords: true, top3: true, verified: true, submitted: true } },
      { id: "ch4", name: "voice-chat", type: "voice" }
    ],
    globalSettings: {
      worldRecords: true,
      top3: true,
      verified: true,
      submitted: false
    },
    roles: [
      { id: "r1", name: "Admin", color: "#ff0000" },
      { id: "r2", name: "Moderator", color: "#00ff00" },
      { id: "r3", name: "Speedrunner", color: "#0000ff" },
      { id: "r4", name: "Verified", color: "#ffff00" }
    ],
    moderators: [
      { id: "u1", name: "Jane Doe", avatar: "https://i.imgur.com/6yCHBsS.png", type: "user" },
      { id: "r2", name: "Moderator", color: "#00ff00", type: "role" }
    ],
    owner: { id: "u1", name: "Jane Doe", avatar: "https://i.imgur.com/6yCHBsS.png" }
  },
  { 
    id: "2", 
    name: "Minecraft Any%", 
    icon: "https://i.imgur.com/qgg0Z9i.png", 
    memberCount: 5623, 
    role: "moderator", 
    games: ["Minecraft", "Minecraft Dungeons"],
    channels: [
      { id: "ch1", name: "general", type: "text" },
      { id: "ch2", name: "announcements", type: "text" },
      { id: "ch3", name: "speedruns", type: "text" },
    ],
    roles: [
      { id: "r1", name: "Admin", color: "#ff0000" },
      { id: "r2", name: "Moderator", color: "#00ff00" },
      { id: "r3", name: "Speedrunner", color: "#0000ff" },
    ],
    moderators: [
      { id: "u2", name: "John Smith", avatar: "https://i.imgur.com/UQrQSAI.png", type: "user" },
      { id: "u1", name: "Jane Doe", avatar: "https://i.imgur.com/6yCHBsS.png", type: "user" },
      { id: "r2", name: "Moderator", color: "#00ff00", type: "role" }
    ],
    owner: { id: "u2", name: "John Smith", avatar: "https://i.imgur.com/UQrQSAI.png" }
  },
  { 
    id: "4", 
    name: "Portal Runners", 
    icon: "https://i.imgur.com/mQxxuD6.png", 
    memberCount: 1854, 
    role: "member", 
    games: ["Portal", "Portal 2"],
    channels: [
      { id: "ch1", name: "general", type: "text" },
      { id: "ch2", name: "announcements", type: "text" },
    ],
    roles: [
      { id: "r1", name: "Admin", color: "#ff0000" },
      { id: "r2", name: "Moderator", color: "#00ff00" },
    ],
    owner: { id: "u3", name: "Alex Johnson", avatar: "https://i.imgur.com/dxjHhRi.png" }
  }
];

const GuildDetail = () => {
  const { guildId } = useParams<{ guildId: string }>();
  const guild = mockGuilds.find(g => g.id === guildId);
  
  const [selectedTab, setSelectedTab] = useState("overview");
  const [newModerator, setNewModerator] = useState("");
  const [moderatorType, setModeratorType] = useState("user");
  const [gameSearch, setGameSearch] = useState("");
  const [openCommandMenu, setOpenCommandMenu] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  
  const textChannels = guild?.channels.filter(ch => ch.type === "text") || [];

  if (!guild) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6">
          <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Guild not found. Please select a valid guild from the sidebar.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  const isReadOnly = guild.role === "member";
  const isOwner = guild.role === "owner";

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={guild.icon} alt={guild.name} />
            <AvatarFallback>{guild.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold tracking-tight text-white">{guild.name}</h1>
              {guild.isOfficial && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Globe className="ml-2 h-5 w-5 text-discord-blurple" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Official Guild
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" /> 
              <span>{guild.memberCount.toLocaleString()} members</span>
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto bg-discord-darker/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-discord-blurple/30 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-discord-blurple/30 data-[state=active]:text-white">
              Games & Channels
            </TabsTrigger>
            <TabsTrigger value="moderators" className="data-[state=active]:bg-discord-blurple/30 data-[state=active]:text-white">
              Moderators
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-discord-dark/60 border-discord-darker text-gray-200">
              <CardHeader>
                <CardTitle className="text-white">Guild Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Basic information about the Discord guild.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Guild Name</Label>
                      <Input value={guild.name} readOnly className="mt-1 bg-discord-darker border-discord-dark text-gray-200" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Guild ID</Label>
                      <Input value={guild.id} readOnly className="mt-1 bg-discord-darker border-discord-dark text-gray-200" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Owner</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={guild.owner.avatar} alt={guild.owner.name} />
                        <AvatarFallback>{guild.owner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{guild.owner.name}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Official Status</Label>
                    <div className="flex items-center mt-2">
                      <Switch 
                        checked={guild.isOfficial || false} 
                        disabled={!isOwner || !guild.isOfficial} 
                      />
                      <span className="ml-2 text-gray-300">
                        {guild.isOfficial 
                          ? "This is an official guild for the game on speedrun.com" 
                          : "Not an official guild"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-discord-dark/60 border-discord-darker text-gray-200">
              <CardHeader>
                <CardTitle className="text-white">Bot Status</CardTitle>
                <CardDescription className="text-gray-400">
                  Status of the speedrun.bot in this guild.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <span>Bot is active and responding</span>
                  </div>
                  <div>
                    <Label className="text-gray-300">Added on</Label>
                    <div className="text-sm mt-1 text-gray-300">June 15, 2023</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="games" className="space-y-4">
            <Card className="bg-discord-dark/60 border-discord-darker text-gray-200">
              <CardHeader>
                <CardTitle className="text-white">Global Notification Preferences</CardTitle>
                <CardDescription className="text-gray-400">
                  Set default notification preferences for all channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="bg-discord-darker/50 border-discord-darker/80 text-gray-300">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertTitle>Guild Defaults</AlertTitle>
                    <AlertDescription>
                      These settings will be used as defaults for any new channels and games. Individual channel settings will override these defaults.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 border border-discord-darker/50 p-4 rounded-md">
                      <h3 className="font-medium text-gray-200">Notification Types</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="global-wr" defaultChecked={guild.globalSettings.worldRecords} disabled={isReadOnly} />
                          <Label htmlFor="global-wr" className="text-gray-300">World Records</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="global-top3" defaultChecked={guild.globalSettings.top3} disabled={isReadOnly} />
                          <Label htmlFor="global-top3" className="text-gray-300">Top 3 Runs</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="global-verified" defaultChecked={guild.globalSettings.verified} disabled={isReadOnly} />
                          <Label htmlFor="global-verified" className="text-gray-300">Verified Runs</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="global-submitted" defaultChecked={guild.globalSettings.submitted} disabled={isReadOnly} />
                          <Label htmlFor="global-submitted" className="text-gray-300">Submitted Runs</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 border border-discord-darker/50 p-4 rounded-md">
                      <h3 className="font-medium text-gray-200">Apply To All</h3>
                      <p className="text-sm text-gray-400">Apply these global settings to all existing channels and games</p>
                      <Button 
                        variant="default" 
                        className="w-full mt-2 bg-discord-blurple hover:bg-discord-blurple/80 text-white"
                        disabled={isReadOnly}
                      >
                        Apply To All Channels
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-discord-dark/60 border-discord-darker text-gray-200">
              <CardHeader>
                <CardTitle className="text-white">Channel Game Configurations</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure which games are tracked in each channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {textChannels.map((channel) => (
                    <div key={channel.id} className="py-4 border-b border-discord-darker/50 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-200">#{channel.name}</h3>
                        {!isReadOnly && (
                          <Popover open={openCommandMenu && selectedChannelId === channel.id} onOpenChange={(open) => {
                            setOpenCommandMenu(open);
                            if (open) setSelectedChannelId(channel.id);
                          }}>
                            <PopoverTrigger asChild>
                              <Button 
                                className="bg-discord-blurple hover:bg-discord-blurple/80 text-white" 
                                disabled={isReadOnly}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Game
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 border-discord-darker bg-discord-dark text-gray-200">
                              <Command>
                                <CommandInput 
                                  placeholder="Search games..." 
                                  className="border-none focus:ring-0 text-gray-200 bg-discord-darker/50" 
                                />
                                <CommandList>
                                  <CommandEmpty>No games found.</CommandEmpty>
                                  <CommandGroup>
                                    {gamesList.map((game) => (
                                      <CommandItem 
                                        key={game.id}
                                        className="hover:bg-discord-blurple/20 aria-selected:bg-discord-blurple/30"
                                        onSelect={() => {
                                          // Add game logic would go here
                                          setOpenCommandMenu(false);
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Avatar className="h-6 w-6">
                                            <AvatarImage src={game.icon} alt={game.name} />
                                            <AvatarFallback>
                                              <GameController className="h-4 w-4" />
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-gray-200">{game.name}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {channel.games && channel.games.length > 0 ? (
                          channel.games.map((gameName, idx) => {
                            const game = gamesList.find(g => g.name === gameName);
                            return (
                              <div key={idx} className="flex flex-col space-y-2 bg-discord-darker/40 p-3 rounded-md">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={game?.icon} alt={gameName} />
                                      <AvatarFallback>
                                        <GameController className="h-5 w-5" />
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-gray-200">{gameName}</span>
                                  </div>
                                  {!isReadOnly && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-gray-400 hover:text-white hover:bg-red-500/20"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Remove</span>
                                    </Button>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <div className="flex items-center space-x-2">
                                    <Switch 
                                      id={`${channel.id}-${idx}-wr`} 
                                      defaultChecked={channel.settings?.worldRecords} 
                                      disabled={isReadOnly} 
                                    />
                                    <Label 
                                      htmlFor={`${channel.id}-${idx}-wr`}
                                      className="text-gray-300 text-sm"
                                    >
                                      World Records
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch 
                                      id={`${channel.id}-${idx}-top3`} 
                                      defaultChecked={channel.settings?.top3} 
                                      disabled={isReadOnly} 
                                    />
                                    <Label 
                                      htmlFor={`${channel.id}-${idx}-top3`}
                                      className="text-gray-300 text-sm"
                                    >
                                      Top 3 Runs
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch 
                                      id={`${channel.id}-${idx}-verified`} 
                                      defaultChecked={channel.settings?.verified} 
                                      disabled={isReadOnly} 
                                    />
                                    <Label 
                                      htmlFor={`${channel.id}-${idx}-verified`}
                                      className="text-gray-300 text-sm"
                                    >
                                      Verified Runs
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch 
                                      id={`${channel.id}-${idx}-submitted`} 
                                      defaultChecked={channel.settings?.submitted} 
                                      disabled={isReadOnly} 
                                    />
                                    <Label 
                                      htmlFor={`${channel.id}-${idx}-submitted`}
                                      className="text-gray-300 text-sm"
                                    >
                                      Submitted Runs
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center p-4 bg-discord-darker/30 rounded-md text-gray-400">
                            No games configured for this channel.
                            {!isReadOnly && <p className="mt-1 text-sm">Use the "Add Game" button to start tracking games.</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="moderators" className="space-y-4">
            <Card className="bg-discord-dark/60 border-discord-darker text-gray-200">
              <CardHeader>
                <CardTitle className="text-white">Guild Moderators</CardTitle>
                <CardDescription className="text-gray-400">
                  {isReadOnly 
                    ? "Users and roles that have moderator access." 
                    : "Manage users and roles that can configure the bot."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isReadOnly && (
                  <Alert className="bg-discord-darker/50 border-discord-darker/80 text-gray-300">
                    <Shield className="h-4 w-4 text-discord-blurple" />
                    <AlertTitle>Moderator Permissions</AlertTitle>
                    <AlertDescription>
                      Moderators can configure bot settings, add/remove games, and manage notification channels. 
                      They cannot remove the guild owner or the bot from the guild.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label className="font-medium text-gray-300">Guild Owner</Label>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-discord-darker/40">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={guild.owner.avatar} alt={guild.owner.name} />
                      <AvatarFallback>{guild.owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{guild.owner.name}</span>
                  </div>
                </div>
                
                {!isReadOnly && (
                  <>
                    <div className="space-y-2">
                      <Label className="font-medium text-gray-300">Current Moderators</Label>
                      {guild.moderators?.map((mod, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-2 rounded-md bg-discord-darker/40"
                        >
                          <div className="flex items-center gap-2">
                            {mod.type === "user" ? (
                              <>
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={mod.avatar} alt={mod.name} />
                                  <AvatarFallback>{mod.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{mod.name}</span>
                              </>
                            ) : (
                              <>
                                <div 
                                  className="h-3 w-3 rounded-full mr-1" 
                                  style={{ backgroundColor: mod.color }}
                                ></div>
                                <span>{mod.name} (Role)</span>
                              </>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={mod.id === guild.owner.id}
                            className="text-gray-400 hover:text-white hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="font-medium text-gray-300">Add New Moderator</Label>
                      <div className="flex items-center gap-2">
                        <Select value={moderatorType} onValueChange={setModeratorType}>
                          <SelectTrigger className="w-[120px] bg-discord-darker border-discord-dark text-gray-200">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-discord-dark border-discord-darker text-gray-200">
                            <SelectItem value="user" className="focus:bg-discord-blurple/20 focus:text-white">User</SelectItem>
                            <SelectItem value="role" className="focus:bg-discord-blurple/20 focus:text-white">Role</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex-1">
                          <Select>
                            <SelectTrigger className="bg-discord-darker border-discord-dark text-gray-200">
                              <SelectValue placeholder={`Select a ${moderatorType}`} />
                            </SelectTrigger>
                            <SelectContent className="bg-discord-dark border-discord-darker text-gray-200">
                              {moderatorType === "user" ? (
                                <>
                                  <SelectItem value="u3" className="focus:bg-discord-blurple/20 focus:text-white">Alex Johnson</SelectItem>
                                  <SelectItem value="u4" className="focus:bg-discord-blurple/20 focus:text-white">Michael Williams</SelectItem>
                                </>
                              ) : (
                                guild.roles.map(role => (
                                  <SelectItem key={role.id} value={role.id} className="focus:bg-discord-blurple/20 focus:text-white">
                                    <div className="flex items-center gap-2">
                                      <div 
                                        className="h-3 w-3 rounded-full" 
                                        style={{ backgroundColor: role.color }}
                                      ></div>
                                      <span>{role.name}</span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="bg-discord-blurple hover:bg-discord-blurple/80 text-white">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default GuildDetail;
