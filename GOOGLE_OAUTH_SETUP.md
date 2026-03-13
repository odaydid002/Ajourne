# Google OAuth Setup Guide - Fixing Error 400

The "Error 400: invalid_request" occurs when the redirect URI in your app doesn't match Google Cloud Console configuration.

## Fix Steps:

### 1. Get Your Redirect URI
Run this in the Expo terminal to see your exact redirect URI:
```
Check the console logs when you tap "Sign In" - you'll see:
"OAuth Redirect URI: exp://YOUR-DEVICE-IP:PORT/--/expo-auth-session"
```

Or for Expo Go, it's typically:
```
exp://YOUR_MACHINE_IP:19000
```

For development/testing, use the **expo** scheme:
```
exp://localhost
```

### 2. Update Google Cloud Console

**Go to:** [Google Cloud Console](https://console.cloud.google.com/) → OAuth 2.0 Credentials

#### Add Authorized Redirect URIs for Web OAuth 2.0:

1. **For Expo Development (all platforms):**
   - `http://localhost`
   - `http://localhost:3000`
   - `exp://localhost`

2. **For Local Testing:**
   - Add your machine IP: `exp://YOUR_MACHINE_IP:19000`
   - (Check with `ipconfig` on Windows)

3. **For Production Builds:**
   - Use your actual custom scheme from `app.json`
   - Example: `ajourne://`

**Steps to add URIs:**
1. Go to Credentials → OAuth 2.0 Client IDs
2. Select your web client ID
3. Click "Edit OAuth client"
4. Add redirect URIs under "Authorized redirect URIs"
5. **Save** the changes

### 3. Verify app.json Has Correct Scheme

Check `Frontend/Application/app.json`:
```json
{
  "scheme": "ajourne",
  "ios": {
    "bundleIdentifier": "com.ajourne.app"
  },
  "android": {
    "package": "com.ajourne.app"
  }
}
```

### 4. OAuth Consent Screen Setup

1. Go to **OAuth consent screen** in Google Cloud
2. Select **External** app type
3. Fill in:
   - App name: Ajourne
   - User support email: oulhadjoday@gmail.com
   - Developer contact: oulhadjoday@gmail.com
4. Under **Scopes**, ensure these are added:
   - `openid`
   - `profile`
   - `email`
5. Add test users: oulhadjoday@gmail.com

### 5. Verify Client IDs Match

Ensure these in your code match Google Cloud:
```
Web: 377341097281-2qno2phfociue4tp29akos9nb5onk5b8.apps.googleusercontent.com
iOS: 377341097281-fc35qp7ckvibb2cef3iu003de64asa4j.apps.googleusercontent.com
Android: 377341097281-1gilo77o6e6cl0qud5fhmp9d5k30u1eh.apps.googleusercontent.com
```

### 6. For Expo Go Testing

The easiest approach:
1. Use `exp://localhost` as redirect URI
2. Run: `npx expo start`
3. Use a local tunnel or your machine IP
4. The app will show the exact redirect URI in console - add that to Google Cloud

## Debugging

The app now logs detailed information:
- Check console for the actual redirect URI being used
- Error messages will show in an alert and console
- Tap "Debug Info" button in Publisher modal to see config details

## Common Issues

| Error | Solution |
|-------|----------|
| `invalid_request` | Redirect URI mismatch - check Google Cloud config |
| `redirect_uri_mismatch` | Add the URI from console logs to Google Cloud |
| `Client authentication failed` | Wrong Client ID or Client Secret |
| `Authorization server temporarily unavailable` | Google servers issue - try again later |

## Testing Order

1. **Development (Expo Go):**
   - Use `exp://localhost` in Google Cloud
   - Run `npx expo start --clear`

2. **Local Build:**
   - Get actual redirect URI from logs
   - Add to Google Cloud
   - Test with `eas build --platform android --local` (if available)

3. **Production:**
   - Use final app scheme
   - Ensure all three client IDs are in Google Cloud
   - Test with signed APK/IPA

## Reset OAuth Consent Screen (if needed)

1. Go to OAuth consent screen
2. Click "Reset Consent Screen"
3. Reconfigure from scratch
4. This sometimes fixes persistent issues

---

**Still getting errors?**
Check the detailed console logs - they now show exactly what's failing and why!
