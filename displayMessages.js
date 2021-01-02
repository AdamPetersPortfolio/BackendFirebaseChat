
function displayMessages(mesages, username) {
    for (let i = messages.length - 1; i >= 0; i--) {
        let classes = "message " + (username == messages["DisplayName"] ?
            "outgoing" : "incoming");
        $('#messages').prepend('<span class="""+classes" id=""message"+i"></span>');
    }
}

function listenAndLoadMessages(i) {


    gettingFirstMessages = true;
    setTimeout(() => { gettingFirstMessages = false }, 1000);

    var counter = 0;
    let senderID = firebase.auth().currentUser.uid;

    let membersRef = firebase.database().ref('Users/' + senderID);
    let senderName;

    membersRef.once("value", function (snapshot) {
        senderName = snapshot.val()['DisplayName'];
    }).then(() => {
        let convRef = firebase.database().ref('Conversations/' + conversationIDs[i - 1] + '/Messages');
        convRef.on("child_added", (snapshot) => {
            let message = snapshot.val();
            if (message['Text'] != "" && message['Text'] !== "" && message['Text'] != null && message['Text'] != undefined) {
                let classes = "message-content " + (senderName == message["DisplayName"] ?
                    "outgoing" : "incoming");


                var date = moment.utc(message['Timestamp'], 'hh:mm a').add(-5,"hours").add(-30, "minutes")
                var time = date.local().format("MM/DD hh:mm a");

                $('#messages').append('<p style="margin-bottom: 5px;font-size: 12px; float: ' +(senderName == message["DisplayName"] ?
                "right" : "left") +';">'+message["DisplayName"]+': ' + time +'</p>');
                $('#messages').append('<div style="width: 100%;overflow: auto;"><span class="' + classes + '" id="message' + counter + '"></span></div></br>');

                $('#message' + counter).html(message['Text']);
                counter++;
            }

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

function createMessageBox(i) {
    $('#conversationWrapper').remove();
    $('#whole').append('<div id="conversationWrapper"></div>');
    $('#conversationWrapper').append('<span><h2>' + conversationNames[i - 1] + '</h2></span>');
    $('#conversationWrapper').append('<div id="messageBox"></div>');
    $('#conversationWrapper').append('<span id="sendMessageWrapper"></span>');
    $('#messageBox').append('<div id="messageWrapper" style="height: 500px"></div>');

    for(let z = 0; z < conversationIDs.length; z ++) {
        let convRef = firebase.database().ref('Conversations/' + conversationIDs[z] + '/Messages');
        convRef.off()
    }

    $('#messageWrapper').append('<div id="messages"></div>');
    $('#sendMessageWrapper').append('<form onsubmit="return createAndSendMessage(' + i + ')" id="messageForm"></form>');
    $('#messageForm').append('<input type="text" id="sendMessage" ></input>');
    $('#messageForm').append('<input id="sendButton" type="submit" value="send"></input>');

    listenAndLoadMessages(i);
}

function createAndSendMessage(i) {
    let message = $("#sendMessage").val();
    let convID = conversationIDs[i - 1]

    sendMessage(convID, message);

    $("#sendMessage").val('');
    return false;
}
