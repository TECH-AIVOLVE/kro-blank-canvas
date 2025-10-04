// API service for RhymeRivals backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types based on your API specification
export interface User {
  id: number;
  email: string;
  mc_name: string;
  hometown: string | null;
  is_active: boolean;
}

export interface UserStats {
  total_battles: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface Battle {
  id: number;
  mc_a: string;
  mc_b: string;
  beat_url: string;
  ends_at: string;
  winner?: string;
  submission_a_votes: number;
  submission_b_votes: number;
  status: 'active' | 'finished';
  has_voted?: boolean;
}

export interface BattleDetail {
  id: number;
  beat_url: string;
  submission_a_url: string;
  submission_b_url: string;
  submission_a_votes: number;
  submission_b_votes: number;
  mc_a: string;
  mc_b: string;
  ends_at: string;
  status: string;
  winner_submission_id: number | null;
  has_voted: boolean;
  submission_a_id?: number;
  submission_b_id?: number;
}

export interface Submission {
  id: number;
  user_id: number;
  beat_id: number;
  file_url: string;
  created_at: string;
  votes: number;
}

export interface SubmissionStatus {
  submission_id: number;
  beat_url: string;
  paired: boolean;
  battle_id: number | null;
  opponent_mc: string | null;
  status: string;
  disqualified: boolean;
}

export interface LeaderboardEntry {
  user_id: number;
  mc_name: string;
  profile_url: string;
  total_wins: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AdminAuditEntry {
  id: number;
  admin_id: number;
  admin_name: string;
  action: string;
  target_user_id?: number;
  target_user_name?: string;
  details?: string;
  created_at: string;
}

export interface AdminActionStats {
  total_actions: number;
  promotions: number;
  demotions: number;
  deletions: number;
}

export interface AdminUser {
  id: number;
  mc_name: string;
  email: string;
  is_admin: boolean;
}

// Custom error class to preserve response data
class ApiError extends Error {
  responseData: any;
  statusCode: number;

  constructor(message: string, responseData: any, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.responseData = responseData;
    this.statusCode = statusCode;
  }
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    // console.log('Auth token:', token); // Debug logging
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: any;
      
      try {
        const errorText = await response.text();
        console.log('Error response text:', errorText); // Debug logging
        
        // Try to parse as JSON first to preserve the structured error
        try {
          errorData = JSON.parse(errorText);
        } catch {
          // If not JSON, use the text as is
          errorData = { message: errorText };
        }
        
        // Create a custom error that preserves the structured error data
        const errorMessage = errorData.detail?.message || errorData.message || `HTTP error ${response.status}`;
        const error = new ApiError(errorMessage, errorData, response.status);
        
        throw error;
        
      } catch (parseError) {
        // If we can't parse the error, create a basic error
        const error = new ApiError(`HTTP error! status: ${response.status}`, {}, response.status);
        throw error;
      }
    }
    
    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<LoginResponse>(response);
  }

async register(userData: {
  email: string;
  password: string;
  mc_name: string;
  hometown?: string;
}): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  return this.handleResponse<LoginResponse>(response);
}

  // User endpoints
  async getCurrentUser(userId: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me?user_id=${userId}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<User>(response);
  }

  async getUserStats(userId: number): Promise<UserStats> {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me/stats?user_id=${userId}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<UserStats>(response);
  }

  // Battles
  async getActiveBattles(): Promise<Battle[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/battles/active`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<Battle[]>(response);
  }

  async getFinishedBattles(): Promise<Battle[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/battles/finished`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<Battle[]>(response);
  }

  async getMyBattles(): Promise<Battle[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/battles/me`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<Battle[]>(response);
  }

  async getBattleDetails(battleId: number): Promise<BattleDetail> {
    const response = await fetch(`${API_BASE_URL}/api/v1/battles/${battleId}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<BattleDetail>(response);
  }

  // Voting
  async vote(battleId: number, votedSubmissionId: number): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/v1/votes/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        battle_id: battleId,
        voted_submission_id: votedSubmissionId,
      }),
    });
    
    return this.handleResponse<string>(response);
  }

  // Leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/votes/leaderboard/wins`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<LeaderboardEntry[]>(response);
  }

  // Submissions
  async uploadSubmission(userId: number, data: {
    beat_id: number;
    file_url: string;
    tournament_id?: number;
  }): Promise<Submission> {
    const response = await fetch(`${API_BASE_URL}/api/v1/submissions/?user_id=${userId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<Submission>(response);
  }

  async getMySubmissions(): Promise<SubmissionStatus[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/submissions/me`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<SubmissionStatus[]>(response);
  }

  // Health check
  async getStatus(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/status`);
    return this.handleResponse<string>(response);
  }

  // Debug method to check authentication
  async checkAuth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/battles/active`, {
        headers: this.getAuthHeaders(),
      });
      
      if (response.status === 401) {
        console.error('Authentication failed - token is invalid');
        return false;
      }
      
      return response.ok;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }

  // Admin endpoints
  async removeSubmission(submissionId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/submission/${submissionId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<void>(response);
  }

  async promoteUserToAdmin(userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/${userId}/promote`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<void>(response);
  }

  async demoteAdminUser(userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/${userId}/demote`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<void>(response);
  }

  async getUserAuditHistory(userId: number): Promise<AdminAuditEntry[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/${userId}/audit-history`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<AdminAuditEntry[]>(response);
  }

  async getRecentAdminActions(limit: number = 50): Promise<AdminAuditEntry[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/audit/recent?limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<AdminAuditEntry[]>(response);
  }

  async getAdminActionStats(): Promise<AdminActionStats> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/stats/admin-actions`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<AdminActionStats>(response);
  }

  async uploadBeatAdmin(data: { title: string; file_url: string }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/beats/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<void>(response);
  }

  async checkUserAdminStatus(userId: number): Promise<{ is_admin: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/${userId}/admin-status`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<{ is_admin: boolean }>(response);
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/admins`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<AdminUser[]>(response);
  }
}

export const apiService = new ApiService();