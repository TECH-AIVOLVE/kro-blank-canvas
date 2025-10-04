// Error code to user-friendly message mapping
export const ErrorMessages: { [key: number]: string } = {
  // Authentication errors (1100-1199)
  1101: 'The email or password you entered is incorrect. Please try again.',
  1102: 'No account found with this email. Would you like to sign up instead?',
  1103: 'Your account has been temporarily disabled. Please contact support.',
  1104: 'Password verification failed. Please try again or reset your password.',
  
  // Request errors (1300-1399)
  1301: 'Please fill in all required fields.',
  1302: 'Please enter a valid email address.',
  1303: 'There was a problem with your request. Please check your input.',
  
  // Database errors (1400-1499)
  1401: 'Temporary server issue. Please try again in a moment.',
  1402: 'An account with this email already exists. Try logging in instead.',
  
  // Server errors (1500-1599)
  1501: 'Server is temporarily unavailable. Please try again later.',
  
  // Unknown errors (1600-1699)
  1601: 'Something went wrong. Please try again.',
};

// Fallback messages for HTTP status codes
export const StatusMessages: { [key: number]: string } = {
  400: 'Please check your input and try again.',
  401: 'Your session has expired. Please log in again.',
  403: "You don't have permission to access this.",
  404: 'The requested resource was not found.',
  500: 'Server is temporarily unavailable. Please try again later.',
  502: 'Server is down for maintenance. Please try again later.',
  503: 'Service is temporarily unavailable. Please try again later.',
};

// Helper function to get user-friendly error message
export const getUserFriendlyError = (error: any): string => {
  // If it's already a user-friendly string, return it
  if (typeof error === 'string') {
    return error;
  }
  
  // If it's an Error object with response data
  if (error instanceof Error && 'response' in error) {
    const apiError = error as any;
    try {
      const errorData = apiError.response?.data;
      
      // Check for our structured error format with error_code
      if (errorData?.detail?.error_code) {
        const userMessage = ErrorMessages[errorData.detail.error_code];
        if (userMessage) {
          return userMessage;
        }
      }
      
      // Check for message in detail
      if (errorData?.detail?.message) {
        return errorData.detail.message;
      }
      
      // Check for top-level message
      if (errorData?.message) {
        return errorData.message;
      }
      
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
  }
  
  // Fallback to generic message
  return 'Something went wrong. Please try again.';
};