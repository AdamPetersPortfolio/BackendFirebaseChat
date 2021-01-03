
/**
 * Pushes a new message onto the conversation section of the database. Retrives
 * the current time as well as the current user logged in. 
 *
 * @param {String} conversationID The conversation id to be loaded
 * @param {String} message The message content being sent
 * @return {none} 
 */
function sendMessage(conversationID, message) {
  if (message == "") {
    return;
  }
  let senderID = firebase.auth().currentUser.uid;
  let membersRef = firebase.database().ref('Users/' + senderID);
  let messagesRef = firebase.database().ref('Conversations/' + conversationID + '/Messages');
  let senderName = undefined;
  
  membersRef.once("value", function (snapshot) {
    senderName = snapshot.val()['DisplayName'];
  })
    .then(function () {
      let time = moment()
        .utcOffset('+05:30')
        .format('hh:mm a');

      messagesRef.push({ 
        DisplayName: senderName,
        Text: message,
        Timestamp: "" + time,
      }, function (error) {
        if (error) {
          res.status(500).send("Message Creation Failed, " + error);
        }
      });
    });
}
