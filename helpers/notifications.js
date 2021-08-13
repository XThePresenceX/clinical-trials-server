var admin = require('firebase-admin');
var serviceAccount = require("../cognizance-vct-firebase-adminsdk-dp23p-0087e6b768.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cognizance-vct.firebaseio.com"
});

class Notifications {
  sendNotification(notificationDevices, data) {
      let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
          notification: data,
          tokens: notificationDevices.map(notificationDevice => notificationDevice.notificationToken)
      };
      console.log(JSON.stringify(message, undefined, 4));
      admin.messaging().sendMulticast(message).then((response) => {
        console.log("Success");
        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              console.log(resp.error.code);
              failedTokens.push(message.tokens[idx]);
            }
            else {
              console.log(resp.messageId);
            }
          });
          console.log('List of tokens that caused failures: ' + failedTokens);
        }
      });
  }
}

const notifications = new Notifications();
module.exports = notifications;
