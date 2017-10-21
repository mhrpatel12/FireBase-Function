'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotificationToAllMembers = functions.database.ref('/chatRoom/{messageNode}').onWrite(event => {
  const messageInfo = event.params.messageNode;

  // Get the list of device notification tokens.
  const getDeviceTokensPromise = admin.database().ref(`/deviceTokens`).once('value');

  // Get newly added Message detail
  const getMovieMessageDetail = admin.database().ref(`/chatRoom/${messageInfo}`).once('value');

  return Promise.all([getDeviceTokensPromise, getMovieMessageDetail]).then(results => {
    const deviceTokensList = results[0];
    const MessageDetail = results[1];
	const MessageText = MessageDetail.child('messageText').val();
	const MessageUser = MessageDetail.child('messageUser').val();
	
    // Check if there are any device tokens.
    if (deviceTokensList.hasChildren() == 0) {
      return console.log('There are no notification tokens to send to.');
    }
    console.log('There are', deviceTokensList.hasChildren(), 'tokens to send notifications to.');
	

    // Notification details.
    const payload = {
      notification: {
        title: MessageUser,
        body: MessageText
      }
    };

    // Listing all tokens.
    const tokens = [];
	deviceTokensList.forEach((token, index) => {
		tokens.push(token.child('deviceToken').val());
	});
	
	console.log('tokens' ,tokens);
	// Send notifications to all tokens.
    return admin.messaging().sendToDevice(tokens, payload).then(response => {
      // For each message check if there was an error.
      response.results.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error('Failure sending notification to', tokens[index], error);
        }
      });
    });
  });
});
