'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('/Notifchat/{user_id}').onWrite(event =>{
	const user_id = event.params.user_id;

	console.log('We have a message to send to: ',user_id);
	
	if (!event.data.val()) {

		return console.log('A notification has been deleted from database: ',notification_id);

	}
	const fromUser = admin.database().ref(`/Notifchat/${user_id}`).once('value');
	return fromUser.then(fromUserResult =>{
		const from_user_id = fromUserResult.val().from;
		const message_id = fromUserResult.val().chat_id;
		console.log('You have message from : ',from_user_id);

		const userQuery = admin.database().ref(`Users/${from_user_id}`).once('value');
		return userQuery.then(userResult =>	{

			const userName = userResult.val().name;
			console.log('You have notification from : ',userName);

			const messageQuery = admin.database().ref(`/messages/${from_user_id}/${user_id}/${message_id}`).once('value');
			return messageQuery.then(messageResult =>{

				const message_text = messageResult.val().message;
				console.log('Message  : ',message_text);

				const deviceToken = admin.database().ref(`/Users/${user_id}/device_token`).once('value');

				return deviceToken.then(result =>{
					const token_id = result.val();
					console.log('Token id is: ',token_id);

					const payload = {

						notification:{
							title: "Message",
							body: `${message_text}`,
							icon: "default",
							click_action: "com.kadek.tripgo_TARGET_NOTIFICATION"
						},
						data:{
							user_id: from_user_id,
							user_name: userName

						}

					};

					return admin.messaging().sendToDevice(token_id, payload).then(response =>{
						console.log('This was the notification Feature');
					});

				});	

			})

		});

	});

});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
