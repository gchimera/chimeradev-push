require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});
const db = admin.firestore();

// POST /send { userId, title, body }
app.post('/send', async (req, res) => {
  const { userId, title, body } = req.body;
  if (!userId || !title || !body) {
    return res.status(400).json({ error: 'userId, title, and body are required' });
  }
  try {
    // Fetch FCM token from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    const fcmToken = userDoc.get('fcmToken');
    if (!fcmToken) {
      return res.status(404).json({ error: 'FCM token not found for user' });
    }
    // Prepare message
    const message = {
      token: fcmToken,
      notification: { title, body },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        title,
        body,
        timestamp: Date.now().toString()
      },
      android: { priority: 'high' },
      apns: {
        payload: {
          aps: { sound: 'default', badge: 1 }
        }
      }
    };
    // Send notification
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 