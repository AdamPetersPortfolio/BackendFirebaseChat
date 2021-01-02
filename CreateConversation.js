

function createConversation(name, members) {
    let convRef = firebase.database().ref("Conversations");
    let newKey
    convRef.push({
        name: name,
        Messages: 0,
        Members: members
    }).then((snap) => {
        newKey = snap.key;

        for (let i = 0; i < members.length; i++) {
            firebase.database().ref("Users/" + members[i] + "/Conversations").push(newKey);
        }
    });
}

function joinConversation(conversationID) {
    firebase.database().ref("Users/" + firebase.auth().currentUser.uid + "/Conversations").push(conversationID);
}

function joinTopArtists(artists) {
    
    var conversations = firebase.database().ref("Conversations");
    return conversations.once("value", function (snapshot) {
        let data = snapshot.val()
    
        for(let i = 0; i < artists.length; i ++) {
            artistFound = false;
            for (let k in data) {
                if (data[k]['name'] == artists[i]) {
                    artistFound = true;
                    joinConversation(k);
                }
            }
            if (!artistFound) {
                createConversation(artists[i], [firebase.auth().currentUser.uid]);
            }
        }
    });
}