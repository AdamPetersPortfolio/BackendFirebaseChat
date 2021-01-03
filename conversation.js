
/**
 * Pushes a new conversation onto the database and adds each member into the
 * conversation. 
 *
 * @param {string} name The new conversation's name.
 * @param {array<string>} members List of user ids to be added to the 
 *                                conversation
 * @return {none}
 */
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

/**
 * Adds conversationID to the current user's list of conversations in the 
 * database. Note: does not add the current user to the conversation section's
 * list of members.  
 *
 * @param {string} conversationID The conversation's id to which the user will
 *                                be added.
 * @return {none}
 */
function joinConversation(conversationID) {
    firebase.database().ref("Users/" + firebase.auth().currentUser.uid + "/Conversations").push(conversationID);
}   

/**
 * Adds the current user to all the chats associated with their top artists.
 *
 * @param {Array<string>} artists A list of artists whose groups the user will 
 *                                join. 
 * @return {Promise<DataSnapshot} A DataSnapshot for the conversation section
 *                                of the databse. 
 */
function joinTopArtists(artists) {
    
    var conversations = firebase.database().ref("Conversations");
    return conversations.once("value", function (snapshot) {
        let data = snapshot.val()
    
        for(let i = 0; i < artists.length; i ++) {
            artistFound = false;
            for (let k in data) {
                // If the conversation for the artist exists, add the user to that 
                // group
                if (data[k]['name'] == artists[i]) {
                    artistFound = true;
                    joinConversation(k);
                }
            }
            // If the conversation for the artist does not exist, create it
            // and add the user to the group. 
            if (!artistFound) {
                createConversation(artists[i], [firebase.auth().currentUser.uid]);
            }
        }
    });
}