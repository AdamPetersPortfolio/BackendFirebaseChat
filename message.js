function sendMessage(conversationID, message) {
  if (message === "" || message == "") {
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
