import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { BattleCard } from '@/components/battles/BattleCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sword, Trophy, Mic, TrendingUp, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, Battle } from '@/lib/api';

export const Dashboard = () => {
  const [activeBattles, setActiveBattles] = useState<Battle[]>([]);
  const [finishedBattles, setFinishedBattles] = useState<Battle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBattles: 0,
    activeBattles: 0,
    totalMCs: 0,
    totalVotes: 0
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }
    
    // Guest mode always returns true
    if (token === 'guest') {
      return true;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/battles/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.status !== 401;
    } catch (error) {
      return false;
    }
  };

  const loadBattles = async () => {
  try {
    setIsLoading(true);
    
    const token = localStorage.getItem('authToken');
    
    // Guest mode: provide mock data
    if (token === 'guest') {
      const mockActiveBattles: Battle[] = [
        {
          id: 1,
          mc_a: "Cyber Cipher",
          mc_b: "Verbal Venom",
          beat_url: "https://example.com/beat1.mp3",
          ends_at: "2025-10-15T12:00:00Z",
          status: "active",
          submission_a_votes: 127,
          submission_b_votes: 98,
          has_voted: false
        },
        {
          id: 2,
          mc_a: "Flow Phantom",
          mc_b: "Rhyme Rebel",
          beat_url: "https://example.com/beat2.mp3",
          ends_at: "2025-10-16T12:00:00Z",
          status: "active",
          submission_a_votes: 156,
          submission_b_votes: 143,
          has_voted: false
        }
      ];
      
      const mockFinishedBattles: Battle[] = [
        {
          id: 3,
          mc_a: "Beat Boxer",
          mc_b: "Lyric Legend",
          beat_url: "https://example.com/beat3.mp3",
          ends_at: "2025-10-10T12:00:00Z",
          status: "finished",
          submission_a_votes: 203,
          submission_b_votes: 187,
          winner: "Beat Boxer"
        }
      ];
      
      setActiveBattles(mockActiveBattles);
      setFinishedBattles(mockFinishedBattles);
      setStats({
        totalBattles: 245,
        activeBattles: mockActiveBattles.length,
        totalMCs: 1847,
        totalVotes: 15600
      });
      setIsLoading(false);
      return;
    }
    
    // Check authentication for real users
    const isAuthenticated = await checkAuth();
    
    if (!isAuthenticated) {
      toast({
        title: "Session expired",
        description: "Please log in again",
        variant: "destructive"
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      navigate('/login');
      return;
    }

    const [active, finished] = await Promise.all([
      apiService.getActiveBattles(),
      apiService.getFinishedBattles()
    ]);
    
    setActiveBattles(active);
    setFinishedBattles(finished);
    
    // Update stats based on loaded data
    setStats(prev => ({
      ...prev,
      activeBattles: active.length,
      totalBattles: active.length + finished.length
    }));
    
  } catch (error) {
    console.error('Error loading battles:', error);
    
    // Handle authentication errors
    if (error instanceof Error && (
      error.message.includes('401') || 
      error.message.includes('Unauthorized') ||
      error.message.includes('Not authenticated')
    )) {
      toast({
        title: "Session expired",
        description: "Please log in again",
        variant: "destructive"
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      navigate('/login');
      return;
    }
    
    toast({
      title: "Failed to load battles",
      description: error instanceof Error ? error.message : "Please try again later",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleVote = async (battleId: number, submissionId: number) => {
    const token = localStorage.getItem('authToken');
    
    // Guest mode: show message that they need to log in
    if (token === 'guest') {
      toast({
        title: "Login required",
        description: "Please create an account or login to vote on battles",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await apiService.vote(battleId, submissionId);
      
      // Update the battle with the vote locally
      setActiveBattles(prev => 
        prev.map(battle => 
          battle.id === battleId 
            ? { ...battle, has_voted: true }
            : battle
        )
      );

      toast({
        title: "Vote cast!",
        description: "Your vote has been recorded successfully",
      });
      
      // Reload battles to get updated vote counts
      loadBattles();
    } catch (error) {
      console.error('Vote error:', error);
      
      // Handle authentication errors during voting
      if (error instanceof Error && (
        error.message.includes('401') || 
        error.message.includes('Unauthorized') ||
        error.message.includes('Not authenticated')
      )) {
        toast({
          title: "Session expired",
          description: "Please log in again to vote",
          variant: "destructive"
        });
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        navigate('/login');
        return;
      }
      
      toast({
        title: "Vote failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadBattles();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold neon-text">
            Battle Arena
          </h1>
          <p className="text-xl text-muted-foreground">
            Where MCs clash and legends are born
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="electric-border hover:battle-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Battles</CardTitle>
              <Sword className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.activeBattles}</div>
              <p className="text-xs text-muted-foreground">
                Live battles right now
              </p>
            </CardContent>
          </Card>

          <Card className="electric-border hover:battle-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Battles</CardTitle>
              <Trophy className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.totalBattles}</div>
              <p className="text-xs text-muted-foreground">
                All-time battles fought
              </p>
            </CardContent>
          </Card>

          <Card className="electric-border hover:battle-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total MCs</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats.totalMCs}</div>
              <p className="text-xs text-muted-foreground">
                Registered MCs
              </p>
            </CardContent>
          </Card>

          <Card className="electric-border hover:battle-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <TrendingUp className="h-4 w-4 text-battle-win" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-battle-win">{stats.totalVotes}</div>
              <p className="text-xs text-muted-foreground">
                Community engagement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading battles...</p>
          </div>
        )}

        {/* Battle Tabs - Only show when not loading */}
        {!isLoading && (
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto">
              <TabsTrigger value="active" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Active Battles</span>
                <Badge variant="secondary" className="ml-2">
                  {activeBattles.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="finished" className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Finished</span>
                <Badge variant="outline" className="ml-2">
                  {finishedBattles.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Live Battles</h2>
                <p className="text-muted-foreground mb-6">
                  Vote for your favorite MCs and help decide the winners
                </p>
              </div>

              {activeBattles.length === 0 ? (
                <Card className="text-center p-8">
                  <CardContent>
                    <Sword className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="mb-2">No Active Battles</CardTitle>
                    <CardDescription>
                      Check back later for new battles to vote on!
                    </CardDescription>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeBattles.map((battle) => (
                    <BattleCard 
                      key={battle.id} 
                      battle={battle} 
                      onVote={handleVote}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="finished" className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Battle History</h2>
                <p className="text-muted-foreground mb-6">
                  Review past battles and their results
                </p>
              </div>

              {finishedBattles.length === 0 ? (
                <Card className="text-center p-8">
                  <CardContent>
                    <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="mb-2">No Finished Battles</CardTitle>
                    <CardDescription>
                      No battles have been completed yet
                    </CardDescription>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {finishedBattles.map((battle) => (
                    <BattleCard 
                      key={battle.id} 
                      battle={battle}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Call to Action */}
        <Card className="text-center bg-gradient-battle/10 electric-border">
          <CardHeader>
            <CardTitle className="text-2xl neon-text">Ready to Battle?</CardTitle>
            <CardDescription className="text-lg">
              Submit your own track and challenge other MCs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="fire" size="xl" className="animate-electric-pulse">
              <Mic className="w-5 h-5 mr-2" />
              Submit Your Track
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};