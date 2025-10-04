import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Mic, 
  Music, 
  CheckCircle, 
  Clock,
  Volume2,
  Play,
  AlertCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';

// Mock available beats - you might want to add an API endpoint to fetch these
const availableBeats = [
  {
    id: 1,
    title: "Fire Trap Beat",
    bpm: 140,
    style: "Trap",
    duration: "3:42",
    url: "beat1.mp3"
  },
  {
    id: 2,
    title: "Boom Bap Classic",
    bpm: 95,
    style: "Boom Bap",
    duration: "4:15",
    url: "beat2.mp3"
  },
  {
    id: 3,
    title: "Dark Drill",
    bpm: 130,
    style: "Drill",
    duration: "3:28",
    url: "beat3.mp3"
  },
  {
    id: 4,
    title: "Melodic Waves",
    bpm: 120,
    style: "Melodic",
    duration: "3:55",
    url: "beat4.mp3"
  }
];

export const Submit = () => {
  const [selectedBeat, setSelectedBeat] = useState<number | null>(null);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentPlayingBeat, setCurrentPlayingBeat] = useState<number | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file (MP3, WAV, etc.)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 50MB",
          variant: "destructive"
        });
        return;
      }

      setSubmissionFile(file);
      if (!submissionTitle) {
        setSubmissionTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleBeatPlay = (beatId: number) => {
    if (currentPlayingBeat === beatId) {
      setCurrentPlayingBeat(null);
    } else {
      setCurrentPlayingBeat(beatId);
      toast({
        title: "Playing beat",
        description: availableBeats.find(b => b.id === beatId)?.title,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBeat) {
      toast({
        title: "Select a beat",
        description: "Please choose a beat for your submission",
        variant: "destructive"
      });
      return;
    }

    if (!submissionFile) {
      toast({
        title: "Upload required",
        description: "Please upload your rap recording",
        variant: "destructive"
      });
      return;
    }

    if (!submissionTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your submission",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // First, we'd need to upload the audio file to get a file_url
      // This is a simplified version - you'd need to implement file upload to your storage
      const fileUrl = `uploads/${submissionFile.name}`; // Mock file URL
      
      // Get current user info for submission
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (!userInfo.id) {
        throw new Error('User not authenticated');
      }

      await apiService.uploadSubmission(userInfo.id, {
        beat_id: selectedBeat,
        file_url: fileUrl,
        tournament_id: null // Optional tournament submission
      });
      
      setUploadProgress(100);
      
      // Clear form
      setSelectedBeat(null);
      setSubmissionFile(null);
      setSubmissionTitle('');
      setSubmissionNotes('');
      
      toast({
        title: "Submission successful!",
        description: "Your track has been submitted and will be paired for battle soon.",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.';
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      clearInterval(progressInterval);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold neon-text">
            Submit Your Track
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose a beat, record your bars, and enter the battle arena
          </p>
        </div>

        {/* Submission Guidelines */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Submission Guidelines:</strong> Your track should be 2-4 minutes long, high quality audio (WAV/MP3), 
            and contain original lyrics. Inappropriate content will be removed and may result in account suspension.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Beat Selection */}
          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Music className="w-5 h-5 text-primary" />
                <span>Choose Your Beat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableBeats.map((beat) => (
                  <div
                    key={beat.id}
                    className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                      selectedBeat === beat.id
                        ? 'border-primary bg-primary/10 battle-glow'
                        : 'border-muted hover:border-primary/50 hover:bg-muted/20'
                    }`}
                    onClick={() => setSelectedBeat(beat.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{beat.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>{beat.bpm} BPM</span>
                          <span>{beat.style}</span>
                          <span>{beat.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBeatPlay(beat.id);
                          }}
                          className="text-primary hover:text-primary-glow"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        {selectedBeat === beat.id && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                    {currentPlayingBeat === beat.id && (
                      <Badge variant="secondary" className="mt-2">
                        <Volume2 className="w-3 h-3 mr-1" />
                        Playing
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="electric-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-secondary" />
                <span>Upload Your Recording</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <div>
                      <p className="text-lg font-semibold">Drop your audio file here</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supports MP3, WAV, M4A (Max 50MB)
                    </p>
                  </label>
                </div>

                {submissionFile && (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-battle-win" />
                      <div>
                        <p className="font-semibold">{submissionFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(submissionFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSubmissionFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submission Details */}
          <Card className="electric-border">
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Track Title *</Label>
                <Input
                  id="title"
                  value={submissionTitle}
                  onChange={(e) => setSubmissionTitle(e.target.value)}
                  placeholder="Enter a title for your track"
                  required
                  className="electric-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Any additional notes about your submission..."
                  className="electric-border"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {isUploading && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary animate-spin" />
                    <span className="font-semibold">Uploading your submission...</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress < 100 ? `${uploadProgress.toFixed(0)}% uploaded` : 'Processing...'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              variant="fire"
              size="xl"
              disabled={isUploading || !selectedBeat || !submissionFile}
              className="min-w-[200px]"
            >
              {isUploading ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Submit to Battle
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Battle Process Info */}
        <Card className="bg-gradient-cyber/10 border-secondary/20">
          <CardHeader>
            <CardTitle className="text-center">What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 text-primary-foreground" />
                </div>
                <h4 className="font-semibold">1. Submit</h4>
                <p className="text-sm text-muted-foreground">
                  Your track is uploaded and queued for pairing
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto">
                  <Mic className="w-6 h-6 text-foreground" />
                </div>
                <h4 className="font-semibold">2. Battle</h4>
                <p className="text-sm text-muted-foreground">
                  You're paired with another MC for a head-to-head battle
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 text-foreground" />
                </div>
                <h4 className="font-semibold">3. Vote</h4>
                <p className="text-sm text-muted-foreground">
                  The community votes for the winner over 48 hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};