import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoBackground } from '@/components/VideoBackground';
import { 
  Mic, 
  Sword, 
  Trophy, 
  Users, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  Crown
} from 'lucide-react';
import bgHero from '@/assets/bg-thumbnail.png';

const Index = () => {
  const isLoggedIn = localStorage.getItem('authToken');

  const videoUrl = '/Intro.mp4';
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Video Background */}
        <VideoBackground 
          videoSrc={videoUrl}
          thumbnailSrc={bgHero}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-background/10 backdrop-blur-sm">
              <span className="text-sm text-muted-foreground">Rap battles reimagined</span>
              <span className="text-sm font-semibold text-primary">TRY NOW</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-tight">
              Drop your bars.{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Battle the world.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The Battle App is the ultimate platform for rap battles. Upload your tracks, 
              challenge opponents, and let the community decide who wins.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" className="min-w-[200px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full">
                      Enter Arena
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/submit">
                    <Button size="lg" variant="outline" className="min-w-[200px] border-foreground/20 hover:bg-foreground/5 font-semibold rounded-full">
                      Submit Track
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="min-w-[200px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="min-w-[200px] border-foreground/20 hover:bg-foreground/5 font-semibold rounded-full">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 pt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">1,847</div>
                <div className="text-sm text-muted-foreground">Active MCs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">245</div>
                <div className="text-sm text-muted-foreground">Live Battles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">15.6K</div>
                <div className="text-sm text-muted-foreground">Votes Cast</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How the <span className="neon-text">Battle</span> Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A fair, transparent, and exciting platform for rap battles powered by community voting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="electric-border hover:battle-glow transition-all duration-300 animate-slide-up">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle>Submit Your Track</CardTitle>
                <CardDescription>
                  Choose from curated beats and upload your best bars
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• High-quality beats library</li>
                  <li>• Easy upload process</li>
                  <li>• Auto-pairing system</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="electric-border hover:battle-glow transition-all duration-300 animate-slide-up">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-cyber rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sword className="w-8 h-8 text-foreground" />
                </div>
                <CardTitle>Battle Head-to-Head</CardTitle>
                <CardDescription>
                  Get paired with another MC for epic battles
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Fair matchmaking</li>
                  <li>• 48-hour battle window</li>
                  <li>• Real-time vote tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="electric-border hover:battle-glow transition-all duration-300 animate-slide-up">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-fire rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-foreground" />
                </div>
                <CardTitle>Community Decides</CardTitle>
                <CardDescription>
                  Let the community vote for the winner
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Democratic voting</li>
                  <li>• Leaderboard rankings</li>
                  <li>• Achievement system</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Rappers Section */}
      <section className="py-16 lg:py-24 bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4 uppercase tracking-wider">
              <span className="text-destructive">Top</span>{' '}
              <span className="neon-text">Rappers</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              The MCs dominating the arena right now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative battle-glow border-4 border-yellow-400/70 bg-gradient-to-br from-card to-yellow-400/5">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-fire text-foreground px-4 py-2 text-sm font-black shadow-lg">
                  <Crown className="w-4 h-4 mr-1" />
                  #1 CHAMPION
                </Badge>
              </div>
              <CardHeader className="text-center pt-10">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-yellow-400/50 shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                  <span className="text-2xl font-black text-primary-foreground">CC</span>
                </div>
                <CardTitle className="text-2xl font-black text-yellow-400 neon-text uppercase tracking-wide">Cyber Cipher</CardTitle>
                <CardDescription className="text-base">Atlanta, GA</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-black text-primary mb-2">47</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Wins</div>
                <div className="mt-4 pt-4 border-t border-yellow-400/30">
                  <div className="text-xl font-bold text-battle-win">90.4%</div>
                  <div className="text-xs text-muted-foreground uppercase">Win Rate</div>
                </div>
              </CardContent>
            </Card>

            <Card className="electric-border border-3 border-gray-400/70 bg-gradient-to-br from-card to-gray-400/5">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="outline" className="border-gray-400 px-4 py-2 text-sm font-black">
                  #2
                </Badge>
              </div>
              <CardHeader className="text-center pt-10">
                <div className="w-20 h-20 bg-gradient-cyber rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-gray-400/50">
                  <span className="text-2xl font-black text-foreground">VV</span>
                </div>
                <CardTitle className="text-2xl font-black text-gray-300 uppercase tracking-wide">Verbal Venom</CardTitle>
                <CardDescription className="text-base">Detroit, MI</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-black text-secondary mb-2">43</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Wins</div>
                <div className="mt-4 pt-4 border-t border-gray-400/30">
                  <div className="text-xl font-bold text-battle-win">87.8%</div>
                  <div className="text-xs text-muted-foreground uppercase">Win Rate</div>
                </div>
              </CardContent>
            </Card>

            <Card className="electric-border border-3 border-orange-400/70 bg-gradient-to-br from-card to-orange-400/5">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="outline" className="border-orange-400 px-4 py-2 text-sm font-black">
                  #3
                </Badge>
              </div>
              <CardHeader className="text-center pt-10">
                <div className="w-20 h-20 bg-gradient-battle rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-orange-400/50">
                  <span className="text-2xl font-black text-primary-foreground">FP</span>
                </div>
                <CardTitle className="text-2xl font-black text-orange-400 uppercase tracking-wide">Flow Phantom</CardTitle>
                <CardDescription className="text-base">Brooklyn, NY</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-black text-accent mb-2">39</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Wins</div>
                <div className="mt-4 pt-4 border-t border-orange-400/30">
                  <div className="text-xl font-bold text-battle-win">84.8%</div>
                  <div className="text-xs text-muted-foreground uppercase">Win Rate</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="text-center bg-gradient-battle/10 electric-border max-w-4xl mx-auto">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl lg:text-4xl neon-text mb-4">
                Ready to Prove Your Skills?
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of MCs battling for glory in the ultimate rap arena
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Active Community</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Real-time Battles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Fair Rankings</span>
                </div>
              </div>
              
              {!isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button variant="fire" size="xl" className="min-w-[200px] animate-electric-pulse">
                      <Mic className="w-5 h-5 mr-2" />
                      Start Battling Now
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="xl" className="min-w-[200px]">
                      Already a Member?
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
