import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Edit } from 'lucide-react';

interface EditProfileDialogProps {
  currentMcName: string;
  currentHometown?: string;
  onUpdate: (mcName: string, hometown: string) => Promise<void>;
}

export const EditProfileDialog = ({ currentMcName, currentHometown, onUpdate }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [mcName, setMcName] = useState(currentMcName);
  const [hometown, setHometown] = useState(currentHometown || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mcName.trim()) {
      toast({
        title: 'MC Name required',
        description: 'Please enter your MC name',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(mcName, hometown);
      setOpen(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="electric" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your MC name and location information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mcName">MC Name</Label>
            <Input
              id="mcName"
              value={mcName}
              onChange={(e) => setMcName(e.target.value)}
              placeholder="Enter your MC name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hometown">Hometown</Label>
            <Input
              id="hometown"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              placeholder="Enter your hometown"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
