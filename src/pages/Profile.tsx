import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Trophy, 
  Sword, 
  TrendingUp, 
  Calendar,
  Play,
  Pause,
  Volume2,
  Edit,
  Loader2
} from 'lucide-react';
// Types for user data
interface UserType {
  id: string;
  mc_name: string;
  email: string;
  hometown?: string;
  is_active: boolean;
}

// Types for user statistics
interface UserStats {
  total_battles: number;
  wins: number;
  losses: number;
  draws: number;
}

// Mock API service
const apiService = {
  getCurrentUser: async (userId: string): Promise<UserType> => {
    // TODO: Implement actual API call
    return Promise.resolve({} as UserType);
  },
  getUserStats: async (userId: string): Promise<UserStats> => {
    // TODO: Implement actual API call
    return Promise.resolve({} as UserStats);
  }
};
import { useToast } from '@/components/ui/use-toast';

export const Profile = () => {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

// In Profile.tsx, modify the fetchUserData function
const fetchUserData = async () => {
  try {
    setIsLoading(true);
    
    // Get user info from localStorage
    const userInfoStr = localStorage.getItem('userInfo');
    
    if (!userInfoStr) {
      toast({
        title: "Error",
        description: "Please log in again",
        variant: "destructive"
      });
      return;
    }

    const userInfo = JSON.parse(userInfoStr);
    
    // Use the stored user info directly
    setUserData(userInfo);
    
    // Only fetch stats from API
    const statsResponse = await apiService.getUserStats(userInfo.id);
    setUserStats(statsResponse);

  } catch (error) {
    console.error('Error fetching user data:', error);
    toast({
      title: "Error",
      description: "Failed to load profile data",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};

  const handlePlayTrack = (trackId: number) => {
    if (currentTrack === trackId && isPlaying) {
      setIsPlaying(false);
      setCurrentTrack(null);
    } else {
      setIsPlaying(true);
      setCurrentTrack(trackId);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p>Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!userData || !userStats) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground">Unable to load user profile. Please try again.</p>
          <Button 
            onClick={fetchUserData} 
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  // Calculate stats
  const totalBattles = userStats.total_battles;
  const wins = userStats.wins;
  const losses = userStats.losses;
  const draws = userStats.draws;
  const winRate = totalBattles > 0 ? ((wins / totalBattles) * 100).toFixed(1) : '0.0';
  const nextLevelProgress = ((wins % 5) / 5) * 100;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Profile Header */}
        <Card className="relative overflow-hidden battle-glow">
          <div className="absolute inset-0 bg-gradient-battle/10" />
          <CardContent className="relative p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <Avatar className="w-24 h-24 border-4 border-primary">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-2xl">
                  {userData.mc_name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-3xl font-bold neon-text">{userData.mc_name}</h1>
                  <div className="flex items-center justify-center md:justify-start space-x-2 mt-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{userData.hometown || 'Unknown location'}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <Calendar className="w-4 h-4" />
                    <span>User ID: {userData.id}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground max-w-2xl">
                  {userData.email}
                </p>
                
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <Button variant="electric" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Badge variant="default" className="bg-gradient-primary">
                    Level {Math.floor(wins / 5) + 1}
                  </Badge>
                  <Badge variant={userData.is_active ? "default" : "secondary"}>
                    {userData.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center electric-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{totalBattles}</div>
              <p className="text-sm text-muted-foreground">Total Battles</p>
            </CardContent>
          </Card>
          <Card className="text-center electric-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-battle-win">{wins}</div>
              <p className="text-sm text-muted-foreground">Victories</p>
            </CardContent>
          </Card>
          <Card className="text-center electric-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-accent">{winRate}%</div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
            </CardContent>
          </Card>
          <Card className="text-center electric-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-secondary">{losses}</div>
              <p className="text-sm text-muted-foreground">Losses</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Progress to Next Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level {Math.floor(wins / 5) + 1}</span>
                <span>{wins % 5}/5 wins</span>
              </div>
              <Progress value={nextLevelProgress} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {5 - (wins % 5)} more wins to reach Level {Math.floor(wins / 5) + 2}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-accent" />
              <span>Battle Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-battle-win">{wins}</div>
                <p className="text-sm text-muted-foreground">Wins</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-destructive">{losses}</div>
                <p className="text-sm text-muted-foreground">Losses</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{draws}</div>
                <p className="text-sm text-muted-foreground">Draws</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalBattles}</div>
                <p className="text-sm text-muted-foreground">Total Battles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};