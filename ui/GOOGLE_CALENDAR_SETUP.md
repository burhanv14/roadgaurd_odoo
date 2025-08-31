# Google Calendar API Setup Guide

## Overview
The calendar feature now integrates with Google Calendar API to provide real-world calendar functionality. Follow these steps to set up the integration.

## Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**
   - Create a new project or select an existing one
   - Note the project ID for reference

3. **Enable Google Calendar API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

## Step 2: Create Credentials

### API Key (for public API access)
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to Google Calendar API only

### OAuth 2.0 Client ID (for user authentication)
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Configure the OAuth consent screen first if prompted
4. Choose "Web application" as application type
5. Add authorized origins:
   - `http://localhost:5173` (for development)
   - Your production domain (for production)
6. Copy the generated Client ID

## Step 3: Update Environment Variables

Update your `.env` file in the `ui` folder:

```env
# Existing configuration
VITE_API_BASE_URL=http://localhost:3001

# Google Calendar API Configuration
VITE_GOOGLE_API_KEY=your_actual_google_api_key_here
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_CALENDAR_ID=primary
```

## Step 4: Test the Integration

1. **Start the development server**
   ```cmd
   cd ui
   npm run dev
   ```

2. **Login as a mechanic**
   - Navigate to the mechanic dashboard
   - The calendar view should now show

3. **Authenticate with Google**
   - Click the "Sign in with Google" button when prompted
   - Grant calendar permissions
   - The calendar should load your Google Calendar events

## Development Mode

If you don't have Google API credentials yet, the system will automatically use mock data for development and testing purposes. You'll see sample calendar events that demonstrate the functionality.

## Features Available

- **View Calendar Events**: See all your scheduled work/services
- **Event Details**: Click on events to see customer info, service type, and priority
- **Google Integration**: Real calendar events from your Google Calendar
- **Responsive Design**: Works on desktop and mobile devices

## Troubleshooting

### Common Issues

1. **"API Key not configured" error**
   - Ensure VITE_GOOGLE_API_KEY is set in .env file
   - Verify the API key is valid and has Calendar API access

2. **Authentication fails**
   - Check VITE_GOOGLE_CLIENT_ID is correct
   - Verify authorized origins in Google Cloud Console
   - Ensure OAuth consent screen is configured

3. **No events showing**
   - Check calendar permissions were granted
   - Verify you have events in your Google Calendar
   - Check browser console for any errors

### Mock Data Fallback

If Google Calendar integration fails, the system automatically falls back to mock data. This ensures the calendar view always works for development and demo purposes.

## Production Deployment

For production deployment:

1. Update authorized origins in Google Cloud Console
2. Set production environment variables
3. Consider using Google Calendar service account for backend integration
4. Test authentication flow thoroughly

## Security Notes

- Never commit real API keys to version control
- Use environment variables for all credentials
- Restrict API keys to necessary services only
- Consider implementing proper user consent flow
