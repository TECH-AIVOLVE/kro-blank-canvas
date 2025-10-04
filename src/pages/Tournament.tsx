import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar } from 'lucide-react';

interface TournamentMatch {
  id: string;
  participant1?: string;
  participant2?: string;
  winner?: string;
  round: number;
}

const generateBracket = (): TournamentMatch[] => {
  const participants = [
    'Cyber Cipher', 'Verbal Venom', 'Flow Phantom', 'Beat Boxer',
    'Rhyme Rebel', 'Lyric Legend', 'Mic Master', 'Sound Slayer',
    'Word Wizard', 'Beat Baron', 'Rhyme Ranger', 'Flow Fighter',
    'Verse Viper', 'Rhythm Raider', 'Lyric Lion', 'Mic Magician'
  ];

  const bracket: TournamentMatch[] = [];
  
  // Round 1 - 8 matches
  for (let i = 0; i < 8; i++) {
    bracket.push({
      id: `r1-${i}`,
      participant1: participants[i * 2],
      participant2: participants[i * 2 + 1],
      winner: i < 4 ? participants[i * 2] : undefined,
      round: 1
    });
  }
  
  // Round 2 - 4 matches
  for (let i = 0; i < 4; i++) {
    bracket.push({
      id: `r2-${i}`,
      participant1: i < 2 ? bracket[i * 2]?.winner : undefined,
      participant2: i < 2 ? bracket[i * 2 + 1]?.winner : undefined,
      winner: i < 2 ? bracket[i * 2]?.winner : undefined,
      round: 2
    });
  }
  
  // Round 3 - 2 matches (Semi-finals)
  bracket.push({
    id: 'r3-0',
    participant1: bracket[8]?.winner,
    participant2: bracket[9]?.winner,
    winner: bracket[8]?.winner,
    round: 3
  });
  bracket.push({
    id: 'r3-1',
    participant1: undefined,
    participant2: undefined,
    round: 3
  });
  
  // Finals
  bracket.push({
    id: 'final',
    participant1: bracket[14]?.winner,
    participant2: undefined,
    round: 4
  });

  return bracket;
};

export const Tournament = () => {
  const [bracket] = useState<TournamentMatch[]>(generateBracket());
  
  const getRoundMatches = (round: number) => {
    return bracket.filter(m => m.round === round);
  };

  const MatchCard = ({ match }: { match: TournamentMatch }) => (
    <div className="bg-card/60 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-3 space-y-2 hover:border-primary/60 transition-all">
      <div className={`p-2 rounded ${match.winner === match.participant1 ? 'bg-battle-win/20 border border-battle-win/50' : 'bg-muted/30'}`}>
        <span className="text-sm font-medium">{match.participant1 || 'TBD'}</span>
      </div>
      <div className="text-center text-xs text-accent font-bold">VS</div>
      <div className={`p-2 rounded ${match.winner === match.participant2 ? 'bg-battle-win/20 border border-battle-win/50' : 'bg-muted/30'}`}>
        <span className="text-sm font-medium">{match.participant2 || 'TBD'}</span>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold neon-text uppercase tracking-wider">
            TOURNAMENT
          </h1>
          <p className="text-xl text-muted-foreground">
            16 MCs battle for ultimate supremacy
          </p>
          <div className="flex justify-center gap-6 pt-4">
            <Badge variant="outline" className="text-base px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              March 2025
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              16 Participants
            </Badge>
            <Badge variant="default" className="text-base px-4 py-2 bg-gradient-primary">
              <Trophy className="w-4 h-4 mr-2" />
              Live Now
            </Badge>
          </div>
        </div>

        {/* Tournament Info */}
        <Card className="electric-border bg-card/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Championship Bracket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Round 1 */}
              <div className="space-y-4">
                <h3 className="text-center font-bold text-destructive uppercase tracking-wide mb-4 pb-2 border-b-2 border-destructive/50">
                  Round 1
                </h3>
                {getRoundMatches(1).map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>

              {/* Round 2 */}
              <div className="space-y-4">
                <h3 className="text-center font-bold text-accent uppercase tracking-wide mb-4 pb-2 border-b-2 border-accent/50">
                  Round 2
                </h3>
                <div className="pt-12 space-y-8">
                  {getRoundMatches(2).map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>

              {/* Semi-Finals */}
              <div className="space-y-4">
                <h3 className="text-center font-bold text-secondary uppercase tracking-wide mb-4 pb-2 border-b-2 border-secondary/50">
                  Semi-Finals
                </h3>
                <div className="pt-24 space-y-12">
                  {getRoundMatches(3).map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>

              {/* Finals */}
              <div className="space-y-4">
                <h3 className="text-center font-bold text-primary uppercase tracking-wide mb-4 pb-2 border-b-2 border-primary/50">
                  Finals
                </h3>
                <div className="pt-40">
                  {getRoundMatches(4).map(match => (
                    <div key={match.id} className="bg-gradient-primary border-4 border-primary-glow rounded-lg p-4 space-y-3 animate-electric-pulse">
                      <div className="text-center mb-2">
                        <Trophy className="w-8 h-8 text-primary-foreground mx-auto" />
                      </div>
                      <div className="bg-card/80 p-3 rounded">
                        <span className="text-sm font-bold">{match.participant1 || 'TBD'}</span>
                      </div>
                      <div className="text-center text-sm text-primary-foreground font-black">VS</div>
                      <div className="bg-card/80 p-3 rounded">
                        <span className="text-sm font-bold">{match.participant2 || 'TBD'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="text-center bg-gradient-battle/10 electric-border">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold neon-text mb-4">Want to compete?</h3>
            <p className="text-muted-foreground mb-6">
              Register for the next tournament and battle your way to the top
            </p>
            <Button variant="battle" size="xl">
              <Trophy className="w-5 h-5 mr-2" />
              Register for Next Tournament
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};