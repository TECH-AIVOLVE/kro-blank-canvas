import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mcName, setMcName] = useState('');
  const [hometown, setHometown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.register({
        email,
        password,
        mc_name: mcName,
        hometown: hometown || undefined,
      });
      
      // Store both token and user info
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      
      toast({
        title: "Welcome to RhymeRivals!",
        description: `Successfully registered as ${response.user.mc_name}`,
      });
      
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md electric-border animate-slide-up">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
            <Mic className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold neon-text">Join the Battle</CardTitle>
          <CardDescription>
            Create your MC identity and enter the arena
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mc@rhymerivals.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="electric-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mcName">MC Name</Label>
              <Input
                id="mcName"
                type="text"
                placeholder="Your battle name"
                value={mcName}
                onChange={(e) => setMcName(e.target.value)}
                required
                className="electric-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hometown">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Hometown (Optional)</span>
                </div>
              </Label>
              <Input
                id="hometown"
                type="text"
                placeholder="Where you rep"
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
                className="electric-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your secret bars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="electric-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your secret bars"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="electric-border"
              />
            </div>
            
            <Button
              type="submit"
              variant="battle"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating MC...' : 'Create MC Identity'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an MC?{' '}
            <Link to="/login" className="text-primary hover:text-primary-glow underline">
              Enter the battle
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};