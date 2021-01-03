/**
 * Loads all messages of the conversation into the messages div, and listen and 
 * update the DOM if any new messages are sent or recieved. Specifically, all 
 * messages are either in the outgoing or incoming class and contain content  
 * and a timeStamp. 
 *
 * @param {String} conversationID The conversation id to be loaded
 * @return {none} 
 */
function listenAndLoadMessages(conversationID) {
    gettingFirstMessages = true;
    setTimeout(() => { gettingFirstMessages = false }, 1000);

    var counter = 0;
    let senderID = firebase.auth().currentUser.uid;

    let membersRef = firebase.database().ref('Users/' + senderID);
    let senderName;

    // Get the current user's display name
    membersRef.once("value", function (snapshot) {
        senderName = snapshot.val()['DisplayName'];
    }).then(() => {
        // Add a new message to the DOM whenever a message is added to the 
        // databse
        let convRef = firebase.database().ref('Conversations/' + conversationID 
                                              + '/Messages');
        convRef.on("child_added", (snapshot) => {
            let message = snapshot.val(); // Message to be loaded onto the DOM
            // Ensure that you are not sending an empty message
            if (message['Text'] != "" && message['Text'] !== "" 
                && message['Text'] != null && message['Text'] != undefined) {
                
                    // Determine if message was sent or recieved
                let classes = "message-content " + (senderName == message["DisplayName"] ?
                    "outgoing" : "incoming");
                
                // Get the time at which the message was sent and convert to est
                var date = moment.utc(message['Timestamp'], 'hh:mm a').add(-5,"hours").add(-30, "minutes")
                var time = date.local().format("MM/DD hh:mm a");

                // Add message to dom with correct content and timestamp
                $('#messages').append('<p style="margin-bottom: 5px;font-size: 12px; float: ' +(senderName == message["DisplayName"] ?
                "right" : "left") +';">'+message["DisplayName"]+': ' + time +'</p>');
                $('#messages').append('<div style="width: 100%;overflow: auto;"><span class="' + classes + '" id="message' + counter + '"></span></div></br>');

                $('#message' + counter).html(message['Text']);
                counter++;
            }
            
            // Ensure scrolling is smooth for the first messages recieved and 
            // all subsequent messages. 
            if (gettingFirstMessages) {
                var div = document.getElementById("messageBox");
                $('#' + "messageBox").animate({
                    scrollTop: div.scrollHeight - div.clientHeight
                }, 5);
            } else {
                var div = document.getElementById("messageBox");
                if (div.scrollHeight > div.clientHeight) {
                    $('#' + "messageBox").animate({
                        scrollTop: div.scrollHeight - div.clientHeight
                    }, 500);
                }
            }
        });
    });
}

/**
 * Creates container for conversation (contains a title, message section, and 
 * send button) and loads all messages. 
 *
 * @param {String} conversationID The conversation id to be loaded
 * @param {String} conversationName The conversation name to be loaded
 * @return {none} 
 */
function createMessageBox(conversationID, conversationName) {
    $('#conversationWrapper').remove();
    $('body').append('<div id="conversationWrapper"></div>');
    $('#conversationWrapper').append('<span><h2>' + conversationName + '</h2></span>');
    $('#conversationWrapper').append('<div id="messageBox"></div>');
    $('#conversationWrapper').append('<span id="sendMessageWrapper"></span>');
    $('#messageBox').append('<div id="messageWrapper" style="height: 500px"></div>');

    // Remove old conversation listeners
    for(let z = 0; z < conversationIDs.length; z ++) {
        let convRef = firebase.database().ref('Conversations/' + conversationID + '/Messages');
        convRef.off()
    }

    $('#messageWrapper').append('<div id="messages"></div>');
    $('#sendMessageWrapper').append('<form onsubmit="return createAndSendMessage(' + conversationID + ')" id="messageForm"></form>');
    $('#messageForm').append('<input type="text" id="sendMessage" ></input>');
    $('#messageForm').append('<input id="sendButton" type="submit" value="send"></input>');

    listenAndLoadMessages(conversationID);
}

/**
 * Retrieves the message being sent from the front end and sends that message 
 * to the databse. 
 *
 * @param {String} conversationID The conversation id to be loaded
 * @return {none} 
 */
function createAndSendMessage(conversationID) {
    let message = $("#sendMessage").val();
    let convID = conversationID

    sendMessage(convID, message);

    $("#sendMessage").val('');
}
