const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createWherebyMeeting = functions.https.onCall(async (data, context) => {
  // Esta función ya no es necesaria con WebRTC, pero la dejamos por compatibilidad
  return {
    roomUrl: 'webrtc-direct-connection',
    firestoreId: 'webrtc-' + Date.now()
  };
});