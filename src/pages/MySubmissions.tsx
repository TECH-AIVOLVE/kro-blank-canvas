import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from '@/components/AudioPlayer';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Music, Clock, Users, Trophy, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, SubmissionStatus } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

export const MySubmissions = () => {
  const [submissions, setSubmissions] = useState<SubmissionStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getMySubmissions();
      setSubmissions(data);
    } catch (error) {
      toast({
        title: 'Failed to load submissions',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string, paired: boolean) => {
    if (status === 'disqualified') {
      return <Badge variant="destructive">Disqualified</Badge>;
    }
    if (paired) {
      return <Badge variant="default" className="bg-gradient-primary">In Battle</Badge>;
    }
    return <Badge variant="secondary">Waiting for Pairing</Badge>;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your submissions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold neon-text">My Submissions</h1>
          <p className="text-xl text-muted-foreground">
            Track your submissions and battle performance
          </p>
        </div>

        {submissions.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent>
              <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No Submissions Yet</CardTitle>
              <CardDescription className="mb-6">
                Ready to showcase your skills? Submit your first track and enter the battle arena.
              </CardDescription>
              <Button variant="battle" size="lg" onClick={() => navigate('/submit')}>
                Submit Your First Track
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <Card key={submission.submission_id} className="electric-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center space-x-2">
                        <Music className="w-5 h-5 text-primary" />
                        <span>Submission #{submission.submission_id}</span>
                      </CardTitle>
                      <CardDescription>
                        Submitted on {new Date(submission.submission_id * 1000).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(submission.status, submission.paired)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AudioPlayer src={submission.beat_url} title="Your Submission" />

                  {submission.paired && submission.battle_id && (
                    <div className="p-4 bg-muted/20 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-semibold">
                            Battle vs {submission.opponent_mc}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/dashboard')}
                        >
                          View Battle
                        </Button>
                      </div>
                      {submission.status === 'active' && (
                        <CountdownTimer
                          endTime={new Date(Date.now() + 86400000).toISOString()}
                          className="justify-center"
                        />
                      )}
                    </div>
                  )}

                  {!submission.paired && !submission.disqualified && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Waiting for Opponent</p>
                        <p className="text-xs text-muted-foreground">
                          Your submission is in the queue and will be paired with another MC soon
                        </p>
                      </div>
                    </div>
                  )}

                  {submission.disqualified && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-destructive">Disqualified</p>
                        <p className="text-xs text-muted-foreground">
                          This submission was removed for violating community guidelines
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="text-center bg-gradient-battle/10 electric-border">
          <CardContent className="pt-6">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold neon-text mb-2">Ready for Another Round?</h3>
            <p className="text-muted-foreground mb-6">
              Submit a new track and continue climbing the leaderboard
            </p>
            <Button variant="fire" size="xl" onClick={() => navigate('/submit')}>
              Submit New Track
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
