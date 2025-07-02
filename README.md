# Push Notification Server

A Node.js Express server for sending push notifications via Firebase Cloud Messaging (FCM) to iOS and Android devices. Designed for deployment on Render.com.

## Features
- Fetches FCM tokens from Firestore (`users/{userId}/fcmToken`)
- Sends notifications to iOS and Android via FCM
- Ready for cloud deployment

## Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase service account JSON (as a single line) and project ID

4. **Run locally:**
   ```bash
   npm start
   ```

## Environment Variables
- `FIREBASE_SERVICE_ACCOUNT_JSON`: The full JSON string of your Firebase service account (escape newlines or use a single line)
- `FIREBASE_PROJECT_ID`: Your Firebase project ID

## API
### POST /send
Send a push notification to a user.

**Request Body:**
```
{
  "userId": "string",
  "title": "string",
  "body": "string"
}
```

**Response:**
- `200 OK` with `{ success: true, response }` on success
- `4xx/5xx` with `{ error: ... }` on error

## Deploying to Render.com
- Add the environment variables in the Render dashboard
- Set the start command to `npm start`
- The server will listen on the port provided by Render 