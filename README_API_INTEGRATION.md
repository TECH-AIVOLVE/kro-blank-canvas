# API Integration Guide

## Overview
This RhymeRivals Arena frontend is now configured to work with your existing backend API. All mock data has been replaced with real API calls.

## Setup

1. **Environment Configuration**
   - Copy `.env.example` to `.env.local`
   - Update `REACT_APP_API_URL` to point to your backend URL
   - Default: `http://localhost:8000`

2. **API Endpoints Used**
   - Authentication: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`
   - Battles: `GET /api/v1/battles/active`, `GET /api/v1/battles/finished`
   - Voting: `POST /api/v1/votes/`
   - Leaderboard: `GET /api/v1/votes/leaderboard/wins`
   - Submissions: `POST /api/v1/submissions/`, `GET /api/v1/submissions/me`
   - User: `GET /api/v1/users/me`, `GET /api/v1/users/me/stats`

## Authentication Flow

1. **Login/Register**: User credentials are sent to backend
2. **Token Storage**: JWT token is stored in localStorage as `authToken`
3. **API Calls**: All subsequent API calls include `Authorization: Bearer <token>` header

## File Upload Considerations

The submission form currently generates a mock file URL. You'll need to implement:
- File upload endpoint or direct storage upload (S3, etc.)
- Return actual file URL for submission API

## Missing API Endpoints

If you need additional endpoints, consider adding:
- `GET /api/v1/beats/` - List available beats for submissions
- `GET /api/v1/users/profile/:id` - Get user profile data
- File upload endpoints for audio submissions

## Error Handling

- All API errors are caught and displayed to users via toast notifications
- Network errors and validation errors are handled gracefully
- Loading states are shown during API calls

## Components Updated

- ✅ LoginForm - Real authentication
- ✅ RegisterForm - Real user creation  
- ✅ Dashboard - Live battle data
- ✅ Leaderboard - Real rankings
- ✅ Submit - Real submission API (needs file upload)
- ✅ BattleCard - Real voting system

## Next Steps

1. Start your backend server
2. Update `.env.local` with correct API URL
3. Test the authentication flow
4. Implement file upload for submissions
5. Add any missing API endpoints as needed

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Your backend should be running on the configured URL
```