import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { apiService, AdminAuditEntry, AdminActionStats, AdminUser } from '@/lib/api';
import { Shield, UserCog, Trash2, Upload, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [recentActions, setRecentActions] = useState<AdminAuditEntry[]>([]);
  const [stats, setStats] = useState<AdminActionStats | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  
  // Form states
  const [submissionIdToDelete, setSubmissionIdToDelete] = useState('');
  const [userIdToPromote, setUserIdToPromote] = useState('');
  const [userIdToDemote, setUserIdToDemote] = useState('');
  const [userIdToCheck, setUserIdToCheck] = useState('');
  const [userIdForHistory, setUserIdForHistory] = useState('');
  const [beatTitle, setBeatTitle] = useState('');
  const [beatFileUrl, setBeatFileUrl] = useState('');
  const [userHistory, setUserHistory] = useState<AdminAuditEntry[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    setLoading(true);
    try {
      const userIdStr = localStorage.getItem('userId');
      if (!userIdStr) {
        navigate('/dashboard');
        return;
      }

      const userId = parseInt(userIdStr);
      const { is_admin } = await apiService.checkUserAdminStatus(userId);
      
      if (!is_admin) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);
      await loadAdminData();
    } catch (error: any) {
      toast({
        title: 'Error verifying admin access',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const [actionsData, statsData, adminsData] = await Promise.all([
        apiService.getRecentAdminActions(20),
        apiService.getAdminActionStats(),
        apiService.getAllAdminUsers(),
      ]);
      setRecentActions(actionsData);
      setStats(statsData);
      setAdminUsers(adminsData);
    } catch (error: any) {
      toast({
        title: 'Error loading admin data',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSubmission = async () => {
    if (!submissionIdToDelete) return;
    
    setLoading(true);
    try {
      await apiService.removeSubmission(parseInt(submissionIdToDelete));
      toast({
        title: 'Success',
        description: 'Submission deleted successfully',
      });
      setSubmissionIdToDelete('');
      loadAdminData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async () => {
    if (!userIdToPromote) return;
    
    setLoading(true);
    try {
      await apiService.promoteUserToAdmin(parseInt(userIdToPromote));
      toast({
        title: 'Success',
        description: 'User promoted to admin successfully',
      });
      setUserIdToPromote('');
      loadAdminData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoteUser = async () => {
    if (!userIdToDemote) return;
    
    setLoading(true);
    try {
      await apiService.demoteAdminUser(parseInt(userIdToDemote));
      toast({
        title: 'Success',
        description: 'Admin demoted successfully',
      });
      setUserIdToDemote('');
      loadAdminData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAdminStatus = async () => {
    if (!userIdToCheck) return;
    
    setLoading(true);
    try {
      const result = await apiService.checkUserAdminStatus(parseInt(userIdToCheck));
      toast({
        title: 'Admin Status',
        description: result.is_admin ? 'User is an admin' : 'User is not an admin',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetUserHistory = async () => {
    if (!userIdForHistory) return;
    
    setLoading(true);
    try {
      const history = await apiService.getUserAuditHistory(parseInt(userIdForHistory));
      setUserHistory(history);
      toast({
        title: 'Success',
        description: `Loaded ${history.length} audit entries`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadBeat = async () => {
    if (!beatTitle || !beatFileUrl) return;
    
    setLoading(true);
    try {
      await apiService.uploadBeatAdmin({ title: beatTitle, file_url: beatFileUrl });
      toast({
        title: 'Success',
        description: 'Beat uploaded successfully',
      });
      setBeatTitle('');
      setBeatFileUrl('');
      loadAdminData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || isAdmin === null) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Verifying admin access...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Alert className="border-primary/50 bg-primary/5">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You are viewing the admin control panel. All actions are logged and monitored.
          </AlertDescription>
        </Alert>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold neon-text">Admin Control Panel</h1>
            <p className="text-muted-foreground">Manage users, content, and monitor activity</p>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="electric-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.total_actions}</div>
              </CardContent>
            </Card>
            <Card className="electric-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Promotions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{stats.promotions}</div>
              </CardContent>
            </Card>
            <Card className="electric-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Demotions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{stats.demotions}</div>
              </CardContent>
            </Card>
            <Card className="electric-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Deletions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.deletions}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Actions */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">
              <UserCog className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content">
              <Trash2 className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="beats">
              <Upload className="w-4 h-4 mr-2" />
              Beats
            </TabsTrigger>
            <TabsTrigger value="audit">
              <Clock className="w-4 h-4 mr-2" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Promote User</CardTitle>
                  <CardDescription>Grant admin privileges to a user</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="promote-user">User ID</Label>
                    <Input
                      id="promote-user"
                      type="number"
                      placeholder="Enter user ID"
                      value={userIdToPromote}
                      onChange={(e) => setUserIdToPromote(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handlePromoteUser} 
                    disabled={loading || !userIdToPromote}
                    className="w-full"
                    variant="battle"
                  >
                    Promote to Admin
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demote Admin</CardTitle>
                  <CardDescription>Remove admin privileges from a user</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="demote-user">User ID</Label>
                    <Input
                      id="demote-user"
                      type="number"
                      placeholder="Enter user ID"
                      value={userIdToDemote}
                      onChange={(e) => setUserIdToDemote(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleDemoteUser} 
                    disabled={loading || !userIdToDemote}
                    className="w-full"
                    variant="destructive"
                  >
                    Demote User
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Check Admin Status</CardTitle>
                  <CardDescription>Verify if a user has admin privileges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="check-user">User ID</Label>
                    <Input
                      id="check-user"
                      type="number"
                      placeholder="Enter user ID"
                      value={userIdToCheck}
                      onChange={(e) => setUserIdToCheck(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleCheckAdminStatus} 
                    disabled={loading || !userIdToCheck}
                    className="w-full"
                  >
                    Check Status
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Audit History</CardTitle>
                  <CardDescription>View all actions related to a user</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="history-user">User ID</Label>
                    <Input
                      id="history-user"
                      type="number"
                      placeholder="Enter user ID"
                      value={userIdForHistory}
                      onChange={(e) => setUserIdForHistory(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleGetUserHistory} 
                    disabled={loading || !userIdForHistory}
                    className="w-full"
                  >
                    Get History
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Current Admins */}
            <Card>
              <CardHeader>
                <CardTitle>Current Admin Users</CardTitle>
                <CardDescription>All users with admin privileges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {adminUsers.length > 0 ? (
                    adminUsers.map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">{admin.mc_name}</p>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                        <Badge variant="outline" className="border-primary text-primary">
                          Admin
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No admin users found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User History Results */}
            {userHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>User History Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userHistory.map((entry) => (
                      <div key={entry.id} className="p-3 border border-border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{entry.action}</p>
                            <p className="text-sm text-muted-foreground">
                              by {entry.admin_name} • {new Date(entry.created_at).toLocaleString()}
                            </p>
                            {entry.details && (
                              <p className="text-sm mt-1">{entry.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Content Management */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Delete Submission</CardTitle>
                <CardDescription>Permanently remove a submission from the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="submission-id">Submission ID</Label>
                  <Input
                    id="submission-id"
                    type="number"
                    placeholder="Enter submission ID"
                    value={submissionIdToDelete}
                    onChange={(e) => setSubmissionIdToDelete(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleDeleteSubmission} 
                  disabled={loading || !submissionIdToDelete}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Submission
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Beat Upload */}
          <TabsContent value="beats">
            <Card>
              <CardHeader>
                <CardTitle>Upload Beat</CardTitle>
                <CardDescription>Add a new beat to the platform (Admin only)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="beat-title">Beat Title</Label>
                  <Input
                    id="beat-title"
                    type="text"
                    placeholder="Enter beat title"
                    value={beatTitle}
                    onChange={(e) => setBeatTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beat-url">Beat File URL</Label>
                  <Input
                    id="beat-url"
                    type="text"
                    placeholder="Enter beat file URL"
                    value={beatFileUrl}
                    onChange={(e) => setBeatFileUrl(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleUploadBeat} 
                  disabled={loading || !beatTitle || !beatFileUrl}
                  variant="battle"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Beat
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Log */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Recent Admin Actions</CardTitle>
                <CardDescription>Latest 20 administrative actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentActions.length > 0 ? (
                    recentActions.map((action) => (
                      <div key={action.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{action.action}</Badge>
                              <span className="text-sm font-medium">{action.admin_name}</span>
                            </div>
                            {action.target_user_name && (
                              <p className="text-sm text-muted-foreground">
                                Target: {action.target_user_name}
                              </p>
                            )}
                            {action.details && (
                              <p className="text-sm">{action.details}</p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(action.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No recent actions</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}