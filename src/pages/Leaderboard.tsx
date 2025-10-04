import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp, Crown, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, LeaderboardEntry } from '@/lib/api';

interface ExtendedLeaderboardEntry extends LeaderboardEntry {
  total_battles?: number;
  win_rate?: number;
  hometown?: string;
  rank: number;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-400" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-orange-400" />;
    default:
      return <Trophy className="w-5 h-5 text-muted-foreground" />;
  }
};

const getRankBadge = (rank: number) => {
  if (rank <= 3) {
    return (
      <Badge variant="default" className={`${
        rank === 1 ? 'bg-gradient-fire' : 
        rank === 2 ? 'bg-gradient-cyber' : 
        'bg-gradient-primary'
      } text-foreground font-bold`}>
        #{rank}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="font-semibold">
      #{rank}
    </Badge>
  );
};

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<ExtendedLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const currentUserRank = leaderboard.find(mc => mc.mc_name === currentUser.mc_name);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getLeaderboard();
      
      // Add rank and calculate additional stats
      const extendedData: ExtendedLeaderboardEntry[] = data.map((entry, index) => ({
        ...entry,
        rank: index + 1,
        // These might need to come from additional API calls or be included in the leaderboard response
        total_battles: entry.total_wins + Math.floor(entry.total_wins * 0.3), // Estimate
        win_rate: entry.total_wins > 0 ? (entry.total_wins / (entry.total_wins + Math.floor(entry.total_wins * 0.3))) * 100 : 0,
        hometown: "Unknown" // Would need to come from user profile data
      }));
      
      setLeaderboard(extendedData);
    } catch (error) {
      toast({
        title: "Failed to load leaderboard",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold neon-text">
            Hall of Fame
          </h1>
          <p className="text-xl text-muted-foreground">
            The legendary MCs who dominate the battle arena
          </p>
        </div>

        {/* Top 3 Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaderboard.slice(0, 3).map((mc, index) => (
            <Card key={mc.user_id} className={`relative overflow-hidden ${
              index === 0 ? 'battle-glow animate-electric-pulse border-yellow-400/50' :
              index === 1 ? 'electric-border border-gray-400/50' :
              'electric-border border-orange-400/50'
            }`}>
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  {getRankIcon(mc.rank)}
                </div>
                <CardTitle className={`text-xl ${
                  index === 0 ? 'text-yellow-400 neon-text' :
                  index === 1 ? 'text-gray-400' :
                  'text-orange-400'
                }`}>
                  {mc.mc_name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{mc.hometown}</p>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">{mc.total_wins}</div>
                <p className="text-sm text-muted-foreground">Wins</p>
                <div className="flex justify-center space-x-4 text-xs">
                  <span>{mc.total_battles} battles</span>
                  <span className="text-battle-win">{mc.win_rate?.toFixed(1)}% win rate</span>
                </div>
                {index === 0 && (
                  <Badge className="bg-gradient-fire text-foreground mt-2">
                    <Zap className="w-3 h-3 mr-1" />
                    Champion
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card className="electric-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Complete Rankings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((mc) => (
                <div 
                  key={mc.user_id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                    mc.mc_name === currentUser.mc_name 
                      ? 'bg-primary/10 border border-primary/30 battle-glow' 
                      : 'bg-muted/20 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRankBadge(mc.rank)}
                      {mc.rank <= 3 && getRankIcon(mc.rank)}
                    </div>
                    
                    <Avatar className="w-12 h-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
                        {mc.mc_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className={`font-semibold ${
                        mc.mc_name === currentUser.mc_name ? 'text-primary neon-text' : ''
                      }`}>
                        {mc.mc_name}
                        {mc.mc_name === currentUser.mc_name && (
                          <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{mc.hometown}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-right">
                    <div>
                      <div className="text-lg font-bold text-primary">{mc.total_wins}</div>
                      <div className="text-xs text-muted-foreground">Wins</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{mc.total_battles}</div>
                      <div className="text-xs text-muted-foreground">Battles</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${
                        (mc.win_rate || 0) >= 80 ? 'text-battle-win' :
                        (mc.win_rate || 0) >= 60 ? 'text-accent' :
                        'text-muted-foreground'
                      }`}>
                        {mc.win_rate?.toFixed(1) || 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Stats (if not in top rankings) */}
        {!currentUserRank && currentUser.mc_name && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Your Current Standing</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Avatar className="w-16 h-16 mx-auto border-2 border-primary">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-lg">
                  {currentUser.mc_name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-primary neon-text">{currentUser.mc_name}</h3>
                <p className="text-muted-foreground">{currentUser.hometown}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Battles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-muted-foreground">--</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>
              </div>
              <Button variant="battle" size="lg" className="mt-4">
                <Trophy className="w-4 h-4 mr-2" />
                Enter Your First Battle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};